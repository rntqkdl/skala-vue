# 스마트 팩토리 기상 리스크 관제 및 공정별 특화 예측 시스템 (skala-vue)

기상이변(폭염, 집중호우, 혹한, 낙뢰)이 산업 현장의 공작기계, 유압 설비, 연속 공정 플랜트에 미치는 물리적 손실을 선제 예방하기 위해 구축된 Vue 3 기반 스마트 관제 시스템입니다.

---

## 1. 개발 및 실행 환경

* **프레임워크**: Vue 3 (Composition API / `<script setup>`)
* **상태 관리**: Pinia (Setup Store 및 localStorage 영속화)
* **라우터**: Vue Router 4 (동적 라우팅 및 지연 로딩)
* **비동기 통신**: Axios (OpenWeatherMap API 연동)
* **빌드 도구**: Vite
* **개발 언어**: JavaScript (ES6+)

### 실행 명령어
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 린트 및 코드 스타일 검증
npm run lint

# 프로덕션 빌드 (지연 로딩 번들 분할 확인)
npm run build
```

---

## 2. 핵심 템플릿 디렉티브 및 반응성 분석 요약

### 1) 텍스트 바인딩 및 보안 (`v-text`, `v-html`)
* `v-text`는 텍스트를 안전하게 이스케이프하여 출력합니다.
* `v-html`은 마크업을 직접 파싱하지만 악성 스크립트 인라인 삽입 위험(XSS)이 있으므로 사용자 입력값에는 사용을 피하고 `{{ }}` 보간법을 우선합니다.

### 2) 조건부 렌더링 (`v-if` vs `v-show`)
* `v-if`는 조건이 거짓일 때 DOM에서 요소를 완전히 제거하므로 토글 빈도가 낮거나 초기 렌더링 비용을 아껴야 할 때 적합합니다.
* `v-show`는 `display: none`으로 화면 표시만 제어하므로 자주 켜고 꺼지는 UI 요소에 유리합니다.

### 3) 리스트 렌더링과 고유 키 (`v-for`, `:key`)
* 배열 순회 시 고유 ID(`:key="item.id"`)를 명시해야 가상 DOM이 변경 노드만 정확히 식별하여 불필요한 렌더링 연산을 방지합니다.

### 4) 감시자 분기 (`watch` vs `watchEffect`)
* `watch`는 특정 상태를 지정하여 이전 값과 현재 값을 비교할 때 사용합니다 (예: 검색창 쿼리스트링 URL 동기화, 즐겨찾기 변경 감지).
* `watchEffect`는 콜백 함수 내부에서 읽어 들인 반응형 변수를 자동 추적하여 즉각 반응할 때 사용합니다.

---

## 3. 컴포넌트(Components)와 뷰(Views)의 설계 분리

| 구분 | 컴포넌트 (`src/components/`) | 뷰 (`src/views/`) |
|---|---|---|
| **비유** | 레고 블록 (버튼, 카드, 입력창 등 개별 가구) | 완성된 방 (거실, 침실, 서재 등 완성된 독립 공간) |
| **역할** | 독립적이고 재사용 가능한 UI 부품 | 특정 URL 주소와 1:1로 매핑되는 최상위 페이지 단위 화면 |
| **라우터 연결** | 라우터에 직접 등록하지 않고 뷰 내부에 조립 | `src/router/index.js`의 `routes` 배열에 직접 매핑 |
| **코드 예시** | `WeatherCard.vue`, `SearchBar.vue`, `BaseDashboardCard.vue` | `WeatherHomeView.vue`, `WeatherRadarView.vue`, `WeatherDetailView.vue` |

---

## 4. Vue Router 아키텍처 분석: 왜 라우터와 뷰를 쓰는가?

### 4.1 라우터 없이 컴포넌트만 갈아 끼울 때 발생하는 한계
1. **주소창(URL) 고정**: 어떤 화면을 보더라도 브라우저 주소는 항상 `/`에 머물러 현재 위치를 식별할 수 없습니다.
2. **화면 공유 및 북마크 불가**: 특정 산업단지의 상세 정보를 다른 작업자에게 링크로 전달할 수 없습니다.
3. **브라우저 내비게이션(뒤로 가기 / 앞으로 가기) 오작동**: 상세 페이지에서 뒤로 가기를 누르면 이전 작업 화면이 아니라 직전 외부 사이트로 튕겨 나갑니다.
4. **새로고침(F5) 시 상태 초기화**: 화면을 새로고침하면 작업 중이던 위치를 잃어버리고 무조건 첫 화면으로 리셋됩니다.

### 4.2 해결책: Vue Router의 역할
Vue Router는 페이지 전체를 새로고침(Full Reload)하지 않는 SPA(Single Page Application)의 반응성을 유지하면서, 화면 상태를 브라우저 주소창(URL) 및 방문 기록(History API)과 실시간으로 연결합니다.

* **동적 세그먼트 (`:cityId`)**: 주소창의 파라미터로 데이터를 식별해 동일한 상세 뷰 템플릿에 각기 다른 지역 데이터를 바인딩합니다.
* **프로그래밍 방식 이동 (`useRouter`)**: `router.push('/weather/' + id)`를 실행해 사용자 인터랙션에 따라 유연하게 화면을 전환합니다.
* **쿼리스트링 동기화 (`useRoute`)**: 검색창 입력값을 URL 쿼리(`?search=`)에 실시간 반영하여 주소 복사만으로 동일한 검색 결과를 공유할 수 있습니다.

---

## 5. 시스템 아키텍처 및 디렉토리 구조

```text
src/
├── main.js                     # Pinia 및 라우터 인스턴스 전역 주입 (.use(createPinia()), .use(router))
├── App.vue                     # 공통 내비게이션 바, 단위 토글러(<UnitToggler />), 뷰포트 (<RouterView />)
├── router/
│   └── index.js                # 지연 로딩, 동적 라우트(/weather/:cityId), /radar, Catch-all 404
├── api/                        # Axios 비동기 통신 계층
│   └── weatherApi.js           # OpenWeatherMap 4대 API 공통 클라이언트 인스턴스
├── data/                       # 산업단지 도메인 데이터
│   └── incidentHistory.js      # 6대 국가산단 교육용 재해 시나리오 DB (Mock-up)
├── stores/                     # Pinia 전역 상태 관리 모듈
│   ├── configStore.js          # 단위 설정(℃/℉) 및 localStorage 동기화
│   ├── weatherStore.js         # 실시간 기상 병렬 수신, 공정별 특화 지표 연산, 즐겨찾기 관리
│   ├── alertStore.js           # 산단 안전 특보, 위험도 자동 판정 및 현장 SOP 체크리스트
│   └── counter.js              # 기본 카운터 스토어 실습
├── components/
│   └── handson/                # 실습용 부품 컴포넌트 격리 폴더
│       ├── BaseDashboardCard.vue  # 슬롯 기반 공통 카드 래퍼
│       ├── SearchBar.vue          # 검색 입력 및 이벤트 송신
│       ├── WeatherCard.vue        # 개별 산단 지표, 즐겨찾기(⭐), 삭제(🗑️) 제어
│       ├── ComplexRegisterCard.vue # 전국 산단 실시간 신규 등록 및 프리셋
│       └── UnitToggler.vue        # 단위 변환 제어 토글러
└── views/                      # URL 매핑 최상위 페이지 뷰
    ├── WeatherHomeView.vue     # 메인 대시보드 (실시간 현황, 즐겨찾기 필터, 시뮬레이터)
    ├── WeatherRadarView.vue    # 전국 기상 레이더 맵 타일 및 24시간 피크 예측 관제
    ├── WeatherDetailView.vue   # :cityId 동적 파라미터 수신 정밀 기상 및 SOP 체크리스트
    ├── WeatherAlertView.vue    # 산단 기상 특보 및 공정 안전 수칙 안내
    ├── WeatherAboutView.vue    # 시스템 아키텍처 및 재해 메커니즘 소개
    └── NotFoundView.vue        # 정의되지 않은 경로 접근 시 404 처리
