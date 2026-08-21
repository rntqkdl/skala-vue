# SKALA 산단 기상 재해 관제 및 스마트 공정 예측 콘솔

> **OpenWeatherMap 실시간 기상 데이터와 6대 국가산업단지 물리 위험 모델을 결합한 B2B 스마트 공정 안전 관리 플랫폼**

---

## 1. 프로젝트 개요 (Project Overview)

* **개발 목적**: 하계/동계 기상이변(폭염, 집중호우, 혹한, 낙뢰, 미세먼지) 발생 시 주요 국가산업단지(창원, 울산, 화성, 여수, 포항, 구미)의 핵심 설비(CNC 공작기계, 유압 배관, 압연 모터, 클린룸) 파손을 사전에 방지하고 표준 작업 절차(SOP)를 신속히 가동하기 위한 관제 시스템입니다.
* **기술 스택**: Vue 3 (`<script setup>`), Vue Router 4, Pinia, Axios, UI 라이브러리(Element Plus, Ant Design Vue)를 바탕으로 설계되었습니다.

---

## 2. Vue.js 핵심 커리큘럼(1~10단원) 기능 매핑 명세표

| 단원 | 핵심 학습 목표 | 실제 구현 파일 및 기능 |
| :--- | :--- | :--- |
| **제 1단원<br>Modern JS (ES6+)** | • `let/const`, 화살표 함수<br>• 구조 분해 할당, Spread(`...`)<br>• `async/await` 비동기 처리 | • `weatherStore.js`, `useApi.js`<br>• 불변성 유지 객체 복사 및 `Promise.allSettled` 비동기 파이프라인 |
| **제 2단원<br>Vue 3 & Vite** | • Vite 번들러 기반 개발 환경<br>• 싱글 파일 컴포넌트(SFC, `.vue`)<br>• Composition API `<script setup>` | • `vite.config.js`, `main.js`<br>• 전체 뷰 및 컴포넌트에 `<script setup>` 표준 적용 |
| **제 3단원<br>템플릿 디렉티브** | • `v-bind(:)`, `v-model` 양방향 바인딩<br>• `v-if/v-else` 조건부 렌더링<br>• `v-for` 목록 순회 & `:key` 고유 바인딩<br>• `v-on(@)` 이벤트 수신 | • `SearchBar.vue`: `v-model="searchQuery"`<br>• `WeatherCard.vue`: `:key="item.id"`, `:item="item"`<br>• `WeatherHomeView.vue`: `v-if/v-else` 상태 분기 |
| **제 4단원<br>Composition API** | • `ref` / `reactive` 반응형 상태<br>• `computed` 파생 데이터 캐싱 연산<br>• `watch` / `watchEffect` 부수 효과<br>• `onMounted` 생명주기 훅 | • `computed`: 전국 평균 기온, 특보 산단 목록, 위험도 연산<br>• `watch`: 검색어 입력 시 주소창 쿼리(`?search=`) 자동 동기화<br>• `onMounted`: 오픈 API 비동기 데이터 로딩 |
| **제 5단원<br>컴포넌트 통신** | • `defineProps` (부모 ➡️ 자식 데이터 전달)<br>• `defineEmits` (자식 ➡️ 부모 이벤트 발신)<br>• `<slot>` 레이아웃 컴포넌트 분리 | • `WeatherCard.vue`: `defineProps({ item })`, `defineEmits(['click-detail'])`<br>• `BaseDashboardCard.vue`: 기본 및 커스텀 `<slot>` 분리 |
| **제 6단원<br>Vue Router 4** | • `createRouter` 및 `createWebHistory`<br>• 동적 라우트 매칭 (`:cityId`)<br>• 지연 로딩 `() => import()` 번들 최적화<br>• `scrollBehavior` (상단 스크롤 복원) | • `router/index.js`<br>• `/weather/:cityId`, `/radar`, `/alerts`, `/archive`, `/practices`, 404 Catch-all 라우트 구현 |
| **제 7단원<br>Pinia 상태 관리** | • `defineStore` 단일 책임 원칙(SRP)<br>• `state`, `getters`, `actions` 구조<br>• Props Drilling 제거 및 `localStorage` 동기화 | • `weatherStore.js`: 6대 산단 기상 데이터 및 CRUD<br>• `configStore.js`: 온도 단위(℃/℉) 및 테마 제어<br>• `alertStore.js`: 특보 판정 및 SOP 체크리스트 영속화 |
| **제 8단원<br>Axios & REST API** | • `axios.get` 비동기 통신<br>• 쿼리 파라미터 전달 및 에러 핸들링<br>• 병렬 호출 (`Promise.allSettled`) | • OpenWeatherMap 실시간 날씨, 5일 3시간 예보, 대기질(AQI), 지오코딩 4대 엔드포인트 연동 |
| **제 9단원<br>UI 라이브러리** | • 실무 컴포넌트 라이브러리 결합<br>• 전역 CSS 변수 및 디자인 토큰<br>• 반응형 듀얼 테마 (라이트 & 다크) | • `Element Plus`: 통계 위젯, 게이지 바, 세그먼트, 데이터 테이블<br>• `Ant Design Vue`: 슬라이드 드로어, 타임라인, 설명 목록표 |
| **제 10단원<br>빌드 및 환경변수** | • `.env` 환경변수 키 보안 은닉<br>• 린터 코드 품질 검사 (ESLint, Oxlint)<br>• 프로덕션 번들 빌드 최적화 | • `import.meta.env.VITE_OPENWEATHER_API_KEY` 은닉<br>• `npm run lint` 0 에러 통과 및 `npm run build` 500ms 빌드 |

