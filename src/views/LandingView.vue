<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { useAlertStore } from '@/stores/alertStore'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const alertStore = useAlertStore()

// 미니 공정 물리 시뮬레이터 인터랙티브 상태 (Vue 3 ref + v-model)
const simTemp = ref(28)
const simHumidity = ref(70)

// 시뮬레이션 기반 공정 물리 연산치 (Vue 3 computed)
const simMachineExpansion = computed(() => {
  // 창원 정밀 기계: 20℃ 기준 1℃당 1.5μm 팽창
  return Number((Math.max(0, simTemp.value - 20) * 1.5 + 3.0).toFixed(1))
})

const simChemicalCorrosion = computed(() => {
  // 울산 석유화학: 습도 75% + 온도 가산
  return Math.min(100, Math.round(simHumidity.value * 0.75 + (simTemp.value > 28 ? 20 : 5)))
})

const simPressOilTemp = computed(() => {
  // 군산 프레스: 외기온에 따른 유압유 온도
  return Math.round(simTemp.value * 1.15 + 22)
})

const simCleanroomStatus = computed(() => {
  // 광주 반도체 클린룸
  if (simHumidity.value >= 80) return { label: '⚠️ 고습도 수분 흡착 경계', type: 'warning' }
  if (simHumidity.value <= 35) return { label: '⚡ 저습도 정전기(ESD) 주의', type: 'danger' }
  return { label: '✅ 클린룸 공조 최적 안정', type: 'success' }
})

// 관제 현황 통계
const normalCount = computed(() => {
  const total = weatherStore.complexes.length
  return Math.max(0, total - alertStore.dangerCount)
})

onMounted(async () => {
  if (
    !weatherStore.complexes ||
    weatherStore.complexes.length === 0 ||
    !weatherStore.complexes[0].rawLoaded
  ) {
    await weatherStore.fetchLiveWeatherData()
  }
})

const handleGoDashboard = () => {
  router.push('/dashboard')
}

const handleGoRadar = () => {
  router.push('/radar')
}

const handleGoDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="landing-page-container">
    <!-- 🍎 1. Hero Showcase Section -->
    <section class="landing-hero-section">
      <div class="hero-eyebrow-badge">
        <span class="live-blink-dot"></span>
        <span>스마트 팩토리 기상 연동 설비 물리 관제 플랫폼</span>
      </div>

      <h1 class="landing-main-title">
        기상 변화가 산업단지 설비에 미치는<br />
        <span class="gradient-text">물리적 위험을 실시간으로 관제합니다</span>
      </h1>

      <p class="landing-main-desc">
        대한민국 6대 국가산업단지(창원, 울산, 군산, 광주, 포항, 여수)의 OpenWeatherMap 실시간 기상
        관측 데이터를 기반으로<br class="hidden-mobile" />
        설비 열변형(μm) · 배관 염해 부식 · 유압유 과열 · 클린룸 차압 위험을 선제적으로 예측하고
        대응합니다.
      </p>

      <div class="hero-cta-button-group">
        <el-button
          type="primary"
          size="large"
          round
          class="hero-cta-btn primary-cta"
          @click="handleGoDashboard"
        >
          🚀 산단 대시보드 바로가기 →
        </el-button>
        <el-button size="large" round class="hero-cta-btn secondary-cta" @click="handleGoRadar">
          🛰️ 전국 기상 레이더
        </el-button>
      </div>

      <!-- 관제 현황 실시간 요약 카운터 뱃지 바 -->
      <div class="hero-kpi-pill-row">
        <div class="kpi-pill">
          <span class="kpi-dot dot-avg"></span>
          <span
            >전국 평균 외기온: <strong>{{ weatherStore.averageTemp }}℃</strong></span
          >
        </div>
        <div class="kpi-pill">
          <span class="kpi-dot dot-normal"></span>
          <span
            >안정 가동: <strong>{{ normalCount }}개소</strong></span
          >
        </div>
        <div class="kpi-pill">
          <span class="kpi-dot dot-danger"></span>
          <span
            >특보/주의 발령: <strong>{{ alertStore.dangerCount }}개소</strong></span
          >
        </div>
      </div>

      <!-- 🎮 3D 인터랙티브 산업단지 관제 콘솔 목업 프리뷰 (Industrial HUD Preview) -->
      <div class="hero-mockup-wrapper" @click="handleGoDashboard">
        <div class="mockup-frame">
          <!-- 상단 윈도우 헤더 바 -->
          <div class="mockup-header-bar">
            <div class="mockup-traffic-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <div class="mockup-header-title font-mono">
              ⚡ SKALA INDUSTRIAL COMMAND CONSOLE · 6 SITES LIVE TELEMETRY
            </div>
            <div class="mockup-header-status font-mono">
              <span class="pulse-green">●</span> ONLINE
            </div>
          </div>

          <!-- 내부 2열 콘솔 뷰포트 -->
          <div class="mockup-content-grid">
            <!-- 좌측: 대한민국 6대 산단 레이더 펄스 맵 프리뷰 -->
            <div class="mockup-map-pane">
              <div class="pane-title-row">
                <span class="pane-tag font-mono">MAP VIEW</span>
                <span class="pane-label">전국 6대 국가산단 실시간 관측망</span>
              </div>
              <div class="map-svg-viewport">
                <svg viewBox="0 0 280 320" class="mini-korea-svg">
                  <!-- 한반도 간략 윤곽선 -->
                  <path
                    d="M 90 20 Q 140 10 180 30 Q 210 60 220 120 Q 230 180 240 230 Q 210 280 160 300 Q 120 310 90 290 Q 60 260 50 200 Q 40 140 60 80 Z"
                    class="svg-peninsula"
                  />
                  <!-- 산단 핀 & 펄스 링 (6대 거점) -->
                  <g class="map-node" transform="translate(170, 240)">
                    <circle r="14" class="pulse-ring" />
                    <circle r="4" class="node-dot dot-cyan" />
                    <text x="8" y="4" class="node-label">
                      창원 {{ configStore.formatTemp(weatherStore.complexes[0]?.temp || 25) }}
                    </text>
                  </g>
                  <g class="map-node" transform="translate(205, 220)">
                    <circle r="14" class="pulse-ring" />
                    <circle r="4" class="node-dot dot-cyan" />
                    <text x="8" y="4" class="node-label">
                      울산 {{ configStore.formatTemp(weatherStore.complexes[1]?.temp || 26) }}
                    </text>
                  </g>
                  <g class="map-node" transform="translate(95, 190)">
                    <circle r="12" class="pulse-ring" />
                    <circle r="4" class="node-dot dot-cyan" />
                    <text x="-52" y="4" class="node-label">
                      군산 {{ configStore.formatTemp(weatherStore.complexes[2]?.temp || 24) }}
                    </text>
                  </g>
                  <g class="map-node" transform="translate(100, 250)">
                    <circle r="12" class="pulse-ring" />
                    <circle r="4" class="node-dot dot-cyan" />
                    <text x="-52" y="4" class="node-label">
                      광주 {{ configStore.formatTemp(weatherStore.complexes[3]?.temp || 25) }}
                    </text>
                  </g>
                  <g class="map-node" transform="translate(210, 185)">
                    <circle r="12" class="pulse-ring" />
                    <circle r="4" class="node-dot dot-cyan" />
                    <text x="8" y="4" class="node-label">
                      포항 {{ configStore.formatTemp(weatherStore.complexes[4]?.temp || 24) }}
                    </text>
                  </g>
                  <g class="map-node" transform="translate(150, 275)">
                    <circle r="12" class="pulse-ring" />
                    <circle r="4" class="node-dot dot-cyan" />
                    <text x="8" y="4" class="node-label">
                      여수 {{ configStore.formatTemp(weatherStore.complexes[5]?.temp || 24) }}
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            <!-- 우측: 실시간 텔레메트리 & 24시간 예측 트렌드 그래프 프리뷰 -->
            <div class="mockup-chart-pane">
              <div class="pane-title-row">
                <span class="pane-tag font-mono">TREND & RISK</span>
                <span class="pane-label">공정 물리 손상 예측 곡선</span>
              </div>
              <div class="chart-svg-viewport">
                <svg viewBox="0 0 320 160" class="mini-trend-svg">
                  <!-- 그리드 라인 -->
                  <line x1="0" y1="40" x2="320" y2="40" stroke="rgba(255,255,255,0.06)" />
                  <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.06)" />
                  <line x1="0" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.06)" />

                  <!-- 예측 기온 곡선 (Blue) -->
                  <path
                    d="M 10 110 Q 80 130 160 50 T 310 70"
                    fill="none"
                    stroke="#2997ff"
                    stroke-width="2.5"
                  />
                  <!-- 설비 열변형 한계 곡선 (Orange) -->
                  <path
                    d="M 10 95 Q 80 115 160 35 T 310 55"
                    fill="none"
                    stroke="#ff9f0a"
                    stroke-width="1.8"
                    stroke-dasharray="4 3"
                  />
                  <!-- 위험 피크 포인트 -->
                  <circle
                    cx="160"
                    cy="50"
                    r="5"
                    fill="#2997ff"
                    stroke="#ffffff"
                    stroke-width="1.5"
                  />
                  <circle cx="160" cy="35" r="4" fill="#ff453a" />
                  <text x="170" y="38" class="peak-annotation font-mono">15:00 피크 +18.5μm</text>
                </svg>

                <!-- 하단 산단 미니 텔레메트리 칩 3종 -->
                <div class="mockup-mini-chips-row font-mono">
                  <div class="mini-chip">
                    <span class="mc-name">창원 CNC</span>
                    <strong class="mc-val text-warn">+7.5μm</strong>
                  </div>
                  <div class="mini-chip">
                    <span class="mc-name">울산 배관</span>
                    <strong class="mc-val">부식 52%</strong>
                  </div>
                  <div class="mini-chip">
                    <span class="mc-name">광주 클린룸</span>
                    <strong class="mc-val text-good">양압 정상</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 목업 하단 클릭 유도 바 -->
          <div class="mockup-footer-bar">
            <span class="footer-hint"
              >💡 대시보드로 이동하여 6대 국가산단 상세 관제 및 24시간 시뮬레이션을 실행하세요
              →</span
            >
          </div>
        </div>
      </div>

      <!-- 2. 실시간 전국 산단 기상 라이브 티커 바 (Bento Preview) -->
      <div class="live-ticker-band">
        <div class="ticker-inner-row">
          <div
            v-for="item in weatherStore.complexes"
            :key="item.id"
            class="ticker-complex-chip"
            @click="handleGoDetail(item.id)"
          >
            <span class="chip-name">{{ item.name }}</span>
            <span class="chip-temp font-mono">{{ configStore.formatTemp(item.temp) }}</span>
            <span class="chip-status">{{ item.status }}</span>
            <span class="chip-risk font-mono">{{ item.processRiskText }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 🍎 2. 인터랙티브 미니 공정 물리 시뮬레이터 (Vue 3 Reactivity 데모) -->
    <section class="landing-simulator-section">
      <el-card shadow="never" class="sim-interactive-card" :body-style="{ padding: '24px 28px' }">
        <div class="sim-header">
          <div>
            <div class="sim-title-row">
              <span class="sim-icon">⚡</span>
              <h3 class="sim-title">인터랙티브 공정 물리 위험도 시뮬레이터</h3>
            </div>
            <p class="sim-desc">
              가상 외기온과 습도 슬라이더를 움직여 각 공정 설비의 물리 변형 수치가 어떻게 실시간
              계산되는지 직접 체험해보세요.
            </p>
          </div>
          <el-tag size="small" type="primary" effect="plain" round>Vue 3 Computed 엔진</el-tag>
        </div>

        <div class="sim-controls-grid">
          <div class="sim-slider-col">
            <div class="slider-title-bar">
              <span>외기 기온 설정:</span>
              <strong class="slider-val font-mono">{{ simTemp }} ℃</strong>
            </div>
            <el-slider v-model="simTemp" :min="15" :max="42" :step="1" />
          </div>

          <div class="sim-slider-col">
            <div class="slider-title-bar">
              <span>대기 습도 설정:</span>
              <strong class="slider-val font-mono">{{ simHumidity }} %</strong>
            </div>
            <el-slider v-model="simHumidity" :min="20" :max="98" :step="2" />
          </div>
        </div>

        <!-- 4개 공정 실시간 연산 반응형 결과 카드 -->
        <div class="sim-output-grid">
          <div class="sim-box">
            <span class="box-tag">정밀 기계 (창원)</span>
            <span class="box-metric-title">CNC Spindle 열변형</span>
            <strong
              class="box-metric-val font-mono"
              :class="{ 'val-warn': simMachineExpansion > 10 }"
            >
              +{{ simMachineExpansion }} μm
            </strong>
            <span class="box-sub">허용 공차 한계: ±5.0μm</span>
          </div>

          <div class="sim-box">
            <span class="box-tag">석유화학 (울산)</span>
            <span class="box-metric-title">옥외 배관 염해 부식도</span>
            <strong
              class="box-metric-val font-mono"
              :class="{ 'val-warn': simChemicalCorrosion >= 70 }"
            >
              {{ simChemicalCorrosion }} %
            </strong>
            <span class="box-sub">{{
              simChemicalCorrosion >= 70 ? '부식 방지 밸브 잠금 필요' : '안정 가동 범위'
            }}</span>
          </div>

          <div class="sim-box">
            <span class="box-tag">대형 프레스 (군산)</span>
            <span class="box-metric-title">작동유/유압유 추정온도</span>
            <strong class="box-metric-val font-mono" :class="{ 'val-warn': simPressOilTemp >= 60 }">
              {{ simPressOilTemp }} ℃
            </strong>
            <span class="box-sub">{{
              simPressOilTemp >= 60 ? '유압 칠러 쿨러 증설' : '유압 점도 안정'
            }}</span>
          </div>

          <div class="sim-box">
            <span class="box-tag">반도체 (광주)</span>
            <span class="box-metric-title">클린룸 환경 평가</span>
            <el-tag
              size="small"
              :type="simCleanroomStatus.type"
              effect="light"
              round
              style="margin-top: 6px"
            >
              {{ simCleanroomStatus.label }}
            </el-tag>
            <span class="box-sub" style="margin-top: 6px">정밀 항온·항습 제어 연동</span>
          </div>
        </div>
      </el-card>
    </section>

    <!-- 🍎 3. 3대 핵심 엔지니어링 가치 카드 섹션 -->
    <section class="landing-features-section">
      <div class="section-title-wrap">
        <h2 class="section-title">스마트 제조 인프라를 위한 3단계 방어 체계</h2>
        <p class="section-sub">
          단순 날씨 조회를 넘어, 실제 공정 설비의 손실을 방지하는 엔지니어링 메커니즘을 제공합니다.
        </p>
      </div>

      <el-row :gutter="20">
        <el-col :xs="24" :sm="8">
          <el-card
            shadow="hover"
            class="landing-feature-card"
            :body-style="{ padding: '28px 24px' }"
          >
            <div class="card-icon-circle bg-blue">⚡</div>
            <h3 class="card-feature-title">OpenWeatherMap 실시간 연동</h3>
            <p class="card-feature-desc">
              Current Weather, 5-Day Forecast, Air Pollution 4종 API 엔드포인트를 결합하여 30초
              주기로 전국 산단 기상 및 대기질을 계측합니다.
            </p>
            <div class="card-feature-footer">
              <span class="tech-tag">Axios Pipeline</span>
              <span class="tech-tag">30s Polling</span>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="8">
          <el-card
            shadow="hover"
            class="landing-feature-card"
            :body-style="{ padding: '28px 24px' }"
          >
            <div class="card-icon-circle bg-orange">⚙️</div>
            <h3 class="card-feature-title">공정별 설비 물리 손상 모델</h3>
            <p class="card-feature-desc">
              기계 가공의 열변형 오차(+μm), 석유화학 배관 염해 부식도(%), 반도체 클린룸 차압 파티클
              부하를 실시간 수치로 연산합니다.
            </p>
            <div class="card-feature-footer">
              <span class="tech-tag">Physical Loss Model</span>
              <span class="tech-tag">Smart Telemetry</span>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="8">
          <el-card
            shadow="hover"
            class="landing-feature-card"
            :body-style="{ padding: '28px 24px' }"
          >
            <div class="card-icon-circle bg-green">🛡️</div>
            <h3 class="card-feature-title">현장 표준 안전 수칙 (SOP)</h3>
            <p class="card-feature-desc">
              과거 대형 재해 이력(포항 침수, 여수 트립 등) 기반의 표준 작업 절차(SOP) 체크리스트를
              제공하여 위기 시 즉각 대응을 지원합니다.
            </p>
            <div class="card-feature-footer">
              <span class="tech-tag">Safety Checklist</span>
              <span class="tech-tag">Pinia Persistence</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 🍎 4. 6대 국가산단 빠른 진입 그리드 -->
    <section class="landing-complex-grid-section">
      <div class="section-title-wrap">
        <h2 class="section-title">관제 대상 국가산업단지 현황</h2>
        <p class="section-sub">원하시는 산업단지를 선택하시면 정밀 관제 센터로 바로 이동합니다.</p>
      </div>

      <div class="complex-cards-grid">
        <el-card
          v-for="item in weatherStore.complexes"
          :key="item.id"
          shadow="hover"
          class="landing-complex-box"
          :body-style="{ padding: '20px 22px' }"
          @click="handleGoDetail(item.id)"
        >
          <div class="box-head">
            <h4 class="box-name">{{ item.name }}</h4>
            <el-tag size="small" effect="plain" round>{{ item.industry.split(' ')[0] }}</el-tag>
          </div>
          <div class="box-metrics">
            <div class="m-row">
              <span class="m-label">기온 / 상태:</span>
              <strong class="m-val"
                >{{ configStore.formatTemp(item.temp) }} ({{ item.status }})</strong
              >
            </div>
            <div class="m-row">
              <span class="m-label">공정 부하:</span>
              <strong class="m-val text-risk font-mono">{{ item.processRiskText }}</strong>
            </div>
          </div>
          <div class="box-foot">
            <span class="jump-link">정밀 관제 진입 →</span>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 🍎 5. 하단 정보 서머리 배너 -->
    <section class="landing-bottom-banner">
      <div class="banner-inner">
        <h2 class="banner-title">스마트 국가산업단지 24시간 안전 관제 네트워크</h2>
        <p class="banner-sub">
          실시간 기상 관측 스트림과 공정 물리 손상 예측 모델로 설비 장애를 사전에 차단합니다.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page-container {
  width: 100%;
  padding-bottom: 40px;
}

.landing-hero-section {
  text-align: center;
  padding: 48px 16px 36px 16px;
  background: radial-gradient(
    circle at top,
    rgba(0, 102, 204, 0.08) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  border-radius: var(--rounded-xl, 24px);
  margin-bottom: 32px;
}

[data-theme='dark'] .landing-hero-section {
  background: radial-gradient(circle at top, rgba(41, 151, 255, 0.14) 0%, rgba(0, 0, 0, 0) 70%);
}

.hero-eyebrow-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  padding: 6px 16px;
  border-radius: var(--rounded-pill, 9999px);
  font-size: 13px;
  font-weight: 500;
  color: var(--colors-ink, #1d1d1f);
  margin-bottom: 20px;
  box-shadow: var(--shadow-apple-card);
}

[data-theme='dark'] .hero-eyebrow-badge {
  background: #1d1d1f;
  border-color: #333336;
  color: #f5f5f7;
}

.live-blink-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #34c759;
  box-shadow: 0 0 8px #34c759;
}

.landing-main-title {
  font-size: 38px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.25;
  color: var(--colors-ink, #1d1d1f);
  margin-bottom: 18px;
}

[data-theme='dark'] .landing-main-title {
  color: #f5f5f7;
}

.gradient-text {
  background: linear-gradient(135deg, #0066cc 0%, #2997ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.landing-main-desc {
  font-size: 16px;
  line-height: 1.6;
  color: var(--colors-charcoal, #515154);
  max-width: 800px;
  margin: 0 auto 28px auto;
}

[data-theme='dark'] .landing-main-desc {
  color: #a1a1a6;
}

.hero-cta-button-group {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.hero-cta-btn {
  font-size: 15px;
  font-weight: 600;
  padding: 12px 28px;
  height: 46px;
}

.primary-cta {
  background-color: var(--colors-primary, #0066cc) !important;
  border-color: var(--colors-primary, #0066cc) !important;
  box-shadow: 0 4px 14px rgba(0, 102, 204, 0.3);
}

.primary-cta:hover {
  background-color: var(--colors-primary-focus, #0071e3) !important;
  transform: translateY(-1px);
}

.hero-kpi-pill-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.kpi-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-pill, 9999px);
  padding: 4px 14px;
  font-size: 12.5px;
  color: var(--colors-charcoal, #515154);
}

[data-theme='dark'] .kpi-pill {
  background: #1d1d1f;
  border-color: #333336;
  color: #d2d2d7;
}

.kpi-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.dot-avg {
  background-color: #0066cc;
}
.dot-normal {
  background-color: #34c759;
}
.dot-danger {
  background-color: #ff3b30;
}

/* 🎮 3D 인터랙티브 산업단지 관제 콘솔 목업 스타일 */
.hero-mockup-wrapper {
  max-width: 960px;
  margin: 0 auto 32px auto;
  perspective: 1200px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-mockup-wrapper:hover {
  transform: translateY(-4px);
}

.mockup-frame {
  background: #161617;
  border: 1px solid #333336;
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.28),
    0 2px 10px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-align: left;
}

[data-theme='dark'] .mockup-frame {
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.75),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.mockup-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1d1d1f;
  padding: 10px 18px;
  border-bottom: 1px solid #272729;
}

.mockup-traffic-dots {
  display: flex;
  gap: 6px;
}

.mockup-traffic-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red {
  background-color: #ff5f56;
}
.dot-yellow {
  background-color: #ffbd2e;
}
.dot-green {
  background-color: #27c93f;
}

.mockup-header-title {
  font-size: 11.5px;
  font-weight: 600;
  color: #a1a1a6;
  letter-spacing: 0.5px;
}

.mockup-header-status {
  font-size: 11px;
  font-weight: 700;
  color: #30d158;
  letter-spacing: 0.5px;
}

.pulse-green {
  display: inline-block;
  animation: pulse-blink 1.5s infinite;
}

@keyframes pulse-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.mockup-content-grid {
  display: grid;
  grid-template-columns: 1.1fr 1.3fr;
  gap: 16px;
  padding: 20px 22px;
  background: #111113;
}

@media (max-width: 768px) {
  .mockup-content-grid {
    grid-template-columns: 1fr;
  }
}

.mockup-map-pane,
.mockup-chart-pane {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
}

.pane-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.pane-tag {
  font-size: 10px;
  font-weight: 700;
  background: rgba(41, 151, 255, 0.2);
  color: #2997ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.pane-label {
  font-size: 12px;
  font-weight: 600;
  color: #d2d2d7;
}

.map-svg-viewport {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-korea-svg {
  width: 100%;
  height: 100%;
  max-height: 180px;
}

.svg-peninsula {
  fill: #222226;
  stroke: #383842;
  stroke-width: 1.5;
}

.pulse-ring {
  fill: none;
  stroke: #2997ff;
  stroke-width: 1;
  opacity: 0.4;
  animation: svg-pulse 2s infinite ease-out;
}

@keyframes svg-pulse {
  0% {
    r: 4;
    opacity: 0.8;
  }
  100% {
    r: 16;
    opacity: 0;
  }
}

.node-dot {
  fill: #2997ff;
}

.dot-cyan {
  fill: #30d158;
}

.node-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  fill: #f5f5f7;
}

.chart-svg-viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mini-trend-svg {
  width: 100%;
  height: 120px;
}

.peak-annotation {
  font-size: 9.5px;
  fill: #ff9f0a;
  font-weight: 600;
}

.mockup-mini-chips-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #27272a;
}

.mini-chip {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mc-name {
  font-size: 10px;
  color: #86868b;
}

.mc-val {
  font-size: 12px;
  color: #f5f5f7;
}

.text-warn {
  color: #ff9f0a;
}

.text-good {
  color: #30d158;
}

.mockup-footer-bar {
  background: #18181b;
  border-top: 1px solid #27272a;
  padding: 8px 18px;
  text-align: center;
}

.footer-hint {
  font-size: 12px;
  color: #2997ff;
  font-weight: 500;
}

.live-ticker-band {
  background: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  padding: 12px 18px;
  box-shadow: var(--shadow-apple-card);
  overflow-x: auto;
}

[data-theme='dark'] .live-ticker-band {
  background: #1d1d1f;
  border-color: #333336;
}

.ticker-inner-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
}

.ticker-complex-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--colors-canvas, #f5f5f7);
  border-radius: var(--rounded-pill, 9999px);
  font-size: 12.5px;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    background-color 0.12s ease;
}

.ticker-complex-chip:hover {
  transform: translateY(-1px);
  background-color: var(--colors-hairline-soft, #e5e5ea);
}

[data-theme='dark'] .ticker-complex-chip {
  background: #272729;
}

[data-theme='dark'] .ticker-complex-chip:hover {
  background: #333336;
}

.chip-name {
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .chip-name {
  color: #f5f5f7;
}

.chip-temp {
  font-weight: 700;
  color: var(--colors-primary, #0066cc);
}

[data-theme='dark'] .chip-temp {
  color: #2997ff;
}

.chip-status {
  color: var(--colors-mute, #86868b);
}

.chip-risk {
  font-size: 11.5px;
  color: var(--colors-accent-orange, #f56300);
}

/* 🍎 2. 미니 시뮬레이터 섹션 */
.landing-simulator-section {
  margin-bottom: 36px;
}

.sim-interactive-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  box-shadow: var(--shadow-apple-card);
}

[data-theme='dark'] .sim-interactive-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.sim-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 10px;
}

.sim-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.sim-icon {
  font-size: 18px;
}

.sim-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .sim-title {
  color: #f5f5f7;
}

.sim-desc {
  font-size: 13px;
  color: var(--colors-mute, #86868b);
  margin: 0;
}

.sim-controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  padding: 16px 20px;
  margin-bottom: 18px;
}

@media (max-width: 640px) {
  .sim-controls-grid {
    grid-template-columns: 1fr;
  }
}

[data-theme='dark'] .sim-controls-grid {
  background: #141416;
  border-color: #272729;
}

.slider-title-bar {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--colors-charcoal, #515154);
  margin-bottom: 4px;
}

[data-theme='dark'] .slider-title-bar {
  color: #d2d2d7;
}

.slider-val {
  color: var(--colors-primary, #0066cc);
}

[data-theme='dark'] .slider-val {
  color: #2997ff;
}

.sim-output-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.sim-box {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
}

[data-theme='dark'] .sim-box {
  background: #161617;
  border-color: #272729;
}

.box-tag {
  font-size: 11px;
  color: var(--colors-mute, #86868b);
  margin-bottom: 2px;
}

.box-metric-title {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
  margin-bottom: 4px;
}

[data-theme='dark'] .box-metric-title {
  color: #f5f5f7;
}

.box-metric-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--colors-primary, #0066cc);
  margin-bottom: 4px;
}

[data-theme='dark'] .box-metric-val {
  color: #2997ff;
}

.box-metric-val.val-warn {
  color: var(--colors-accent-orange, #f56300);
}

.box-sub {
  font-size: 11px;
  color: var(--colors-mute, #86868b);
}

/* 🍎 3. 가치 카드 */
.landing-features-section {
  margin-bottom: 36px;
}

.section-title-wrap {
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--colors-ink, #1d1d1f);
  margin: 0 0 6px 0;
  letter-spacing: -0.4px;
}

[data-theme='dark'] .section-title {
  color: #f5f5f7;
}

.section-sub {
  font-size: 14px;
  color: var(--colors-mute, #86868b);
  margin: 0;
}

.landing-feature-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  height: 100%;
  box-shadow: var(--shadow-apple-card);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.landing-feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-apple-hover);
}

[data-theme='dark'] .landing-feature-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.card-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 16px;
}

.bg-blue {
  background: rgba(0, 102, 204, 0.1);
}
.bg-orange {
  background: rgba(245, 99, 0, 0.1);
}
.bg-green {
  background: rgba(52, 199, 89, 0.1);
}

.card-feature-title {
  font-size: 16.5px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
  margin: 0 0 8px 0;
}

[data-theme='dark'] .card-feature-title {
  color: #f5f5f7;
}

.card-feature-desc {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--colors-charcoal, #515154);
  margin: 0 0 16px 0;
}

[data-theme='dark'] .card-feature-desc {
  color: #a1a1a6;
}

.card-feature-footer {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tech-tag {
  font-size: 11px;
  font-family: var(--font-mono);
  background: var(--colors-canvas, #f5f5f7);
  padding: 3px 8px;
  border-radius: 4px;
  color: var(--colors-mute, #86868b);
}

[data-theme='dark'] .tech-tag {
  background: #272729;
  color: #a1a1a6;
}

.landing-complex-grid-section {
  margin-bottom: 36px;
}

.complex-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.landing-complex-box {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}

.landing-complex-box:hover {
  transform: translateY(-2px);
  border-color: var(--colors-primary, #0066cc);
}

[data-theme='dark'] .landing-complex-box {
  background-color: #1d1d1f;
  border-color: #333336;
}

.box-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.box-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .box-name {
  color: #f5f5f7;
}

.box-metrics {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.m-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.m-label {
  color: var(--colors-mute, #86868b);
}

.m-val {
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .m-val {
  color: #f5f5f7;
}

.text-risk {
  color: var(--colors-accent-orange, #f56300);
}

.box-foot {
  text-align: right;
}

.jump-link {
  font-size: 12.5px;
  color: var(--colors-primary, #0066cc);
  font-weight: 500;
}

[data-theme='dark'] .jump-link {
  color: #2997ff;
}

.landing-bottom-banner {
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.06) 0%, rgba(0, 102, 204, 0.02) 100%);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-xl, 24px);
  padding: 28px 20px;
  text-align: center;
}

[data-theme='dark'] .landing-bottom-banner {
  background: linear-gradient(135deg, rgba(41, 151, 255, 0.1) 0%, rgba(41, 151, 255, 0.02) 100%);
  border-color: #333336;
}

.banner-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--colors-ink, #1d1d1f);
  margin: 0 0 6px 0;
}

[data-theme='dark'] .banner-title {
  color: #f5f5f7;
}

.banner-sub {
  font-size: 13.5px;
  color: var(--colors-mute, #86868b);
  margin: 0;
}

.font-mono {
  font-family: var(--font-mono);
}

@media (max-width: 640px) {
  .landing-main-title {
    font-size: 28px;
  }
  .hidden-mobile {
    display: none;
  }
}
</style>