```

### 5.1 라우팅 명세표

| URL 경로 | 뷰 컴포넌트 | 로딩 방식 | 주요 기능 |
|---|---|---|---|
| `/` | `WeatherHomeView.vue` | 직접 로딩 | 6대 산단 실시간 현황, 즐겨찾기 필터, 신규 산단 등록, 가상 스트레스 테스트 |
| `/radar` | `WeatherRadarView.vue` | 지연 로딩 | 실시간 기상 레이더 타일 맵(강우/기온/구름/풍속) 및 24시간 피크 열변형 예측 관제 |
| `/weather/:cityId` | `WeatherDetailView.vue` | 지연 로딩 | `:cityId` 기반 24시간 예보 타임라인, 실시간 대기질(AQI), 과거 재해 분석 및 SOP 체크리스트 |
| `/alerts` | `WeatherAlertView.vue` | 지연 로딩 | 실시간 기상 vs 과거 재해 임계치 대조 기반 산단별 위험도 및 표준 안전 매뉴얼 |
| `/about` | `WeatherAboutView.vue` | 지연 로딩 | 기상이변 설비 파손 메커니즘(포항, 텍사스, 창원, 여수) 및 아키텍처 소개 |
| `/:pathMatch(.*)*` | `NotFoundView.vue` | 지연 로딩 | 잘못된 URL 접근 시 404 안내 화면 출력 및 홈 복귀 유도 |

---

## 6. 성능 및 예외 처리 최적화 기법

### 6.1 라우터 지연 로딩 (Lazy Loading)
모든 뷰 컴포넌트를 처음에 한꺼번에 불러오면 초기 로딩 속도가 저하됩니다. 화살표 함수와 동적 임포트(`() => import('@/views/...')`)를 결합하여 사용자가 해당 URL을 방문하는 시점에만 필요한 자바스크립트 청크를 내려받도록 최적화했습니다.

### 6.2 미등록 경로 예외 처리 (Catch-all Route)
정의되지 않은 임의의 경로(예: `/unknown-path`)로 접근할 때 화면이 하얗게 멈추는 현상을 방지하기 위해 정규식 패턴(`path: '/:pathMatch(.*)*'`)을 라우트 목록 최하단에 배치하여 404 전용 안내 뷰(`NotFoundView.vue`)로 안전하게 연결했습니다.

---

## 7. Pinia 전역 상태 관리 아키텍처 (과제 5)

컴포넌트 간 깊은 계층 구조(Props Drilling)를 탈피하고, 전역 상태 변경을 애플리케이션 전체에 즉각 동기화하기 위해 Pinia를 도입했습니다.

### 7.1 스토어 구조 및 역할 분리

| 스토어 | 관리 상태 (State) | 연산 및 액션 (Getters / Actions) | 주요 역할 |
|---|---|---|---|
| [`configStore.js`](src/stores/configStore.js) | `unit` (celsius / fahrenheit) | - `unitSymbol`: 단위 기호(℃/℉) 반환<br>- `formatTemp(temp)`: 1줄 단위 변환 및 기호 포맷팅<br>- `toggleUnit()`: 단위 전환 및 `localStorage` 자동 동기화 | 단위 체계 및 영속화 |
| [`weatherStore.js`](src/stores/weatherStore.js) | `complexes`, `favorites`, `isLoading`, `lastUpdated` | - `averageTemp`: 평균 기온<br>- `maxExpansionComplex`: 최고 기온 산단<br>- `peakWarning`: 24시간 피크 최고 기온 예측<br>- `toggleFavorite(id)`: 즐겨찾기 토글 및 영속화<br>- `deleteComplex(id)`: 관제 산단 삭제<br>- `searchAndAddComplex()`: 신규 산단 Geocoding 등록 | 실시간 기상 및 예보 |
| [`alertStore.js`](src/stores/alertStore.js) | `checklistState` | - `dangerCount`: 긴급/주의 산단 개수 실시간 집계<br>- `evaluatedAlerts`: 위험도 자동 판정<br>- `getChecklistProgress`: 현장 SOP 진행률 | 안전 특보 및 관제 |
| [`counter.js`](src/stores/counter.js) | `count` | - `doubleCount`: 2배수 연산<br>- `increment()`: 1씩 증가 | 기본 카운터 실습 |

---

## 8. Axios 실시간 비동기 연동 및 공정별 위험 예측 아키텍처 (과제 6)

OpenWeatherMap 오픈 API 생태계와 6대 국가산업단지 교육용 목업(Mock-up) 데이터베이스를 결합하여 지능형 사전 예방 관제 시스템을 완성했습니다.

### 8.1 OpenWeatherMap 4대 핵심 API 연동 규격

1. **실시간 기상 계측 (`/weather`)**: 6대 국가산단 좌표 기준 실시간 기온, 체감 기온, 습도, 풍속, 기압 수신
2. **24시간 단기 예보 (`/forecast`)**: 3시간 단위 기온 변화 및 강수 확률 타임라인 렌더링
3. **실시간 대기오염 관제 (`/air_pollution`)**: 통합 대기질(AQI) 등급, 초미세먼지(PM2.5), 미세먼지(PM10) 분석
4. **실시간 기상 레이더 타일 (`/map`)**: 강우 레이더, 기온 열지도, 구름 위성, 풍속 타일 맵 오버레이
5. **Geocoding 좌표 변환 (`/geo/1.0/direct`)**: 도시명 검색을 통한 신규 산단 위경도 자동 획득 및 동적 관제 등록

### 8.2 공정별 특화 위험 지표 모델 (Process-Specific Metrics)

모든 산업단지에 일률적인 지표를 적용하지 않고, 각 공정 특성에 맞춘 전용 물리 지표를 산출합니다.

* **정밀 기계 및 방산 (창원)**: CNC 공작기계 열변형 오차 모델 (`열변형 = max(0, 기온 - 20℃) × 1.5 + 3.0 μm`)
* **원유 정제 및 석유화학 (울산/여수)**: 고습 지속 시 옥외 배관 염해 및 부식 위험도 (%), 낙뢰 시 송전선로 전압강하 트립 취약도
* **대형 프레스 및 특수강 (군산)**: 외기온 상승에 따른 작동유/유압유 과열 위험도 (℃)
* **반도체 패키징 (광주)**: 초미세먼지 유입 시 클린룸 HEPA 필터 차압 부하 (PM2.5 $\mu\text{g/m}^3$)
* **제철 및 열간압연 (포항)**: 집중호우 시 옥외 하천 범람 및 지하 모터실 침수/냉각 부하 지수 (%)

### 8.3 6대 국가산단 기상 재해 시나리오 데이터베이스 (교육 및 실습용 목업)

> [!NOTE]
> 본 데이터베이스의 사고 사례, 피해 규모 및 공정 수치는 실제 과거 산업 기상 재해 백서와 설비 고장 원인을 기반으로 재구성한 **교육 및 실습용 목업(Mock-up) 시나리오 데이터**입니다.

1. **창원 국가산단 (목업)**: 폭염 시 CNC 베드 열팽창(42μm)으로 방산 부품 전량 불량 모델 (12억 원)
2. **울산 석유화학 (목업)**: 집중호우 및 고습 지속으로 노출 배관 부식 셧다운 모델 (48억 원)
3. **군산 국가산단 (목업)**: 폭염기 유압 프레스 오일 과열(60℃↑)로 씰 파손 및 라인 중단 모델 (6.5억 원)
4. **광주 첨단산단 (목업)**: 고농도 미세먼지 유입 시 클린룸 필터 과부하 및 파티클 불량 모델 (8.2억 원)
5. **포항 철강공단 (목업)**: 태풍 힌남노 하천 범람 고로 3기 휴풍 및 모터 침수 모델 (1조 원)
6. **여수 석유화학 (목업)**: 하계 낙뢰 순간전압강하로 펌프 트립 및 긴급 플레어스택 방출 모델 (1,000억 원)
