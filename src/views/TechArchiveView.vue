<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NonMajorInteractiveGuide from '@/components/handson/NonMajorInteractiveGuide.vue'

const router = useRouter()
const activeTab = ref('gallery')

// 1. UI 비주얼 쇼케이스 갤러리 데이터
const showcaseList = [
  {
    id: 'home',
    title: '1. 메인 관제 대시보드 (WeatherHomeView)',
    route: '/',
    desc: '전국 6대 국가산단의 실시간 기온, 체감온도, 습도, 풍속 및 공정 특화 위험 지표를 실시간 모니터링하고 검색 및 즐겨찾기 필터링을 제공합니다.',
    chips: ['실시간 날씨 카드', '가상 시뮬레이터', '신규 산단 Geocoding 등록', '즐겨찾기 영속화', '신속 점검 드로어'],
    uiBlocks: [
      { label: '종합 요약 바', detail: '전국 평균 기온 및 최고 기온 산단(창원 25.4℃) 실시간 산출' },
      {
        label: '가상 스트레스 툴',
        detail: '폭염(35℃) / 집중호우(95%) / 미세먼지(120μg) 원클릭 시뮬레이션',
      },
      {
        label: '동적 산단 확장기',
        detail: 'OpenWeather Geocoding API를 통해 구미, 당진, 청주 등 즉시 등록',
      },
    ],
  },
  {
    id: 'radar',
    title: '2. 전국 기상 레이더 & 24시간 예측 (WeatherRadarView)',
    route: '/radar',
    desc: 'OpenWeatherMap 공식 기상 레이더 타일 맵 오버레이와 24시간 피크 사전 예측 경보 시스템을 가동합니다.',
    chips: [
      '강우/기온/구름/풍속 타일 맵',
      '24시간 피크 예보 경보',
      '전국 6대 산단 종합 매트릭스 표',
    ],
    uiBlocks: [
      {
        label: '24H 피크 알림',
        detail: '14:00 기준 최고 기온(34.2℃) 도달 예측 시 공조 칠러 1.5시간 전 예냉 권고',
      },
      {
        label: '레이더 타일 뷰어',
        detail: '한반도 상공 강우/기온/구름/풍속 레이어 실시간 스위칭 렌더링',
      },
      {
        label: '산단 비교 매트릭스',
        detail: '6대 산단의 기온, 습도, 공정 리스크, 미세먼지를 한눈에 비교하는 정렬형 데이터 테이블',
      },
    ],
  },
  {
    id: 'alerts',
    title: '3. 산단 기상 특보 및 공정 안전 수칙 (WeatherAlertView)',
    route: '/alerts',
    desc: '6대 산단별 실시간 기상 이상 상태를 평가하여 주의/경보 등급을 매기고, 과거 실제 산업 재해 이력과 연계된 긴급 SOP 가이드를 전파합니다.',
    chips: ['실시간 특보 배지', '과거 재해 백서 연동', '긴급 권고 SOP 타임라인'],
    uiBlocks: [
      {
        label: '특보 평가 엔진',
        detail: '폭염(30℃↑), 집중호우(90%↑), 고풍속(10m/s↑), 미세먼지(35μg↑) 실시간 뱃지 부여',
      },
      {
        label: '재해 사례 연계',
        detail: '포항 침수, 텍사스 한파, 울산 순간정전 등 과거 실제 피해 금액 및 교훈 제시',
      },
    ],
  },
  {
    id: 'detail',
    title: '4. 산단별 정밀 관제 및 SOP 체크리스트 (WeatherDetailView)',
    route: '/weather/city_01',
    desc: '동적 라우팅(:cityId)으로 진입하여 4분면 지표 그리드, 24시간 3시간 단위 타임라인, 실시간 대기질(AQI) 및 현장 점검 체크리스트를 실행합니다.',
    chips: ['4분면 정밀 지표', '24시간 타임라인', '대기질 AQI/PM2.5', 'SOP 체크리스트 원형 프로그레스'],
    uiBlocks: [
      {
        label: '24H 타임라인',
        detail: 'OpenWeatherMap 5일/3시간 예보 API 파싱을 통한 시간대별 기온/강수확률 렌더링',
      },
      {
        label: '대기질 분석',
        detail: 'Air Pollution API 연동으로 PM2.5/PM10 농도에 따른 클린룸 차압 주의 알림',
      },
      {
        label: 'SOP 체크리스트',
        detail: 'Pinia Store 상태와 바인딩되어 체크 시 진행률 실시간 반영 및 저장',
      },
    ],
  },
]

