<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const mechanismList = [
  {
    title: '1. CNC 주축 열변형 메커니즘',
    code: '1단계: 정밀 가공 오차 분석',
    target: '창원 정밀기계 & 화성 반도체 장비',
    formula: 'ΔL = L₀ · α · ΔT (α = 11.7 × 10⁻⁶ / ℃)',
    desc: '하계 외기온 상승으로 공장 내부 온도가 35℃에 도달하면 1,000mm 주축 베드가 최대 42μm 팽창하여 허용 공차(±5μm)를 8배 이상 초과합니다.',
    prevention: '공조 칠러 1.5시간 전 예냉 가동 및 CNC 컨트롤러 자동 열보정 알고리즘 적용',
  },
  {
    title: '2. 석유화학 배관 염해 부식 & 통기 벤팅',
    code: '2단계: 유증기 압력 및 부식 분석',
    target: '울산 온산 & 여수 석유화학단지',
    formula: 'P_vap = P₀ · exp(-ΔH_vap / (R · T))',
    desc: '해무와 습도 95% 지속 시 옥외 배관 접합부 염해 부식이 가속화되며, 직사광선 노출 시 저장탱크 내부 압력이 급상승하여 유증기 누출 위험이 발생합니다.',
    prevention: '저장탱크 상부 차열 살수 스프링클러 가동 및 통기 밸브 긴급 차단',
  },
  {
    title: '3. 옥외 압연모터 지하 침수 메커니즘',
    code: '3단계: 지하 수위 역류 분석',
    target: '포항 철강 & 당진 제철 플랜트',
    formula: 'H_crit = 150mm (지하 피트 범람 한계 수위)',
    desc: '집중호우(시간당 100mm) 시 인근 하천 범람으로 지하 유압 밸브 피트 및 10,000kW급 주전동기 모터실로 빗물이 역류하여 전면 셧다운을 유발합니다.',
    prevention: '외곽 차수벽 기립, 배수펌프 100% 가동 및 1.5시간 전 수밀 셔터 폐쇄',
  },
  {
    title: '4. 송전선로 전압강하 & 정전기 방전',
    code: '4단계: 절연 파괴 위험 분석',
    target: '구미 전자부품 & 여수 연속 공정',
    formula: 'V_esd ∝ 1 / Rel_Humidity',
    desc: '낙뢰 시 송전선로 순간 전압강하(Sag)로 민감 인버터가 정지하며, 동계 건조기(습도 30% 이하)에는 정전기 방전으로 웨이퍼 절연막이 파괴됩니다.',
    prevention: '초고속 무정전 전원장치(UPS) 온라인 전환 및 클린룸 가습기 풀가동',
  },
]
</script>

<template>
  <div class="apple-about-view">
    <!-- 상단 소개 영역 -->
    <section class="resend-hero-band">
      <div class="hero-editorial-eyebrow">
        <span class="status-dot-live"></span>
        <span>설비 물리 위험 메커니즘 & 시스템 설계 구조</span>
      </div>
      <h1 class="hero-editorial-headline">공정 재해 메커니즘 & 시스템 구조</h1>
      <p class="hero-editorial-desc">
        스마트 팩토리 기상 관제 시스템의 4대 공정 설비 파손 물리 공식과 Vue 3 기반 3계층 아키텍처 설계 구조입니다.
      </p>
    </section>

    <!-- 1. 4대 공정 설비 파손 물리 메커니즘 카드 그리드 -->
    <div class="mechanism-grid">
      <el-card
        v-for="(item, idx) in mechanismList"
        :key="idx"
        shadow="hover"
        class="apple-ui-mech-card"
        :body-style="{ padding: '22px 24px' }"
      >
        <div class="mech-header">
          <h3 class="mech-title">{{ item.title }}</h3>
          <el-tag size="small" effect="plain" round class="mech-tag">{{ item.code }}</el-tag>
        </div>
        <span class="mech-target">적용 공정: {{ item.target }}</span>

        <div class="mech-formula font-mono">{{ item.formula }}</div>
        <p class="mech-desc">{{ item.desc }}</p>

        <div class="mech-prevent">
          <strong class="prevent-label">표준 방어 대책:</strong>
          <span class="prevent-text">{{ item.prevention }}</span>
        </div>
      </el-card>
    </div>

    <!-- 2. 시스템 3계층 아키텍처 다이어그램 카드 -->
    <el-card shadow="never" class="apple-ui-arch-card" :body-style="{ padding: '24px 28px' }">
      <div class="arch-header">
        <h3 class="arch-title">시스템 3계층 아키텍처</h3>
        <el-tag size="small" effect="light" round>표준 엔지니어링 계층</el-tag>
      </div>

      <div class="arch-flow-grid">
        <div class="flow-step">
          <div class="step-num font-mono">01. 데이터 수집 계층</div>
          <h4 class="step-title">OpenWeather 2.5 API</h4>
          <p class="step-desc">현재 날씨, 5일 3시간 예보, 대기질 AQI, 지오코딩 4대 비동기 파이프라인</p>
        </div>

        <div class="flow-step">
          <div class="step-num font-mono">02. 데이터 처리 및 상태 계층</div>
          <h4 class="step-title">Pinia 3중 스토어</h4>
          <p class="step-desc">물리 위험 지표 계산, 특보 판정 로직, 현장 점검표(SOP) 영속화</p>
        </div>

        <div class="flow-step">
          <div class="step-num font-mono">03. 화면 표출 계층</div>
          <h4 class="step-title">반응형 듀얼 테마 UI</h4>
          <p class="step-desc">라이트/다크 자동 전환, Element Plus & Ant Design Vue 결합 컴포넌트</p>
        </div>
      </div>
    </el-card>

    <div class="bottom-action-row">
      <el-button size="default" round @click="router.push('/')">← 대시보드로 돌아가기</el-button>
    </div>
  </div>
