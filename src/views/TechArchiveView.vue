<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('gallery')

const tabs = [
  { id: 'gallery', label: '📸 UI 비주얼 갤러리' },
  { id: 'troubleshoot', label: '🛠️ 트러블슈팅 5대 난제' },
  { id: 'domain', label: '🏭 6대 산단 물리 모델' },
  { id: 'architecture', label: '🏛️ 아키텍처 결정 (ADR)' },
  { id: 'curriculum', label: '📖 강의 핵심 이론 총정리' },
]

// 1. UI 비주얼 쇼케이스 갤러리 데이터
const showcaseList = [
  {
    id: 'home',
    title: '1. 메인 관제 대시보드 (WeatherHomeView)',
    route: '/',
    desc: '전국 6대 국가산단의 실시간 기온, 체감온도, 습도, 풍속 및 공정 특화 위험 지표를 실시간 모니터링하고 검색 및 즐겨찾기 필터링을 제공합니다.',
    chips: ['실시간 날씨 카드', '가상 시뮬레이터', '신규 산단 Geocoding 등록', '즐겨찾기 영속화'],
    uiBlocks: [
      { label: '종합 요약 바', detail: '전국 평균 기온 및 최고 기온 산단(창원 25.4℃) 실시간 산출' },
      {
        label: '가상 스트레스 툴',
        detail: '폭염(35℃) / 집중호우(95%) / 미세먼지(75μg) 원클릭 시뮬레이션',
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
        detail: '6대 산단의 기온, 습도, 공정 리스크, 미세먼지를 한눈에 비교하는 데이터 표',
      },
    ],
  },
  {
    id: 'detail',
    title: '3. 산단별 정밀 관제 & SOP 체크리스트 (WeatherDetailView)',
    route: '/weather/:cityId',
    desc: '동적 세그먼트(:cityId)를 통해 특정 산단의 24시간 예보 타임라인, 대기질 AQI, 과거 재해 분석 및 현장 표준 안전 대응 절차(SOP)를 제공합니다.',
    chips: ['동적 라우팅', '24시간 예보 레일', '대기질 AQI', 'SOP 체크리스트 게이지'],
    uiBlocks: [
      {
        label: '24시간 예보 레일',
        detail: '3시간 단위 OpenWeather 예보 기온 및 강수확률(💧) 가로 스크롤 타임라인',
      },
      {
        label: '대기질 정밀 분석',
        detail: '초미세먼지(PM2.5) 및 미세먼지(PM10) 수치 기반 클린룸 양압 차압 가동 알림',
      },
      {
        label: '현장 SOP 게이지',
        detail: '체크리스트 클릭 시 Pinia 상태 동기화 및 0~100% 진행 바 실시간 반영',
      },
    ],
  },
  {
    id: 'alert',
    title: '4. 실시간 기상 특보 & 안전 수칙 (WeatherAlertView)',
    route: '/alerts',
    desc: '실시간 기상 데이터와 과거 재해 임계치를 대조하여 긴급/주의/정상 등급을 자동 판정하고 안전 권고 조치를 안내합니다.',
    chips: ['위험도 자동 판정', 'GNB 뱃지 실시간 연동', '과거 재해 이력 대조'],
    uiBlocks: [
      {
        label: 'GNB 펄스 뱃지',
        detail: '위험 산단 발생 시 상단 네비게이션에 실시간 개수(badgeCount) 자동 표기',
      },
      {
        label: '과거 재해 대조',
        detail: '2022년 폭염 CNC 열팽창 12억 원 불량 등 과거 사례와 현재 기상 대조',
      },
      {
        label: '긴급 권고 매뉴얼',
        detail: '배관 염해 세척, 유압유 냉각팬 가동, 양압 밸브 100% 가동 등 조치 안내',
      },
    ],
  },
  {
    id: 'archive',
    title: '5. 기술 아카이브 & 지식 관제실 (TechArchiveView)',
    route: '/archive',
    desc: 'Day 1부터 Day 4까지 진행된 프론트엔드 엔지니어링 여정의 트러블슈팅, 도메인 물리 모델, 아키텍처 결정을 전수 보존합니다.',
    chips: ['5대 트러블슈팅', '공정 물리 수식', 'ADR 아키텍처', '강의 이론 요약'],
    uiBlocks: [
      {
        label: '트러블슈팅 5선',
        detail: 'URL 소실, 새로고침 리셋, Axios Waterfall 통신 병목 등 핵심 해결 기록',
      },
      {
        label: '물리 리스크 모델',
        detail: '열변형(μm), 부식도(%), 유압유온도(℃), 차압부하, 침수부하 공학 공식',
      },
      {
        label: 'UI 이원화 체계',
        detail: '교재 실습(Element Plus)과 실제 프로젝트(Cal.com Clean SaaS) 정합성',
      },
    ],
  },
]