// 2. 트러블슈팅 5대 난제
const troubleList = [
  {
    title: '난제 1: OpenWeatherMap 무료 플랜 401 Unauthorized API 차단 이슈',
    problem: 'One Call 3.0 API 호출 시 무료 구독자 계정 차단(401) 에러 발생',
    cause: '무료 API Key는 One Call 3.0 호출 불가, 기본 2.5 엔드포인트만 허용됨',
    solution:
      'weatherApi.js에서 /weather(현재), /forecast(5일 예보), /air_pollution(대기질)의 2.5 정규 엔드포인트 3중 체계로 전면 리팩토링 완료',
  },
  {
    title: '난제 2: Pinia Store와 URL 쿼리스트링(?search=) 상태 불일치',
    problem: '검색창 입력 시 새로고침하면 검색어가 소실되고 주소창과 뷰가 동기화되지 않음',
    cause: '검색 상태가 컴포넌트 로컬 state에만 머물고 vue-router의 route.query와 양방향 바인딩되지 않음',
    solution:
      'watch(searchQuery)로 router.push({ query: ... })를 실행하고 onMounted에서 route.query.search를 복원하는 양방향 동기화 구현',
  },
  {
    title: '난제 3: 섭씨(℃)와 화씨(℉) 변환 시 계산 오차 및 렌더링 지연',
    problem: '단위 전환 시 개별 컴포넌트마다 연산식이 중복되고 소수점 반올림 불일치 발생',
    cause: '상태 관리가 파편화되어 전역 설정 스토어의 부재',
    solution:
      'useConfigStore를 생성하여 formatTemp() 중앙 헬퍼 게터 함수를 제공, 전역에서 100% 동일한 변환 수식((C * 9/5) + 32) 일원화',
  },
  {
    title: '난제 4: Geocoding 한글 도시명 검색 시 좌표 불일치 및 통신 지연',
    problem: '한글로 "구미", "당진" 입력 시 좌표가 잡히지 않거나 에러 발생',
    cause: 'OpenWeather Geocoding API의 한글 쿼리 인코딩 및 국가 코드(KR) 파라미터 누락',
    solution:
      'encodeURIComponent 처리 및 "KR" 국가 코드 강제 바인딩, 실패 시 fallback 사전 좌표 매핑 방어 로직 구축',
  },
  {
    title: '난제 5: 비동기 Axios 동시 호출 시 레이스 컨디션 및 깜빡임',
    problem: '6개 산단 날씨와 예보, 대기질을 동시 호출 시 화면이 부분 렌더링되며 떨림',
    cause: '개별 비동기 호출이 완료되는 순서대로 state를 덮어써서 렌더링 플리커 발생',
    solution:
      'Promise.allSettled를 통해 6개 산단의 기상 데이터를 병렬 취합 후 단 1회의 반응형 state 일괄 교체로 최적화',
  },
]

// 3. 6대 산단 물리 도메인
const domainList = [
  {
    name: '1. 창원 국가산업단지 (정밀 기계 & 방위산업)',
    formula: '열팽창 변위량 ΔL = L₀ × α × ΔT',
    text: '외기 35℃ 폭염 시 CNC 공작기계 주축(Spindle) 열팽창으로 가공 공차 최대 7.5μm 오차 발생. 1℃ 상승 시마다 정밀도 0.5μm 보정 제어 필수.',
  },
  {
    name: '2. 울산 온산 석유화학단지 (정유 & 나프타)',
    formula: '저장탱크 기화 압력 P = P₀ × exp(-ΔH / RT)',
    text: '고온 노출 시 휘발성 탄화수소(VOCs) 증기압 상승으로 저장탱크 통기밸브 벤팅 위험. 33℃ 이상 시 스프링클러 차열 살수 가동.',
  },
  {
    name: '3. 포항 철강 국가산업단지 (제철 & 금속)',
    formula: '침수 침입 수위 H_crit = 150mm',
    text: '힌남노 침수 재해 교훈 기반. 형산강 범람 감지 시 지하 유압 피트 및 압연 전동기 모터실 1.5시간 전 수밀 셔터 폐쇄.',
  },
  {
    name: '4. 여수 국가산업단지 (석유화학 연속 플랜트)',
    formula: '순간전압강하 위험도 Sag_index = f(Lightning, Wind)',
    text: '뇌우/낙뢰 발생 시 송전선로 전압 순간강하로 연속 공정 모터 트립 발생. 비상 발전기(UPS) 즉시 예열 대기.',
  },
  {
    name: '5. 화성/구미 국가산업단지 (반도체 & 클린룸)',
    formula: '정전기 유발 전위 V_esd ∝ 1 / Humidity',
    text: '습도 30% 이하 시 웨이퍼 정전기(ESD) 파괴 불량률 4배 급증. 습도 70% 이상 시 포토레지스트 수분 흡착 불량 발생.',
  },
  {
    name: '6. 군산 국가산업단지 (자동차 & 부품)',
    formula: '외기온 연계 작동유 온도 T_oil = T_amb × 1.15 + 22',
    text: '하계 고온기 유압 프레스 유온 60℃ 돌파 시 점도 저하로 유압 밸브 헌팅 및 프레스 압착 불량 발생.',
  },
]

