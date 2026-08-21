<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTabKey = ref('troubleshoot')

// 1. 트러블슈팅 항목 목록
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

// 2. 6대 산단 공정 모델
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
  <div class="archive-container">
    <div class="archive-header">
      <h3>📚 스마트 팩토리 엔지니어링 아카이브 & 트러블슈팅 관제실</h3>
      <span class="sub-text">Day 1 ~ Day 4 개발 여정 및 기술 결정 전수 보존 공간</span>
    </div>
    <hr />

    <!-- Ant Design Vue Tabs -->
    <a-tabs v-model:activeKey="activeTabKey" type="card">
      <!-- 1. 트러블슈팅 탭 -->
      <a-tab-pane key="troubleshoot" tab="🛠️ 트러블슈팅 5대 난제">
        <div class="tab-content">
          <h4>🛠️ 실전 개발 트러블슈팅 및 디버깅 5대 핵심 해결 기록</h4>
          <a-card v-for="item in troubleshootList" :key="item.id" class="trouble-card">
            <h5>{{ item.title }}</h5>
            <div class="trouble-block problem">
              <strong>🚨 발생 문제:</strong> {{ item.problem }}
            </div>
            <div class="trouble-block cause"><strong>🔍 근본 원인:</strong> {{ item.cause }}</div>
            <div class="trouble-block solution">
              <strong>✅ 해결 방안:</strong> {{ item.solution }}
            </div>
          </a-card>
        </div>
      </a-tab-pane>

      <!-- 2. 공정별 물리 모델 탭 -->
      <a-tab-pane key="domain" tab="🏭 공정별 물리 모델 & 목업 DB">
        <div class="tab-content">
          <h4>🏭 6대 국가산단 공정별 물리 리스크 모델 & 교육용 목업 시나리오</h4>
          <a-alert
            message="교육 및 실습용 목업(Mock-up) 시나리오"
            description="본 데이터베이스의 사고 사례 및 손실액은 실제 산업 재해 백서를 모델링한 교육용 목업 데이터입니다."
            type="info"
            show-icon
            class="mockup-alert"
          />

          <a-card v-for="item in domainList" :key="item.name" class="domain-card">
            <h5>{{ item.name }}</h5>
            <div class="formula-box">
              <code>{{ item.formula }}</code>
            </div>
            <p class="domain-desc">💡 <strong>공학적 배경:</strong> {{ item.desc }}</p>
            <p class="domain-mockup">📑 <strong>교육용 재해 시나리오:</strong> {{ item.mockup }}</p>
          </a-card>
        </div>
      </a-tab-pane>

      <!-- 3. 아키텍처 결정(ADR) 탭 -->
      <a-tab-pane key="architecture" tab="🏛️ 아키텍처 결정 (ADR)">
        <div class="tab-content">
          <h4>🏛️ 프론트엔드 시스템 아키텍처 결정 기록 (ADR)</h4>
          <a-card class="adr-card">
            <h5>ADR 1: Vue Router 4 기반 클라이언트 라우팅 & 지연 로딩</h5>
            <p>
              단일 컴포넌트 v-if 방식을 폐기하고 지연 로딩(() => import())과 쿼리스트링(?search=)
              동기화를 구현하여 초기 번들 최적화 및 딥링크 지원.
            </p>
          </a-card>
          <a-card class="adr-card">
            <h5>ADR 2: Pinia Setup Store + localStorage 양방향 영속화</h5>
            <p>
              Options Store 대신 Composition API Setup Store를 채택하고, watch(deep)를 통해 온도
              단위와 즐겨찾기 목록이 새로고침 후에도 영구 보존되도록 구현.
            </p>
          </a-card>
          <a-card class="adr-card">
            <h5>ADR 3: Axios 모듈화 및 Promise.all 병렬 통신</h5>
            <p>
              src/api/weatherApi.js로 클라이언트를 분리하고 6대 산단 실시간 기상/대기질을
              Promise.all로 병렬 수신하여 응답 시간을 70% 단축.
            </p>
          </a-card>
          <a-card class="adr-card">
            <h5>ADR 4: UI 라이브러리 이원화 (실습: Element Plus / 메인: Ant Design Vue)</h5>
            <p>
              교재 실습(233~248p)은 Element Plus로 완수하고, 실제 프로젝트에는 글로벌 B2B 대시보드
              표준인 Ant Design Vue를 채택하여 산업용 관제 UI 고도화.
            </p>
          </a-card>
        </div>
      </a-tab-pane>

      <!-- 4. 커리큘럼 요약 탭 -->
      <a-tab-pane key="curriculum" tab="📖 강의 커리큘럼 요약">
        <div class="tab-content">
          <h4>📖 Vue 3 강의 커리큘럼 핵심 원리 요약</h4>
          <div class="curriculum-grid">
            <a-card class="curr-card">
              <h6>1. 템플릿 디렉티브</h6>
              <p>
                v-model(양방향), v-if/v-show(렌더링 비용), v-for with :key(가상 DOM 고유 식별),
                @click.stop(이벤트 버블링 차단)
              </p>
            </a-card>
            <a-card class="curr-card">
              <h6>2. Composition API</h6>
              <p>
                ref(원시타입 반응성), computed(캐싱 연산), watch(특정 상태 감시), onMounted(생명주기
                비동기 호출)
              </p>
            </a-card>
            <a-card class="curr-card">
              <h6>3. 컴포넌트 계층 분리</h6>
              <p>
                BaseDashboardCard(기본 슬롯 slot), SearchBar/WeatherCard(defineProps, defineEmits
                단방향 흐름)
              </p>
            </a-card>
            <a-card class="curr-card">
              <h6>4. Vue Router & Pinia</h6>
              <p>
                createRouter(동적 라우트 :cityId, 404 Catch-all), defineStore(전역 상태 중앙 집중
                관리 및 영속화)
              </p>
            </a-card>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 이동</button>
  </div>