</template>

<style scoped>
.apple-about-view {
  width: 100%;
}

.mechanism-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
  margin-bottom: 20px;
}

.apple-ui-mech-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  box-shadow: var(--shadow-apple-card);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.apple-ui-mech-card:hover {
  box-shadow: var(--shadow-apple-hover);
  transform: translateY(-2px);
}

[data-theme="dark"] .apple-ui-mech-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.mech-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  flex-wrap: wrap;
  gap: 6px;
}

.mech-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .mech-title {
  color: #f5f5f7 !important;
}

.mech-target {
  font-size: 12px;
  color: var(--colors-mute, #86868b);
  margin-bottom: 12px;
  display: block;
}

[data-theme="dark"] .mech-target {
  color: #a1a1a6 !important;
}

.mech-formula {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  color: var(--colors-primary, #0066cc);
  padding: 10px 14px;
  border-radius: var(--rounded-sm, 8px);
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 12px;
}

[data-theme="dark"] .mech-formula {
  background: #161617;
  color: #30d158;
  border-color: #272729;
}

.mech-desc {
  margin: 0 0 14px 0;
  font-size: 13.5px;
  color: var(--colors-charcoal, #515154);
  line-height: 1.55;
  flex: 1;
}

[data-theme="dark"] .mech-desc {
  color: #d2d2d7 !important;
}

.mech-prevent {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  padding: 12px 14px;
  border-radius: var(--rounded-sm, 8px);
  font-size: 13px;
  line-height: 1.45;
}

[data-theme="dark"] .mech-prevent {
  background: #161617;
  border-color: #272729;
}

.prevent-label {
  color: var(--colors-ink, #1d1d1f);
  font-weight: 600;
  margin-right: 4px;
}

[data-theme="dark"] .prevent-label {
  color: #f5f5f7 !important;
}

.prevent-text {
  color: var(--colors-body, #1d1d1f);
}

[data-theme="dark"] .prevent-text {
  color: #d2d2d7 !important;
}

.apple-ui-arch-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  box-shadow: var(--shadow-apple-card);
}

[data-theme="dark"] .apple-ui-arch-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.arch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--colors-hairline-soft, #e5e5ea);
  padding-bottom: 14px;
}

[data-theme="dark"] .arch-header {
  border-bottom-color: #272729;
}

.arch-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .arch-title {
  color: #f5f5f7 !important;
}

.arch-flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.flow-step {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  padding: 18px 20px;
}

[data-theme="dark"] .flow-step {
  background: #161617;
  border-color: #272729;
}

.step-num {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--colors-primary, #0066cc);
  margin-bottom: 6px;
}

[data-theme="dark"] .step-num {
  color: #2997ff !important;
}

.step-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .step-title {
  color: #f5f5f7 !important;
}

.step-desc {
  margin: 0;
  font-size: 13px;
  color: var(--colors-charcoal, #515154);
  line-height: 1.5;
}

[data-theme="dark"] .step-desc {
  color: #d2d2d7 !important;
}

.bottom-action-row {
  margin-top: 24px;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