// 4. 아키텍처 결정 레코드 (ADR)
const adrList = [
  {
    id: 'ADR-001',
    title: '디자인 시스템: Resend Editorial Dark UI 채택',
    content:
      '관제 센터의 야간 가독성 확보와 고정밀 데이터 집중도를 극대화하기 위해 순수 블랙 캔버스(#000000), 32px 엔지니어링 CAD 그리드, 상단 대기 글로우 오로라, 시그니처 화이트 CTA(#fcfdff) 버튼 시스템을 채택함.',
  },
  {
    id: 'ADR-002',
    title: '상태 관리: Pinia 3개 도메인 분리 저장소 구성',
    content:
      'useConfigStore(온도 단위/테마), useWeatherStore(산단 기상/예보/대기질/CRUD), useAlertStore(특보 판정/재해 DB/SOP 체크리스트)로 역할을 엄격히 분리하여 단일 책임 원칙(SRP) 준수.',
  },
  {
    id: 'ADR-003',
    title: '비동기 레이어: OpenWeather 2.5 API 3중 파이프라인 구축',
    content:
      '유료 플랜 제한이 있는 One Call API 대신, /weather(현재), /forecast(3시간 예보), /air_pollution(대기질)의 무료 엔드포인트를 병렬 결합하는 통합 API 클라이언트 계층 설계.',
  },
  {
    id: 'ADR-004',
    title: 'UI 라이브러리: Element Plus + Ant Design Vue 듀얼 아키텍처 채택',
    content:
      'Element Plus의 정밀 데이터 위젯(통계, 프로그레스, 태그, 테이블)과 Ant Design Vue의 엔터프라이즈 인터랙션(드로어, 팝컨펌, 타임라인, 디스크립션)을 상호 보완적으로 배치.',
  },
]
</script>

