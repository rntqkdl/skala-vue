# SKALA 산단 기상 재해 관제 및 스마트 공정 예측 콘솔

> **OpenWeatherMap 실시간 기상 관측 스트림과 6대 국가산단 설비 물리 손상 모델을 결합한 스마트 공정 안전 관제 콘솔**

---

## 1. 프로젝트 개요

- **개발 목적**: 폭염, 집중호우, 혹한, 낙뢰, 미세먼지 등 기상이변 발생 시 대한민국 6대 국가산업단지(창원, 울산, 군산, 광주, 포항, 여수)의 핵심 설비(CNC 공작기계, 옥외 배관, 대형 프레스 유압유, 반도체 클린룸) 파손을 방지하고 표준 작업 절차(SOP)를 가동하기 위한 관제 시스템입니다.
- **기술 스택**: Vue 3 (`<script setup>`), Vue Router 4, Pinia, Axios, Element Plus, Ant Design Vue, 반응형 SVG 시각화.

---

## 2. Vue.js 교육과정(1~10단원) 기능 매핑 명세표

강의 교재 10대 단원 전 범위의 문법과 실습 예제를 충실히 반영하여 구현했습니다.

| 단원                        | 핵심 학습 목표                                                                                                                                 | 실제 구현 파일 및 기능                                                                                                                                                                                                                                                                                                                                          |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1단원 Modern JS**         | • `let/const`, 화살표 함수<br>• 구조 분해 할당, Spread/Rest(`...`)<br>• `async/await` 비동기 파이프라인, 옵셔널 체이닝(`?.`), Nullish(`??`)    | • [`ModernJsPractice.vue`](file:///C:/workspace/skala-vue/src/components/practices/library/ModernJsPractice.vue)<br>• [`weatherStore.js`](file:///C:/workspace/skala-vue/src/stores/weatherStore.js), [`weatherApi.js`](file:///C:/workspace/skala-vue/src/api/weatherApi.js)                                                                                   |
| **2단원 Vue 3 시작**        | • Vite 기반 번들링 환경<br>• 싱글 파일 컴포넌트(SFC, `.vue`)<br>• Composition API `<script setup>`                                             | • [`vite.config.js`](file:///C:/workspace/skala-vue/vite.config.js), [`main.js`](file:///C:/workspace/skala-vue/src/main.js)<br>• 전체 컴포넌트 `<script setup>` 표준 적용                                                                                                                                                                                      |
| **3단원 템플릿 문법**       | • `v-bind(:)`, `v-model` 양방향 바인딩<br>• `v-if/v-else` 조건부 렌더링<br>• `v-for` 순회 & `:key` 바인딩, `v-on(@)` 이벤트                    | • [`SearchBar.vue`](file:///C:/workspace/skala-vue/src/components/handson/SearchBar.vue): `v-model` 입력 바인딩<br>• [`WeatherCard.vue`](file:///C:/workspace/skala-vue/src/components/handson/WeatherCard.vue): `:key="item.id"` 렌더링<br>• [`LandingView.vue`](file:///C:/workspace/skala-vue/src/views/LandingView.vue): 미니 시뮬레이터 실시간 반응형 연산 |
| **4단원 Composition API**   | • `ref` / `reactive` 반응형 상태<br>• `computed` 계산된 속성 캐싱<br>• `watch` / `watchEffect` 부수 효과<br>• `onMounted` 생명주기 훅          | • `computed`: 전국 평균 기온, 특보 산단 분류, 열변형 오차 연산<br>• `watch`: 검색어 입력 시 주소창 쿼리(`?search=`) 자동 동기화<br>• `onMounted`: 오픈 API 비동기 데이터 로딩                                                                                                                                                                                   |
| **5단원 컴포넌트 통신**     | • `defineProps` (부모 ➡️ 자식 데이터 전달)<br>• `defineEmits` (자식 ➡️ 부모 이벤트 발신)<br>• `<slot>` 레이아웃 컴포넌트 분리                  | • [`WeatherCard.vue`](file:///C:/workspace/skala-vue/src/components/handson/WeatherCard.vue): `defineProps`, `defineEmits`<br>• [`BaseDashboardCard.vue`](file:///C:/workspace/skala-vue/src/components/handson/BaseDashboardCard.vue): 기본 및 커스텀 `<slot>` 분리                                                                                            |
| **6단원 Vue Router 4**      | • `createRouter` 및 `createWebHistory`<br>• 동적 라우트 매칭 (`:cityId`)<br>• 지연 로딩 `() => import()` 번들 최적화<br>• 404 Catch-all 라우팅 | • [`router/index.js`](file:///C:/workspace/skala-vue/src/router/index.js)<br>• `/`, `/dashboard`, `/weather/:cityId`, `/radar`, `/alerts`, `/archive`, `/practices`, 404 라우팅 구현                                                                                                                                                                            |
| **7단원 Pinia 상태 관리**   | • `defineStore` Setup Store 방식<br>• `state`, `getters`, `actions` 구조<br>• `localStorage` 영속화 연동                                       | • [`weatherStore.js`](file:///C:/workspace/skala-vue/src/stores/weatherStore.js): 6대 산단 기상 데이터 및 CRUD<br>• [`configStore.js`](file:///C:/workspace/skala-vue/src/stores/configStore.js): 온도 단위(℃/℉) 및 테마 제어<br>• [`alertStore.js`](file:///C:/workspace/skala-vue/src/stores/alertStore.js): 특보 판정 및 SOP 체크리스트 저장                 |
| **8단원 Axios & REST API**  | • `axios.get` 비동기 통신<br>• 쿼리 파라미터 전달 및 에러 핸들링<br>• 병렬 호출 (`Promise.allSettled`)                                         | • [`AxiosWeather.vue`](file:///C:/workspace/skala-vue/src/components/practices/library/AxiosWeather.vue), [`AxiosJson.vue`](file:///C:/workspace/skala-vue/src/components/practices/library/AxiosJson.vue)<br>• OpenWeatherMap 날씨, 예보, 대기질, 지오코딩 4대 엔드포인트 연동                                                                                 |
| **9단원 UI 라이브러리**     | • 실무 컴포넌트 라이브러리 결합<br>• 전역 CSS 변수 및 디자인 토큰<br>• 반응형 듀얼 테마 (라이트 & 다크)                                        | • `Element Plus`: 통계 카드, 슬라이더, 모달, 다이얼로그, 세그먼트, 데이터 테이블<br>• `Ant Design Vue`: 슬라이드 드로어, 타임라인, 설명 목록표                                                                                                                                                                                                                  |
| **10단원 Vite 빌드 & 배포** | • `.env` 환경변수 키 보안 관리<br>• 정적 분석 도구 (ESLint, Oxlint, Prettier)<br>• 프로덕션 번들 빌드 최적화                                   | • [`ViteEnvBuildPractice.vue`](file:///C:/workspace/skala-vue/src/components/practices/library/ViteEnvBuildPractice.vue)<br>• `npm run lint` 0 에러 통과 및 `npm run build` 정적 번들링                                                                                                                                                                         |

---

## 3. 화면 구성 및 핵심 컴포넌트

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. 메인 서비스 랜딩 (LandingView - `/`)                                                 │
│  - 히어로 배너, 관제 현황 실시간 요약 뱃지 바, 6대 산단 가로 라이브 티커                │
│  - 인터랙티브 미니 공정 물리 시뮬레이터 (온도/습도 슬라이더 연동 실시간 변형률 계산)   │
│  - 3단계 엔지니어링 방어 체계 및 6대 산단 빠른 진입 그리드                             │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. 산단 종합 관제 대시보드 (WeatherHomeView - `/dashboard`)                             │
│  - 4분면 핵심 통계 그리드 (<el-statistic>) & 공정 기상 시뮬레이션 제어 바               │
│  - [대한민국 벡터 SVG 인터랙티브 맵] + [24시간 공정 리스크 예측 곡선 차트] Bento Grid    │
│  - OpenWeather Geocoding 기반 신규 산단 동적 등록 (ComplexRegisterCard)                 │
│  - 산단 검색 및 즐겨찾기 필터, 신속 SOP 점검 드로어 (<a-drawer>)                       │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. 전국 기상 레이더 & 24시간 예측 (WeatherRadarView - `/radar`)                         │
│  - OpenWeatherMap 위성 기상 레이더 타일 맵 (강우/기온/구름/풍속 4종 레이어 전환)       │
│  - 24시간 최고 기온 피크 사전 경보 배너 및 6대 산단 실시간 종합 비교 매트릭스          │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. 실시간 안전 수칙 & 긴급 SOP (WeatherAlertView - `/alerts`)                           │
│  - 산단별 기상 특보 등급 판정 (정상/주의/경보) 및 과거 재해 원인 분석 백서             │
│  - 현장 표준 안전 수칙(SOP) 체크리스트 및 실시간 진행률 프로그레스 (<el-progress>)      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 5. 산단 정밀 관측 상세 뷰 (WeatherDetailView - `/weather/:cityId`)                      │
│  - 라우트 파라미터(:cityId) 바인딩 및 상단 6대 산단 빠른 전환 셀렉트 (<el-select>)      │
│  - 실시간 기온/습도/풍속/기압 및 대기질(PM2.5, PM10, AQI 지수) 계측표                  │
│  - 향후 24시간 예보 타임라인 (<a-timeline>) 및 과거 재해 방어 대책 아코디언             │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 6. 기술 아카이브 & 교재 실습장 (/archive, /practices)                                  │
│  - TechArchiveView: UI 비주얼 갤러리, 5대 기술 난제 트러블슈팅, 물리 공식, 비전공자 가이드│
│  - PracticeView: 1단원(Modern JS) ~ 10단원(Vite Build) 총 19개 단원 실습 앵커 라이브   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 화면별 테스트 시나리오

브라우저에서 구현된 주요 기능들을 바로 검증할 수 있는 테스트 경로입니다.

### ① 메인 서비스 랜딩 (`/`)

- **경로**: `http://localhost:5173/`
- **테스트 항목**:
  1. **인터랙티브 미니 시뮬레이터**: 외기 기온('15~42℃') 및 습도('20~98%'') 슬라이더를 조작하면 창원 CNC 열변형(+μm), 울산 배관 부식도(%), 군산 프레스 작동유 온도(℃), 광주 클린룸 상태가 실시간으로 재계산되어 표시됩니다.
  2. **실시간 라이브 티커**: 6대 산단의 기온과 상태가 가로 스크롤 칩으로 노출되며, 클릭 시 해당 산단 상세 관제 화면으로 이동합니다.
  3. **대시보드 바로가기 CTA**: 상단 버튼 클릭 시 종합 관제 대시보드로 이동합니다.

### ② 산단 종합 대시보드 (`/dashboard`)

- **경로**: `http://localhost:5173/dashboard`
- **테스트 항목**:
  1. **대한민국 벡터 SVG 인터랙티브 맵**: 지도 위의 산단 핀을 클릭하면 24시간 예측 트렌드 차트의 대상 산단이 즉시 동기화됩니다.
  2. **24시간 예측 곡선 차트**: 기온, 습도, 설비 열변형(μm) 탭을 전환하며 시간대별 예측 곡선을 확인합니다.
  3. **가상 기상 시뮬레이션**: 상단 `🚨 폭염 셧다운 (36℃)` 클릭 시 기온 데이터가 가상치로 변경되며 **다크 관제 테마로 자동 전환**됩니다. `↺ 실시간 복원` 클릭 시 실제 관측치로 원복됩니다.
  4. **신규 산단 동적 등록**: 상단 `📍 신규 등록 열기`를 누르고 도시명(예: 구미, 청주, 당진)을 입력하면 Geocoding API를 통해 실시간으로 위경도 좌표를 조회하여 관제 목록에 추가합니다.
  5. **신속 SOP 점검 드로어**: 카드의 `⚡ 점검표` 버튼 클릭 시 Ant Design 슬라이드 드로어가 열리며 체크박스 상태가 `localStorage`에 영속화됩니다.

### ③ 전국 기상 레이더 & 24시간 예측 (`/radar`)

- **경로**: `http://localhost:5173/radar`
- **테스트 항목**:
  1. **위성 레이더 타일 맵**: `강우 레이더`, `기온 열지도`, `구름 위성`, `풍속 레이더` 세그먼트 전환 시 OpenWeatherMap 실시간 레이더 타일이 교체 렌더링됩니다.
  2. **24시간 피크 기온 경보**: 24시간 내 최고 기온에 도달하는 산단과 도달 시점을 `computed`로 자동 추출한 상단 경보 배너를 확인합니다.

### ④ 실시간 안전 수칙 & 긴급 SOP (`/alerts`)

- **경로**: `http://localhost:5173/alerts`
- **테스트 항목**:
  1. **특보 등급 판정**: 관측 데이터를 기준으로 산단별 정상/주의/경보 뱃지가 부여됩니다.
  2. **SOP 체크리스트 및 진행률**: 항목 체크 시 원형 프로그레스 바가 상승하며 새로고침 후에도 상태가 유지됩니다.

### ⑤ 산단 정밀 관측 상세 뷰 (`/weather/:cityId`)

- **경로**: `http://localhost:5173/weather/city_01` (창원)
- **테스트 항목**:
  1. **산단 빠른 전환 셀렉트**: 상단 드롭다운에서 산단을 변경하면 URL 라우트와 기상 데이터, 24시간 예보 타임라인, 대기질 지표가 즉시 갱신됩니다.
  2. **과거 재해 이력 아코디언**: 하단 아코디언을 열어 과거 설비 파손 원인과 방어 대책을 열람합니다.

### ⑥ 기술 아카이브 & 교재 실습장 (`/archive`, `/practices`)

- **경로**: `http://localhost:5173/archive`, `http://localhost:5173/practices`
- **테스트 항목**:
  1. **기술 아카이브**: UI 갤러리, 5대 난제 트러블슈팅, 물리 공식, 비전공자 기준 가이드를 탭별로 확인합니다.
  2. **교재 실습장**: 1단원(Modern JS)부터 10단원(Vite Build)까지 19개 단원 실습 예제를 라이브로 직접 조작합니다.

---

## 5. 설치 및 실행 가이드

### 1) 환경 요구사항

- **Node.js**: v20.19.0 이상 또는 v22.12.0 이상 권장
- **Vite**: v8.2.1

### 2) 환경변수 설정 (`.env`)

프로젝트 루트 경로에 `.env` 파일을 생성하고 OpenWeatherMap API 키를 설정합니다.

```env
VITE_OPENWEATHER_API_KEY=d2b5a5dafabfd6672625a209f2f74423
```

### 3) 실행 명령어

```bash
# 의존성 패키지 설치
npm install

# 로컬 개발 서버 기동 (http://localhost:5173)
npm run dev

# 린트 검사 (Oxlint & ESLint)
npm run lint

# 코드 포맷팅 (Prettier)
npm run format

# 프로덕션 번들 빌드
npm run build
```

---

## 6. 디렉토리 구조

```text
skala-vue/
├── src/
│   ├── api/                  # OpenWeatherMap REST API 통신 파이프라인 (weatherApi.js)
│   ├── assets/               # 전역 토큰, 레이아웃, 컴포넌트, 다크모드 고대비 스타일
│   │   ├── tokens.css        # 듀얼 테마 CSS 디자인 토큰
│   │   ├── layout.css        # 네비게이션 및 전체 레이아웃
│   │   ├── components.css    # Element Plus / Ant Design Vue 다크모드 통합 오버라이드
│   │   └── practice.css      # 교재 실습 전용 스타일
│   ├── components/
│   │   ├── handson/          # 실전 관제 컴포넌트 (NationalComplexMap, ComplexTrendChart 등)
│   │   └── practices/        # 1~10단원 교재 실습 컴포넌트 아카이브 (19개 모듈)
│   ├── data/                 # 6대 산단 메타데이터 및 재해 이력 (incidentHistory.js)
│   ├── router/               # Vue Router 설정 (index.js)
│   ├── stores/               # Pinia 전역 스토어 (weatherStore, configStore, alertStore)
│   ├── views/                # 7대 핵심 라우트 뷰 페이지
│   ├── App.vue               # 최상위 루트 컴포넌트 (테마 제어 및 글로벌 네비게이션)
│   └── main.js               # 애플리케이션 진입점
├── .env                      # 환경변수 파일
├── package.json              # 프로젝트 의존성 설정
└── README.md                 # 프로젝트 통합 가이드
```

---

© 2026 SKALA Engineering. Vue.js 3 Production System.
