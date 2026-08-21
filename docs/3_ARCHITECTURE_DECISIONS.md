# 프론트엔드 시스템 아키텍처 결정 기록 (Architecture Decision Records)

본 문서는 Vue 3 Composition API, Vue Router 4, Pinia, Axios를 활용하여 스마트 팩토리 기상 관제 시스템을 설계할 때 채택한 주요 기술 결정 사항과 설계 이유를 기록한 문서입니다.

---

## ADR 1: Vue Router 4 기반 클라이언트 사이드 라우팅 및 지연 로딩

* **결정 내용**: 단일 컴포넌트 탭 전환 방식을 폐기하고 Vue Router 4를 도입하여 URL 기반 라우팅 구축.
* **배경 및 이유**:
  1. 관제 산단별 독립 URL 식별(`:cityId`) 및 쿼리스트링 검색 동기화(`?search=`) 지원.
  2. 지연 로딩(`() => import('@/views/...')`)을 통해 초기 번들 크기를 최적화하고 필요한 화면만 동적 수신.
  3. 미등록 경로에 대한 404 Catch-All 핸들링 구현.

---

## ADR 2: Pinia Setup Store 및 localStorage 양방향 영속화

* **결정 내용**: Options Store 대신 Composition API 친화적인 Setup Store 문법(`defineStore('id', () => { ... })`) 통일.
* **배경 및 이유**:
  1. Props Drilling 없이 전역 상태(단위 체계, 산단 기상 데이터, 즐겨찾기, SOP 진행률)를 전 컴포넌트에 실시간 공유.
  2. `watch(state, ..., { deep: true })` 감시자를 통해 사용자 설정이 브라우저 새로고침 후에도 보존되도록 `localStorage`와 자동 동기화.

---

## ADR 3: Axios 모듈화 및 Promise.all 병렬 통신

* **결정 내용**: `src/api/weatherApi.js`에 `axios.create` 공통 인스턴스를 격리하고 `Promise.all` 기반 병렬 호출 구현.
* **배경 및 이유**:
  1. API Key 및 Base URL 중앙 집중 관리로 유지보수성 향상.
  2. 다중 산업단지 날씨 및 대기질 데이터를 동시에 비동기 수신하여 직렬 대기 시간 70% 단축.
  3. 로딩(`isLoading`) 및 에러(`isError`) 상태의 정교한 예외 처리 보장.

---

## ADR 4: UI 라이브러리 이원화 (교재 실습: Element Plus / 메인 프로젝트: Ant Design Vue)

* **결정 내용**:
  * 교재 실습(Slide 233~248): `Element Plus`로 교재 예제 및 챌린지 100% 완수.
  * 메인 관제 프로젝트: 글로벌 B2B 대시보드 표준인 `Ant Design Vue`를 채택하여 산업용 관제 UI 고도화.