<template>
  <div class="resend-archive-view">
    <!-- 🖋️ Resend Editorial Hero Band -->
    <section class="resend-hero-band">
      <div class="hero-editorial-eyebrow">
        <span class="status-dot-live"></span>
        <span>기술 백서 & 시스템 아키텍처 기록</span>
      </div>
      <h1 class="hero-editorial-headline">기술 백서 & 시스템 아카이브</h1>
      <p class="hero-editorial-desc">
        스마트 팩토리 기상 관제 시스템의 UI 쇼케이스, 5대 기술 난제 트러블슈팅, 물리 도메인 모델 및 아키텍처 결정서(ADR)
      </p>
    </section>

    <!-- Element Plus Tabs in Resend Dark Theme -->
    <el-tabs v-model="activeTab" type="border-card" class="custom-el-tabs">
      <!-- 탭 1: UI 비주얼 갤러리 -->
      <el-tab-pane label="📸 UI 비주얼 갤러리" name="gallery">
        <div class="pane-header">
          <h3 class="pane-title">📸 완성된 4대 핵심 화면 쇼케이스</h3>
          <span class="pane-sub">각 뷰의 주요 기술 컴포넌트 및 동작 메커니즘</span>
        </div>

        <div class="showcase-grid">
          <div v-for="item in showcaseList" :key="item.id" class="showcase-card">
            <div class="showcase-top">
              <h4 class="showcase-name">{{ item.title }}</h4>
              <span class="route-badge">{{ item.route }}</span>
            </div>
            <p class="showcase-desc">{{ item.desc }}</p>

            <div class="chip-row">
              <span v-for="(chip, cIdx) in item.chips" :key="cIdx" class="resend-badge badge-blue">
                {{ chip }}
              </span>
            </div>

            <div class="ui-mockup-block">
              <div v-for="(block, bIdx) in item.uiBlocks" :key="bIdx" class="mockup-row">
                <span class="mock-label font-mono">▪ {{ block.label }}:</span>
                <span class="mock-detail">{{ block.detail }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 탭 2: 트러블슈팅 5대 난제 -->
      <el-tab-pane label="🛠️ 트러블슈팅 5대 난제" name="troubleshoot">
        <div class="pane-header">
          <h3 class="pane-title">🛠️ 실전 개발 트러블슈팅 5대 난제 해결 백서</h3>
          <span class="pane-sub">오류 현상, 근본 원인 분석, 해결 솔루션 및 아키텍처 개선</span>
        </div>

        <div class="trouble-list">
          <div v-for="(t, idx) in troubleList" :key="idx" class="code-window trouble-card">
            <div class="traffic-light-bar">
              <span class="traffic-dot dot-red"></span>
              <span class="traffic-dot dot-yellow"></span>
              <span class="traffic-dot dot-green"></span>
              <span class="code-window-title">DEBUG_CASE_0{{ idx + 1 }}.MD</span>
            </div>
            <h4 class="trouble-heading">{{ t.title }}</h4>
            <div class="trouble-row problem-box">
              <strong class="tag-label">❌ 문제 상황:</strong> {{ t.problem }}
            </div>
            <div class="trouble-row cause-box">
              <strong class="tag-label">🔍 원인 분석:</strong> {{ t.cause }}
            </div>
            <div class="trouble-row solution-box">
              <strong class="tag-label">✅ 해결 방안:</strong> {{ t.solution }}
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 탭 3: 6대 산단 물리 모델 -->
      <el-tab-pane label="🏭 6대 산단 물리 모델" name="domain">
        <div class="pane-header">
          <h3 class="pane-title">🏭 6대 국가산업단지 공정별 기상 재해 물리 모델</h3>
          <span class="pane-sub">온도·습도·기압과 설비 물리 파손의 상관관계 수식</span>
        </div>

        <div class="domain-list">
          <div v-for="(d, idx) in domainList" :key="idx" class="code-window domain-card">
            <div class="traffic-light-bar">
              <span class="traffic-dot dot-red"></span>
              <span class="traffic-dot dot-yellow"></span>
              <span class="traffic-dot dot-green"></span>
              <span class="code-window-title">PHYSICS_MODEL_{{ idx + 1 }}.EQ</span>
            </div>
            <div class="domain-top-row">
              <h4 class="domain-name">{{ d.name }}</h4>
              <span class="resend-badge badge-blue">PHYSICAL FORMULA</span>
            </div>
            <div class="formula-banner">{{ d.formula }}</div>
            <p class="domain-text">{{ d.text }}</p>
          </div>
        </div>
      </el-tab-pane>

      <!-- 탭 4: 아키텍처 결정 레코드 (ADR) -->
      <el-tab-pane label="🏛️ 아키텍처 결정 (ADR)" name="architecture">
        <div class="pane-header">
          <h3 class="pane-title">🏛️ 시스템 아키텍처 결정 기록서 (ADR)</h3>
          <span class="pane-sub">시스템 설계 단계의 의사결정 이유 및 구조적 근거</span>
        </div>

        <div class="adr-list">
          <div v-for="adr in adrList" :key="adr.id" class="resend-card adr-card">
            <div class="adr-header">
              <span class="adr-id-tag">{{ adr.id }}</span>
              <h4 class="adr-title">{{ adr.title }}</h4>
            </div>
            <p class="adr-content">{{ adr.content }}</p>
          </div>
        </div>
      </el-tab-pane>

      <!-- 탭 5: 비전공자를 위한 Vue 3 10대 단원 인터랙티브 슬라이드 가이드 -->
      <el-tab-pane label="📖 비전공자 인터랙티브 마스터 클래스 (1~10단원)" name="curriculum">
        <div class="pane-header">
          <h3 class="pane-title">📖 Vue.js 1~10단원 인터랙티브 이론 가이드</h3>
          <span class="pane-sub">단원별 핵심 이론, 동작 원리, 코드 스니펫 및 실전 라우트 테스트</span>
        </div>

        <NonMajorInteractiveGuide />
      </el-tab-pane>
    </el-tabs>

    <div class="bottom-action-row">
      <button class="btn-secondary" @click="router.push('/')">← 메인 대시보드로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.resend-archive-view {
  width: 100%;
}

.pane-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.08));
}

.pane-title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
}