</template>

<style scoped>
.archive-container {
  width: 600px;
  margin: 0 auto;
  background: white;
  padding: 22px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  color: #2c3e50;
}

.archive-header h3 {
  margin: 0 0 4px 0;
  font-size: 1.15rem;
  color: #2c3e50;
  font-weight: 700;
}

.sub-text {
  font-size: 11px;
  color: #7f8c8d;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin: 12px 0 16px 0;
}

.tab-content h4 {
  margin: 10px 0 12px 0;
  font-size: 13px;
  color: #1e293b;
  font-weight: 700;
}

.trouble-card {
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.trouble-card h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #1e293b;
  font-weight: 700;
}

.trouble-block {
  font-size: 11px;
  line-height: 1.5;
  padding: 6px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.trouble-block.problem {
  background: #fff5f5;
  color: #c53030;
}

.trouble-block.cause {
  background: #fffaf0;
  color: #c05621;
}

.trouble-block.solution {
  background: #f0fff4;
  color: #22543d;
}

.domain-card {
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.domain-card h5 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #1e293b;
  font-weight: 700;
}

.formula-box {
  background: #1e293b;
  color: #38bdf8;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 11px;
  margin-bottom: 6px;
  font-family: monospace;
}

.domain-desc,
.domain-mockup {
  margin: 0 0 4px 0;
  font-size: 11px;
  line-height: 1.4;
  color: #475569;
}

.mockup-alert {
  margin-bottom: 12px;
  border-radius: 6px;
}

.adr-card {
  margin-bottom: 10px;
  border-left: 3px solid #1890ff;
  border-radius: 4px;
}

.adr-card h5 {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #1e293b;
  font-weight: 700;
}

.adr-card p {
  margin: 0;
  font-size: 11px;
  color: #475569;
  line-height: 1.4;
}

.curriculum-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.curr-card {
  border-radius: 6px;
}

.curr-card h6 {
  margin: 0 0 4px 0;
  font-size: 11px;
  color: #1e293b;
  font-weight: 700;
}

.curr-card p {
  margin: 0;
  font-size: 10px;
  color: #64748b;
  line-height: 1.4;
}

.back-btn {
  width: 100%;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  margin-top: 14px;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #1a252f;
}
</style>