---

## 3. 핸즈온(Hands-on) 단계별 확장 발전 구조

기초 실습 컴포넌트부터 단계적으로 모듈화하고 확장하여 산단 관제 플랫폼으로 구성되었습니다.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Hands-on 1: 기초 반응형 실습]                                                         │
│  - WeatherComposition.vue : ref, computed 기반 단일 파일 기상 표출                     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Hands-on 2: 컴포넌트 모듈화 분리]                                                     │
│  - WeatherParent.vue ➡️ SearchBar.vue, WeatherCard.vue, UnitToggler.vue                │
│  - defineProps / defineEmits 기반 단방향 데이터 흐름 및 레이아웃 슬롯 분리             │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Hands-on 3: Pinia 전역 스토어 구축 & Props Drilling 해결]                             │
│  - StoreCounter.vue ➡️ weatherStore.js, configStore.js, alertStore.js                  │
│  - 단위 변환, 즐겨찾기, SOP 점검표 진행률 localStorage 영속화 연동                      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Hands-on 4: OpenWeatherMap 4대 REST API 비동기 파이프라인]                             │
│  - 현재 날씨(/weather), 24시간 예보(/forecast), 대기질(/air_pollution), 지오코딩(/geo) │
│  - Promise.allSettled 병렬 비동기 호출 및 네트워크 에러 방어 로직                      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Hands-on 5: 스마트 듀얼 테마 & 6대 국가산단 물리 위험 관제 플랫폼]                    │
│  - 평소: 가독성 높은 라이트 에디토리얼 모드                                            │
│  - 폭염(33℃↑) 및 위험 특보 발생 시: 다크 관제 콘솔 모드 자동 전환                      │
│  - Element Plus & Ant Design Vue 듀얼 UI 라이브러리 결합                                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 기능별 즉시 테스트 가이드 (Quick Test Scenarios)

각 화면별로 구현된 핵심 기능들을 브라우저에서 바로 클릭하여 검증할 수 있는 시나리오입니다.

### ① 산단 대시보드 (`/`)
* **테스트 경로**: `http://localhost:5173/`
* **즉시 테스트 시나리오**:
  1. **상태 테스트 (Status Test)**: 상단의 `☀️ 봄날씨 (22℃ / 라이트)` 클릭 시 라이트 모드 유지, `🚨 폭염 (36℃ / 다크)` 클릭 시 즉시 **다크 관제 모드로 자동 전환**되는 반응형 테마 테스트.
  2. **검색 및 쿼리스트링 동기화**: 검색창에 `창원` 입력 시 URL 주소창이 `/?search=창원`으로 자동 동기화되며 해당 카드만 필터링 렌더링.
  3. **즐겨찾기 토글**: 카드의 `⭐` 아이콘 클릭 시 즐겨찾기에 등록되며, 상단 `⭐ 즐겨찾기` 세그먼트 필터 클릭 시 즐겨찾기 산단만 노출.
  4. **신속 SOP 점검 드로어**: 카드의 `⚡ 점검표` 버튼 클릭 시 Ant Design 우측 슬라이드 드로어가 열리며 현장 점검표 확인 가능.
  5. **온도 단위 전환**: 상단 우측 `℃` / `℉` 버튼 클릭 시 모든 산단 카드의 기온이 실시간 자동 환산.

### ② 전국 기상 레이더 & 24시간 예측 (`/radar`)
* **테스트 경로**: `http://localhost:5173/radar`
* **즉시 테스트 시나리오**:
  1. **위성 레이더 타일 맵 오버레이**: `🌧️ 강우 레이더`, `🌡️ 기온 열지도`, `☁️ 구름 위성`, `💨 풍속 레이더` 세그먼트 전환 시 OpenWeatherMap 실시간 레이더 타일 맵 변경 확인.
  2. **24시간 최고 기온 피크 예측**: 향후 24시간 중 가장 기온이 높은 산단과 도달 시간을 `computed`로 자동 추출한 상단 피크 경보 배너 확인.
  3. **산단 종합 비교 매트릭스**: 전국 6대 산단의 기온, 습도, 초미세먼지, 공정 위험 지표를 Element Plus 테이블로 비교 열람.

### ③ 실시간 안전 수칙 & 긴급 SOP (`/alerts`)
* **테스트 경로**: `http://localhost:5173/alerts`
* **즉시 테스트 시나리오**:
  1. **3단계 공정 비상 대응 절차**: `1단계 (감지)` ➡️ `2단계 (조치)` ➡️ `3단계 (복귀)`로 구성된 선명한 카드 스텝 구조 확인.
  2. **현장 SOP 체크리스트 영속화**: 체크박스 클릭 시 원형 프로그레스 바(`el-progress`) 수치가 올라가며, 새로고침 후에도 `localStorage`를 통해 체크 상태 유지.