// 2. 트러블슈팅 5대 난제 목록
const troubleshootList = [
  {
    id: 1,
    title: '1. 컴포넌트 v-if 탭 전환 시 화면 상태 유실 및 URL 고정',
    problem:
      '단일 컴포넌트 v-if 전환 시 주소창이 항상 /에 고정되어 특정 산단 상세 공유 불가 및 브라우저 뒤로가기 오작동 발생.',
    cause: '브라우저 History API와 화면 상태가 동기화되지 않고 메모리 임시 변수에만 의존했기 때문.',
    solution:
      'Vue Router 4 도입: 동적 세그먼트(:cityId), watch(searchQuery) URL 쿼리스트링(?search=) 실시간 동기화로 해결.',
  },
  {
    id: 2,
    title: '2. 브라우저 새로고침(F5) 시 사용자 설정(단위, 즐겨찾기) 초기화',
    problem: '화씨(℉) 전환이나 즐겨찾기(⭐) 등록 후 새로고침 시 초기 배열로 리셋되는 현상 발생.',
    cause: 'Pinia ref 상태는 브라우저 메모리에만 상주하므로 리로드 시 초기화됨.',
    solution:
      'Pinia Setup Store에 watch(unit), watch(favorites, { deep: true })를 결합하여 localStorage 양방향 영속화 구현.',
  },
  {
    id: 3,
    title: '3. 다중 산단 기상 데이터 순차 호출 시 통신 병목 (3~4초 지연)',
    problem: '6대 산단 날씨와 대기질을 for 루프에서 await로 순차 호출하여 렌더링 지연 발생.',
    cause: '싱글 스레드 이벤트 루프에서 비동기 HTTP 요청을 직렬(Waterfall)로 대기함.',
    solution:
      'Promise.all 기반 병렬 비동기 통신 아키텍처 구축으로 다중 API 응답 시간을 평균 0.4초 이내로 단축 (70% 향상).',
  },
  {
    id: 4,
    title: '4. 전 공정에 동일한 열변형 공식 일괄 적용에 따른 도메인 왜곡',
    problem: '석유화학, 반도체, 제철 등 서로 다른 공정에 일률적으로 CNC 열변형 계수를 적용함.',
    cause:
      '공정별 물리적 취약 요인(화학: 부식/낙뢰, 반도체: 파티클, 제철: 침수)이 상이함을 반영하지 못함.',
    solution:
      '공정별 특화 위험 지표(Custom Risk Metric) 계산 엔진을 분기하여 각 산업 특성에 맞는 물리 지표 동적 산출.',
  },
  {
    id: 5,
    title: '5. 빌드 번들 크기 비대화 및 특수문자 린트 충돌',
    problem: '초기 번들 파일 비대화 및 코드 내 중간점(/, -) 문자로 인한 린트 경고 발생.',
    cause: '정적 임포트 방식과 비표준 특수문자 사용.',
    solution:
      '라우터 지연 로딩(() => import()) 청크 분할 및 중간점 100% 제거로 oxlint/eslint 0 에러 무결성 달성.',
  },
]