.pane-sub {
  font-size: 12px;
  color: var(--colors-mute, #a1a4a5);
}

.showcase-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.showcase-card {
  background: var(--colors-surface-deep, #06060a);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.08));
  border-radius: var(--rounded-md, 8px);
  padding: 16px 20px;
}

.showcase-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.showcase-name {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
}

.route-badge {
  background: var(--colors-surface-elevated, #101012);
  border: 1px solid var(--colors-hairline-strong, rgba(255, 255, 255, 0.14));
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-link, #3b9eff);
  padding: 2px 8px;
  border-radius: var(--rounded-xs, 4px);
}

.showcase-desc {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
  line-height: 1.5;
}

.chip-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.ui-mockup-block {
  background: var(--colors-surface-card, #0a0a0c);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.06));
  border-radius: var(--rounded-sm, 6px);
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mockup-row {
  display: flex;
  font-size: 12px;
  line-height: 1.45;
}

.mock-label {
  color: var(--colors-mute, #a1a4a5);
  width: 110px;
  flex-shrink: 0;
}

.mock-detail {
  color: var(--colors-body, rgba(252, 253, 255, 0.86));
}

.font-mono {
  font-family: var(--font-mono);
}

.trouble-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trouble-card {
  margin-bottom: 0;
}

.trouble-heading {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
}

.trouble-row {
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: var(--rounded-xs, 4px);
  margin-bottom: 6px;
}

.problem-box {
  background: rgba(255, 32, 71, 0.12);
  color: #ff8598;
  border: 1px solid rgba(255, 32, 71, 0.25);
}

.cause-box {
  background: rgba(255, 197, 61, 0.12);
  color: #fed7aa;
  border: 1px solid rgba(255, 197, 61, 0.25);
}

.solution-box {
  background: rgba(17, 255, 153, 0.10);
  color: #86efac;
  border: 1px solid rgba(17, 255, 153, 0.25);
}

.domain-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.domain-card {
  margin-bottom: 0;
}

.domain-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.domain-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
}

.formula-banner {
  background: var(--colors-surface-card, #0a0a0c);
  color: #34d399;
  padding: 8px 12px;
  border-radius: var(--rounded-xs, 4px);
  border: 1px solid rgba(52, 211, 153, 0.25);
  font-size: 12px;
  font-family: var(--font-mono);
  margin-bottom: 10px;
}

.domain-text {
  margin: 0;
  font-size: 13px;
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
  line-height: 1.5;
}

.adr-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.adr-card {
  border-left: 3px solid var(--colors-accent-blue, #3b9eff);
  padding: 16px 20px;
}

.adr-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.adr-id-tag {
  font-size: 11px;
  font-family: var(--font-mono);
  background: var(--colors-surface-elevated, #101012);
  border: 1px solid var(--colors-hairline-strong, rgba(255, 255, 255, 0.14));
  color: var(--colors-ink, #fcfdff);
  padding: 2px 6px;
  border-radius: var(--rounded-xs, 4px);
}

.adr-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
}

.adr-content {
  margin: 0;
  font-size: 13px;
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
  line-height: 1.5;
}

.curriculum-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.theory-card {
  background: var(--colors-surface-deep, #06060a);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.08));
  border-radius: var(--rounded-md, 8px);
  padding: 16px;
}

.theory-card h5 {
  margin: 0 0 10px 0;
  font-size: 13px;
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
}

.theory-card ul {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
  line-height: 1.6;
}

.theory-card code {
  font-size: 11px;
  font-family: var(--font-mono);
  background: var(--colors-surface-card, #0a0a0c);
  border: 1px solid var(--colors-hairline-strong, rgba(255, 255, 255, 0.14));
  padding: 1px 4px;
  border-radius: 3px;
  color: var(--colors-link, #3b9eff);
}

.non-major-guide-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-topic-card {
  margin-bottom: 0;
}

.guide-title {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
}

.analogy-box {
  background: var(--colors-surface-card, #0a0a0c);
  border: 1px solid var(--colors-hairline-strong, rgba(255, 255, 255, 0.14));
  border-radius: var(--rounded-xs, 4px);
  padding: 10px 14px;
  font-size: 13px;
  color: var(--colors-ink, #fcfdff);
  margin-bottom: 12px;
  line-height: 1.5;
}

.analogy-label {
  color: var(--colors-accent-yellow, #ffc53d);
  font-weight: 500;
  margin-right: 6px;
}

.compare-2col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.compare-box {
  background: var(--colors-surface-card, #0a0a0c);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.06));
  border-radius: var(--rounded-xs, 4px);
  padding: 12px 14px;
}

.comp-head {
  display: block;
  font-size: 12px;
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--colors-link, #3b9eff);
  margin-bottom: 8px;
}

.compare-box ul {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
  line-height: 1.6;
}

.compare-box code {
  font-size: 11px;
  font-family: var(--font-mono);
  background: var(--colors-surface-elevated, #101012);
  border: 1px solid var(--colors-hairline-strong, rgba(255, 255, 255, 0.14));
  padding: 1px 4px;
  border-radius: 3px;
  color: #34d399;
}

.bottom-action-row {
  margin-top: 24px;
}
</style>