### ④ 산단 정밀 관측 상세 뷰 (`/weather/:cityId`)
* **테스트 경로**: `http://localhost:5173/weather/city_01` (창원 정밀기계 산단)
* **즉시 테스트 시나리오**:
  1. **동적 라우트 파라미터 매핑**: URL의 `:cityId`를 읽어와 해당 산단의 상세 기상 관측 정보 렌더링.
  2. **향후 24시간 기온 예보 타임라인**: 3시간 간격의 기온 및 강수확률 예보 타임라인 확인.
  3. **과거 재해 원인 및 물리 메커니즘**: 하단 아코디언(`<el-collapse>`)을 열어 실제 과거 설비 파손 원인 및 표준 방어 대책 열람.

### ⑤ 기술 백서 & 비전공자 마스터 클래스 (`/archive`)
* **테스트 경로**: `http://localhost:5173/archive`
* **즉시 테스트 시나리오**:
  1. **5개 탭 전환**: `📸 UI 비주얼 갤러리`, `🛠️ 5대 기술 난제 트러블슈팅`, `📐 재해 물리 공식`, `🏛️ 아키텍처 결정서(ADR)`, `📖 비전공자 마스터 클래스` 열람.
  2. **10장 인터랙티브 슬라이드 & 라우트 테스트**: 5번째 탭에서 1~10장 슬라이드를 넘기며, 하단의 **[해당 화면으로 이동하여 테스트 →]** 버튼 클릭 시 해당 기능이 작동하는 실제 라우트로 즉시 이동.

### ⑥ 1~15단원 기초 실습 아카이브 (`/practices`)
* **테스트 경로**: `http://localhost:5173/practices`
* **즉시 테스트 시나리오**:
  1. **1~15단원 퀵 점프**: 상단 `1. 기본구조`부터 `15. Pinia 스토어` 칩 버튼 클릭 시 해당 단원 실습 컴포넌트로 부드럽게 스크롤 이동.
  2. **라이브 컴포넌트 직접 실행**: 기초 실습 컴포넌트(`v-model`, `v-if`, `ref/reactive`, `computed/watch`, `Props/Emits`, `Pinia`)를 한자리에서 라이트/다크 고대비 모드로 직접 실행 및 조작.

---

## 5. 설치 및 실행 가이드

### 1) 실행 환경
* **Node.js**: v20.19.0 이상 또는 v22.12.0 이상 권장
* **Vite**: v8.2.1

### 2) 환경변수 설정 (`.env`)
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 OpenWeatherMap API 키를 설정합니다.
```env
VITE_OPENWEATHER_API_KEY=d2b5a5dafabfd6672625a209f2f74423
```

### 3) 명령어
```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 기동 (http://localhost:5173)
npm run dev

# 3. 코드 품질 및 린트 검사 (0 warnings, 0 errors)
npm run lint

# 4. 프로덕션 정적 번들 빌드
npm run build
```

---

## 6. 프로젝트 디렉토리 구조

```text
skala-vue/
├── src/
│   ├── api/                  # OpenWeatherMap 4대 REST API 통신 모듈 (weatherApi.js)
│   ├── assets/               # 전역 토큰, 레이아웃, 컴포넌트, 실습 전용 CSS
│   │   ├── tokens.css        # 듀얼 테마 CSS 변수 (:root, data-theme)
│   │   ├── layout.css        # 32px CAD 그리드 및 Atmospheric Glow 레이아웃
│   │   ├── components.css    # Element Plus / Ant Design Vue 통합 다크/라이트 오버라이드
│   │   └── practice.css      # 기초 실습 컴포넌트 스타일
│   ├── components/
│   │   ├── handson/          # 실전 관제 컴포넌트 (WeatherCard, SearchBar, UnitToggler 등)
│   │   └── practices/        # 1~15단원 기초 실습 컴포넌트 아카이브
│   ├── composables/          # 커스텀 컴포저블 (useApi.js)
│   ├── data/                 # 6대 산단 메타데이터 및 과거 재해 이력 (incidentHistory.js)
│   ├── router/               # Vue Router 4 설정 (index.js)
│   ├── stores/               # Pinia 3중 전역 스토어 (weatherStore, configStore, alertStore)
│   ├── views/                # 라우트 뷰 페이지 (대시보드, 레이더, 안전수칙, 상세뷰, 아카이브, 실습장)
│   ├── App.vue               # 최상위 루트 컴포넌트 (스마트 테마 바인딩 & 네비게이션)
│   └── main.js               # 진입점 (Vue 인스턴스, Pinia, Router, UI 라이브러리 등록)
├── docs/                     # 기술 명세서 및 비전공자 가이드 문서
├── .env                      # 환경변수 (API Key 은닉)
├── package.json              # 패키지 의존성 명세
└── README.md                 # 프로젝트 통합 설명서
```

---
© 2026 SKALA Engineering. Vue.js 3 Production System.
