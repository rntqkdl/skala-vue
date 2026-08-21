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
  <div class="resend-about-view">
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
      <div v-for="(item, idx) in mechanismList" :key="idx" class="code-window mechanism-card">
        <div class="traffic-light-bar">
          <span class="traffic-dot dot-red"></span>
          <span class="traffic-dot dot-yellow"></span>
          <span class="traffic-dot dot-green"></span>
          <span class="code-window-title font-mono">{{ item.code }}</span>
        </div>

        <h3 class="mech-title">{{ item.title }}</h3>
        <span class="mech-target">적용 공정: {{ item.target }}</span>

        <div class="mech-formula font-mono">{{ item.formula }}</div>
        <p class="mech-desc">{{ item.desc }}</p>

        <div class="mech-prevent">
          <strong class="font-mono">표준 방어 대책:</strong> {{ item.prevention }}
        </div>
      </div>
    </div>

    <!-- 2. 시스템 3계층 아키텍처 다이어그램 카드 -->
    <div class="resend-card" style="margin-top: 16px;">
      <div class="arch-header">
        <h3 class="arch-title">시스템 3계층 아키텍처</h3>
        <span class="resend-badge badge-blue">표준 계층 구조</span>
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
    </div>

    <div class="bottom-action-row">
      <button class="btn-secondary" @click="router.push('/')">← 대시보드로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.resend-about-view {
  width: 100%;
}

.mechanism-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.mechanism-card {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.mech-title {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #0f172a);
}

.mech-target {
  font-size: 11.5px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #64748b);
  margin-bottom: 12px;
  display: block;
}

.mech-formula {
  background: var(--colors-surface-elevated, #ffffff);
  border: 1px solid rgba(5, 150, 105, 0.3);
  color: var(--colors-accent-green, #059669);
  padding: 8px 12px;
  border-radius: var(--rounded-xs, 4px);
  font-size: 12px;
  margin-bottom: 12px;
}

.mech-desc {
  margin: 0 0 14px 0;
  font-size: 13px;
  color: var(--colors-body, #334155);
  line-height: 1.55;
  flex: 1;
}

.mech-prevent {
  background: var(--colors-surface-elevated, #ffffff);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  padding: 10px 14px;
  border-radius: var(--rounded-xs, 4px);
  font-size: 12.5px;
  color: var(--colors-ink, #0f172a);
  line-height: 1.45;
}

.arch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--colors-hairline, #e2e8f0);
  padding-bottom: 12px;
}

.arch-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--colors-ink, #0f172a);
}

.arch-flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.flow-step {
  background: var(--colors-surface-elevated, #ffffff);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-radius: var(--rounded-md, 8px);
  padding: 18px;
}

.step-num {
  font-size: 11px;
  font-weight: 700;
  color: var(--colors-link, #2563eb);
  margin-bottom: 6px;
}

.step-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #0f172a);
}

.step-desc {
  margin: 0;
  font-size: 13px;
  color: var(--colors-charcoal, #475569);
  line-height: 1.5;
}

.bottom-action-row {
  margin-top: 24px;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