// 3. 6대 산단 공정 물리 모델
const domainList = [
  {
    name: '창원 국가산단 (정밀기계/방산)',
    formula: '열변형 오차(μm) = max(0, 현재기온 - 20℃) × 1.5 + 3.0',
    desc: '탄소강 열팽창(11.7μm/m/℃)으로 인한 공작기계 베드 팽창 및 가공 공차(±5μm) 초과 방지',
    mockup: '2022년 폭염 시 CNC 베드 열팽창(42μm)으로 방산 부품 전량 불량 모델 (12억 원)',
  },
  {
    name: '울산 석유화학단지 (나프타 분해)',
    formula: '부식 위험도(%) = min(100, 습도 × 0.75 + (기온 > 28℃ ? 20 : 5))',
    desc: '해무 및 대기 습도 80% 이상 지속 시 노출 배관 염해 부식 및 제어반 단락 방지',
    mockup: '2020년 집중호우 및 고습(85%↑) 지속으로 노출 배관 부식 셧다운 모델 (48억 원)',
  },
  {
    name: '군산 국가산단 (대형 프레스/특수강)',
    formula: '추정 작동유 온도(℃) = 외기온 × 1.15 + 22',
    desc: '작동유 60℃ 초과 시 점도 급락으로 인한 유압 실린더 패킹 파손 및 누유 방지',
    mockup: '2023년 폭염기 유압 프레스 오일 과열(65℃↑)로 씰 파손 및 라인 중단 모델 (6.5억 원)',
  },
  {
    name: '광주 첨단산단 (반도체 패키징)',
    formula: '클린룸 차압 부하 (PM2.5 > 35μg/㎥ 시 양압 밸브 100% 가동)',
    desc: '고농도 초미세먼지 유입 시 MAU HEPA 필터 차압 급상승 및 파티클 혼입 방지',
    mockup: '2024년 고농도 미세먼지 유입 시 클린룸 필터 과부하 및 파티클 불량 모델 (8.2억 원)',
  },
  {
    name: '포항 철강공단 (제철/열간압연)',
    formula: '침수/냉각 부하(%) = min(100, 습도 × 0.7 + (기온 > 30℃ ? 25 : 0))',
    desc: '태풍/집중호우 시 하천 범람에 따른 지하 압연 모터실 및 전력구 침수 방어',
    mockup: '2022년 태풍 힌남노 하천 범람 고로 3기 휴풍 및 모터 침수 모델 (1조 원)',
  },
  {
    name: '여수 석유화학단지 (연속공정 플랜트)',
    formula: '낙뢰/전압강하 트립 취약도 (풍속 ≥ 6.0m/s 또는 습도 ≥ 85%)',
    desc: '하계 낙뢰 시 송전선로 순간전압강하(Sag)로 인한 펌프 트립 및 가스 긴급 방출 방지',
    mockup: '하계 낙뢰 순간전압강하로 펌프 트립 및 긴급 플레어스택 방출 모델 (1,000억 원)',
  },
]
</script>

<template>
  <div class="cal-archive-container">
    <div class="archive-header-cluster">
      <span class="eyebrow-tag">KNOWLEDGE BASE & ARCHIVE</span>
      <h3 class="main-title">스마트 팩토리 엔지니어링 아카이브 관제실</h3>
      <p class="sub-intro">
        Vue 3 기초 문법부터 실시간 Axios 통신, Pinia 영속화, Router 아키텍처 및 공정 물리 모델 전수
        보존
      </p>
    </div>

    <!-- Cal.com Nav-Pill-Group 탭 스위처 -->
    <div class="cal-tab-pill-group">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-pill-item"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 1. 화면별 구현 성과 갤러리 탭 (신설) -->
    <div v-if="activeTab === 'gallery'" class="tab-pane">
      <div class="pane-header">
        <h4 class="pane-title">📸 5대 핵심 화면 실제 구현 쇼케이스 갤러리</h4>
        <span class="pane-sub">실제 Vue 3 라우트 화면별 UI 컴포넌트 조립 구조 및 관제 지표</span>
      </div>

      <div class="showcase-grid">
        <div v-for="item in showcaseList" :key="item.id" class="showcase-card">
          <div class="showcase-top">
            <h5 class="showcase-name">{{ item.title }}</h5>
            <span class="route-badge">{{ item.route }}</span>
          </div>
          <p class="showcase-desc">{{ item.desc }}</p>

          <!-- 칩 목록 -->
          <div class="chip-row">
            <span v-for="chip in item.chips" :key="chip" class="feature-chip">{{ chip }}</span>
          </div>

          <!-- UI 컴포넌트 블록 시각화 -->
          <div class="ui-mockup-block">
            <div v-for="(block, bIdx) in item.uiBlocks" :key="bIdx" class="mockup-row">
              <span class="mock-label">{{ block.label }}:</span>
              <span class="mock-detail">{{ block.detail }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 트러블슈팅 탭 -->
    <div v-if="activeTab === 'troubleshoot'" class="tab-pane">
      <div class="pane-header">
        <h4 class="pane-title">🛠️ 실전 개발 트러블슈팅 및 디버깅 5대 핵심 기록</h4>
        <span class="pane-sub">발생 문제, 근본 원인 분석 및 재발 방지 엔지니어링 솔루션</span>
      </div>

      <div class="trouble-list">
        <div v-for="item in troubleshootList" :key="item.id" class="cal-trouble-card">
          <h5 class="trouble-heading">{{ item.title }}</h5>
          <div class="trouble-row problem-box">
            <strong class="tag-label">🚨 발생 문제:</strong>
            <span>{{ item.problem }}</span>
          </div>
          <div class="trouble-row cause-box">
            <strong class="tag-label">🔍 근본 원인:</strong>
            <span>{{ item.cause }}</span>
          </div>
          <div class="trouble-row solution-box">
            <strong class="tag-label">✅ 해결 방안:</strong>
            <span>{{ item.solution }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 공정별 물리 모델 탭 -->
    <div v-if="activeTab === 'domain'" class="tab-pane">
      <div class="pane-header">
        <h4 class="pane-title">🏭 6대 국가산단 공정별 물리 리스크 모델 & 교육용 목업 DB</h4>
        <span class="pane-sub">실제 산업 재해 백서 기반 모델링 (교육 및 시뮬레이션용 목업)</span>
      </div>

      <div class="domain-list">
        <div v-for="item in domainList" :key="item.name" class="cal-domain-card">
          <div class="domain-top-row">
            <h5 class="domain-name">{{ item.name }}</h5>
            <span class="mockup-tag">목업 시나리오</span>
          </div>
          <div class="formula-banner">
            <code>{{ item.formula }}</code>
          </div>
          <p class="domain-text">💡 <strong>공학적 배경:</strong> {{ item.desc }}</p>
          <p class="domain-text">📑 <strong>교육용 재해 모델:</strong> {{ item.mockup }}</p>
        </div>
      </div>
    </div>

    <!-- 4. 아키텍처 결정(ADR) 탭 -->
    <div v-if="activeTab === 'architecture'" class="tab-pane">
      <div class="pane-header">
        <h4 class="pane-title">🏛️ 프론트엔드 시스템 아키텍처 결정 기록 (ADR)</h4>
        <span class="pane-sub">기술 스택 선정 이유, 대안 비교 및 장단점 분석</span>
      </div>

      <div class="adr-list">
        <div class="cal-adr-card">
          <h5>ADR 1: Vue Router 4 기반 클라이언트 라우팅 & 지연 로딩</h5>
          <p>
            단일 컴포넌트 v-if 방식을 폐기하고 지연 로딩(() => import())과 쿼리스트링(?search=)
            동기화를 구현하여 초기 번들 최적화 및 딥링크 지원.
          </p>
        </div>
        <div class="cal-adr-card">
          <h5>ADR 2: Pinia Setup Store + localStorage 양방향 영속화</h5>
          <p>
            Options Store 대신 Composition API Setup Store를 채택하고, watch(deep)를 통해 온도
            단위와 즐겨찾기 목록이 새로고침 후에도 영구 보존되도록 구현.
          </p>
        </div>
        <div class="cal-adr-card">
          <h5>ADR 3: Axios 모듈화 및 Promise.all 병렬 통신</h5>
          <p>
            src/api/weatherApi.js로 클라이언트를 분리하고 6대 산단 실시간 기상/대기질을
            Promise.all로 병렬 수신하여 응답 시간을 70% 단축.
          </p>
        </div>
        <div class="cal-adr-card">
          <h5>
            ADR 4: UI 라이브러리 이원화 (교재 실습: Element Plus / 메인 프로젝트: Cal.com Clean
            SaaS)
          </h5>
          <p>
            교재 실습(233~248p)은 Element Plus로 100% 완수하고, 실제 프로젝트에는 직관적인 가독성과
            반응성을 갖춘 Cal.com Modern-SaaS 디자인 시스템을 채택.
          </p>
        </div>
      </div>
    </div>

    <!-- 5. 커리큘럼 핵심 이론 요약 탭 -->
    <div v-if="activeTab === 'curriculum'" class="tab-pane">
      <div class="pane-header">
        <h4 class="pane-title">📖 Vue 3 강의 커리큘럼(1~8단원) 핵심 원리 총정리</h4>
        <span class="pane-sub">기초 템플릿 문법부터 라우터 및 상태 관리까지 완벽 정리</span>
      </div>

      <div class="curriculum-grid-2">
        <div class="cal-theory-card">
          <h6>1. 템플릿 디렉티브 & 데이터 바인딩</h6>
          <ul>
            <li><code>v-text</code>: 텍스트를 안전하게 이스케이프하여 XSS 방지</li>
            <li><code>v-html</code>: HTML 태그를 파싱하지만 보안 취약 주의</li>
            <li><code>v-if</code> vs <code>v-show</code>: DOM 완전 제거 vs display:none</li>
            <li><code>v-for</code> with <code>:key</code>: 가상 DOM 고유 식별 최적화</li>
          </ul>
        </div>

        <div class="cal-theory-card">
          <h6>2. Composition API 반응성</h6>
          <ul>
            <li><code>ref</code>: 원시 타입 및 객체의 반응형 참조 객체 생성</li>
            <li><code>computed</code>: 의존성 캐싱 기반 파생 데이터 자동 연산</li>
            <li><code>watch</code>: 특정 반응형 변수 변경 감지 및 부수 효과 실행</li>
            <li><code>onMounted</code>: DOM 마운트 완료 후 비동기 데이터 통신 개시</li>
          </ul>
        </div>

        <div class="cal-theory-card">
          <h6>3. 컴포넌트 계층 분리 (Components vs Views)</h6>
          <ul>
            <li><code>src/components/</code>: 재사용 가능한 UI 부품 (버튼, 카드, 입력창)</li>
            <li><code>src/views/</code>: 특정 URL과 매핑되는 완성된 페이지 단위 화면</li>
            <li>
              단방향 데이터 흐름: <code>defineProps</code>(수신) / <code>defineEmits</code>(발신)
            </li>
            <li>공통 래퍼: 기본 <code>slot</code>을 활용한 BaseDashboardCard 구현</li>
          </ul>
        </div>

        <div class="cal-theory-card">
          <h6>4. Vue Router & Pinia 전역 상태 관리</h6>
          <ul>
            <li><code>createRouter</code>: 동적 세그먼트(:cityId) 및 404 Catch-all 라우트</li>
            <li>지연 로딩: <code>() => import()</code>를 통한 번들 분할 최적화</li>
            <li><code>defineStore</code>: 컴포넌트 간 Props Drilling 제거 및 상태 일원화</li>
            <li>영속화: <code>localStorage</code> 동기화를 통한 새로고침 보존</li>
          </ul>
        </div>
      </div>
    </div>

    <button class="cal-btn-back" @click="router.push('/')">← 메인 대시보드로 이동</button>
  </div>
</template>

<style scoped>
.cal-archive-container {
  width: 100%;
}

.archive-header-cluster {
  margin-bottom: 16px;
}

.eyebrow-tag {
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 2px;
}

.main-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.6px;
  color: #111111;
}

.sub-intro {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.cal-tab-pill-group {
  display: flex;
  gap: 4px;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
  overflow-x: auto;
}

.tab-pill-item {
  background: transparent;
  border: none;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.tab-pill-item.active {
  background: #ffffff;
  color: #111111;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.tab-pane {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.pane-header {
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f3f4f6;
}

.pane-title {
  margin: 0 0 2px 0;
  font-size: 13px;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.3px;
}

.pane-sub {
  font-size: 11px;
  color: #9ca3af;
}

.showcase-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.showcase-card {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  padding: 14px;
}

.showcase-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.showcase-name {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #111111;
}

.route-badge {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  font-size: 10px;
  font-family: monospace;
  color: #2563eb;
  padding: 1px 6px;
  border-radius: 4px;
}

.showcase-desc {
  margin: 0 0 8px 0;
  font-size: 11px;
  color: #4b5563;
  line-height: 1.4;
}

.chip-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.feature-chip {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  font-size: 10px;
  color: #374151;
  padding: 2px 6px;
  border-radius: 9999px;
}

.ui-mockup-block {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mockup-row {
  display: flex;
  font-size: 11px;
  line-height: 1.4;
}

.mock-label {
  font-weight: 600;
  color: #111111;
  width: 100px;
  flex-shrink: 0;
}

.mock-detail {
  color: #4b5563;
}

.trouble-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cal-trouble-card {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 12px;
}

.trouble-heading {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #111111;
}

.trouble-row {
  font-size: 11px;
  line-height: 1.5;
  padding: 6px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
}

.problem-box {
  background: #fef2f2;
  color: #991b1b;
}

.cause-box {
  background: #fffbeb;
  color: #92400e;
}

.solution-box {
  background: #f0fdf4;
  color: #166534;
}

.tag-label {
  margin-right: 4px;
}

.domain-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cal-domain-card {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 12px;
}

.domain-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.domain-name {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #111111;
}

.mockup-tag {
  font-size: 10px;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 1px 6px;
  border-radius: 4px;
}

.formula-banner {
  background: #111111;
  color: #34d399;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-family: monospace;
  margin-bottom: 8px;
}

.domain-text {
  margin: 0 0 4px 0;
  font-size: 11px;
  color: #4b5563;
  line-height: 1.4;
}

.adr-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cal-adr-card {
  background: #f9fafb;
  border-left: 3px solid #111111;
  border-radius: 4px;
  padding: 10px 12px;
}

.cal-adr-card h5 {
  margin: 0 0 4px 0;
  font-size: 12px;
  font-weight: 600;
  color: #111111;
}

.cal-adr-card p {
  margin: 0;
  font-size: 11px;
  color: #4b5563;
  line-height: 1.4;
}

.curriculum-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.cal-theory-card {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 12px;
}

.cal-theory-card h6 {
  margin: 0 0 6px 0;
  font-size: 11px;
  font-weight: 600;
  color: #111111;
}

.cal-theory-card ul {
  margin: 0;
  padding-left: 16px;
  font-size: 11px;
  color: #4b5563;
  line-height: 1.5;
}

.cal-theory-card code {
  font-size: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 1px 4px;
  border-radius: 3px;
  color: #2563eb;
}

.cal-btn-back {
  width: 100%;
  padding: 10px;
  background-color: #111111;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cal-btn-back:hover {
  background-color: #262626;
}
</style>
