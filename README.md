# SKALA Vue.js 실습 및 라우터 아키텍처 분석 (skala-vue)

Vue 3 Composition API 문법 실습부터 Vue Router 기반의 산업단지 기상 및 공정 모니터링 시스템 구축까지의 과정을 정리한 기술 문서입니다.

---

## 1. 개발 및 실행 환경

* **프레임워크**: Vue 3 (Composition API / `<script setup>`)
* **상태 관리**: Pinia
* **라우터**: Vue Router 4
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

## 2. Vue Router 아키텍처 분석: 왜 라우터와 뷰를 쓰는가?

### 2.1 라우터 없이 컴포넌트만 갈아 끼울 때 발생하는 한계

단일 파일 컴포넌트(SFC) 구조에서 `v-if`나 탭 전환만으로 화면을 구성하면 네 가지 문제가 발생합니다.

1. **주소창(URL) 고정**: 어떤 화면을 보더라도 브라우저 주소는 항상 `/`에 머물러 현재 위치를 식별할 수 없습니다.
2. **화면 공유 및 북마크 불가**: 특정 산업단지(예: 군산 위험 경보 화면)의 상세 정보를 다른 작업자에게 링크로 전달할 수 없습니다.
3. **브라우저 내비게이션(뒤로 가기 / 앞으로 가기) 오작동**: 상세 페이지에서 뒤로 가기를 누르면 이전 작업 화면이 아니라 브라우저의 직전 외부 사이트로 튕겨 나갑니다.
4. **새로고침(F5) 시 상태 초기화**: 화면을 새로고침하면 작업 중이던 위치를 잃어버리고 무조건 첫 화면으로 리셋됩니다.

### 2.2 해결책: Vue Router의 역할

Vue Router는 페이지 전체를 새로고침(Full Reload)하지 않는 SPA(Single Page Application)의 반응성을 유지하면서, 화면 상태를 브라우저 주소창(URL) 및 방문 기록(History API)과 실시간으로 연결합니다.

* **동적 세그먼트 (`:cityId`)**: 주소창의 파라미터로 데이터를 식별해 동일한 상세 뷰 템플릿에 각기 다른 지역 데이터를 바인딩합니다.
* **프로그래밍 방식 이동 (`useRouter`)**: `router.push('/weather/' + id)`를 실행해 사용자 인터랙션에 따라 유연하게 화면을 전환합니다.
* **쿼리스트링 동기화 (`useRoute`)**: 검색창 입력값을 URL 쿼리(`?search=`)에 실시간 반영하여 주소 복사만으로 동일한 검색 결과를 공유할 수 있습니다.

---

## 3. 컴포넌트(Components)와 뷰(Views)의 설계 분리

| 구분 | 컴포넌트 (`src/components/`) | 뷰 (`src/views/`) |
|---|---|---|
| **비유** | 레고 블록 (의자, 책상, 조명 등 개별 가구) | 완성된 방 (거실, 침실, 서재 등 완성된 공간) |
| **역할** | 독립적이고 재사용 가능한 UI 부품 | 특정 URL 주소와 1:1로 매핑되는 최상위 페이지 단위 화면 |
| **라우터 연결** | 라우터에 직접 등록하지 않고 뷰 내부에 조립 | `src/router/index.js`의 `routes` 배열에 직접 매핑 |
| **코드 예시** | `SearchBar.vue`, `WeatherCard.vue`, `BaseDashboardCard.vue` | `WeatherHomeView.vue`, `WeatherDetailView.vue`, `WeatherAlertView.vue` |

---

## 4. 라우팅 테이블 및 화면 구성

```text
src/
├── main.js                     # Pinia 및 라우터 인스턴스 전역 주입 (.use(createPinia()), .use(router))
├── App.vue                     # 공통 내비게이션 바, 단위 토글러(<UnitToggler />), 뷰포트 (<RouterView />)
├── router/
│   └── index.js                # 지연 로딩, 동적 라우트, Catch-all 404 규칙 정의
├── stores/                     # Pinia 전역 상태 관리 모듈
│   ├── configStore.js          # 단위 설정(℃/℉) 및 localStorage 동기화
│   ├── alertStore.js           # 산단 안전 특보 및 위험 카운트 관리
│   └── counter.js              # 기본 카운터 스토어 실습
├── components/
│   └── handson/                # 실습용 부품 컴포넌트 격리 폴더
│       ├── BaseDashboardCard.vue  # 슬롯 기반 공통 카드 래퍼
│       ├── SearchBar.vue          # 검색 입력 및 이벤트 송신
│       ├── WeatherCard.vue        # 개별 산단 지표 및 상세 이동 트리거
│       └── UnitToggler.vue        # 단위 변환 제어 토글러
└── views/                      # URL 매핑 최상위 페이지 뷰
    ├── WeatherHomeView.vue     # 메인 대시보드 (기존 WeatherParent 대체)
    ├── WeatherDetailView.vue   # :cityId 동적 파라미터 수신 상세 페이지
    ├── WeatherAlertView.vue    # 산단 기상 특보 및 공정 안전 수칙 안내 (추가 뷰)
    ├── WeatherAboutView.vue    # 시스템 아키텍처 소개 정적 페이지
    └── NotFoundView.vue        # 정의되지 않은 경로 접근 시 404 처리
```

### 4.1 라우트 명세

| URL 경로 | 뷰 컴포넌트 | 로딩 방식 | 주요 기능 |
|---|---|---|---|
| `/` | `WeatherHomeView.vue` | 직접 로딩 | 산단 목록 조회, 실시간 검색 필터링, 평균 기온 및 최고 열변형 산단 요약 |
| `/weather/:cityId` | `WeatherDetailView.vue` | 지연 로딩 | `route.params.cityId` 기반 상세 공정 스펙 및 실시간 환경 지표 표출 |
| `/alerts` | `WeatherAlertView.vue` | 지연 로딩 | 고온, 고습, 정상 구역별 공정 안전 대응 매뉴얼 및 산단 바로가기 |
| `/about` | `WeatherAboutView.vue` | 지연 로딩 | 시스템 구조 안내 및 메인 복귀 버튼 |
| `/:pathMatch(.*)*` | `NotFoundView.vue` | 지연 로딩 | 잘못된 URL 접근 시 404 안내 화면 출력 및 홈 복귀 유도 |

---

## 5. 성능 및 예외 처리 최적화 기법

### 5.1 라우터 지연 로딩 (Lazy Loading)

모든 뷰 컴포넌트를 처음에 한꺼번에 불러오면 초기 로딩 속도가 저하됩니다. 화살표 함수와 동적 임포트(`() => import('@/views/...')`)를 결합하여 사용자가 해당 URL을 방문하는 시점에만 필요한 자바스크립트 청크를 내려받도록 최적화했습니다.

### 5.2 미등록 경로 예외 처리 (Catch-all Route)

정의되지 않은 임의의 경로(예: `/unknown-path`)로 접근할 때 화면이 하얗게 멈추는 현상을 방지하기 위해 정규식 패턴(`path: '/:pathMatch(.*)*'`)을 라우트 목록 최하단에 배치하여 404 전용 안내 뷰(`NotFoundView.vue`)로 안전하게 연결했습니다.

---

## 6. 핵심 템플릿 디렉티브 분석 요약

### 1) 텍스트 바인딩 및 보안 (`v-text`, `v-html`)
* `v-text`는 텍스트를 안전하게 이스케이프하여 출력합니다.
* `v-html`은 마크업을 직접 파싱하지만 악성 스크립트 인라인 삽입 위험(XSS)이 있으므로 사용자 입력값에는 사용을 피하고 `{{ }}` 보간법을 우선합니다.

### 2) 조건부 렌더링 (`v-if` vs `v-show`)
* `v-if`는 조건이 거짓일 때 DOM에서 요소를 완전히 제거하므로 토글 빈도가 낮거나 초기 렌더링 비용을 아껴야 할 때 적합합니다.
* `v-show`는 `display: none`으로 화면 표시만 제어하므로 자주 켜고 꺼지는 UI 요소에 유리합니다.

### 3) 리스트 렌더링과 고유 키 (`v-for`, `:key`)
* 배열 순회 시 고유 ID(`:key="item.id"`)를 명시해야 가상 DOM이 변경 노드만 정확히 식별하여 불필요한 렌더링 연산을 방지합니다.

### 4) 감시자 분기 (`watch` vs `watchEffect`)
* `watch`는 특정 상태를 지정하여 이전 값과 현재 값을 비교할 때 사용합니다 (예: 카드 클릭 시 상태 바 변경 기록).
* `watchEffect`는 콜백 함수 내부에서 읽어 들인 반응형 변수를 자동 추적하여 즉각 반응할 때 사용합니다 (예: 검색어 입력 시 필터링 로그 출력).

---

## 7. Pinia 전역 상태 관리 아키텍처 (과제 5)

컴포넌트 간 깊은 계층 구조(Props Drilling)를 탈피하고, 전역 상태 변경을 애플리케이션 전체에 즉각 동기화하기 위해 Pinia를 도입했습니다.

### 7.1 스토어 구조 및 역할 분리

| 스토어 | 관리 상태 (State) | 연산 및 액션 (Getters / Actions) | 주요 역할 |
|---|---|---|---|
| [`configStore.js`](src/stores/configStore.js) | `unit` (celsius / fahrenheit) | • `unitSymbol`: 단위 기호(℃/℉) 반환<br>• `formatTemp(temp)`: 1줄 단위 변환 및 기호 포맷팅<br>• `toggleUnit()`: 단위 전환 및 `localStorage` 자동 동기화 | 단위 체계 및 영속화 |
| [`alertStore.js`](src/stores/alertStore.js) | `alertGuidelines` (산단별 특보 데이터) | • `dangerCount`: 긴급/주의 산단 개수 실시간 집계<br>• `dangerList`: 경보 대상 산단 목록 필터링<br>• `getAlertByCityId`: 특정 산단 조회 | 안전 특보 및 관제 |
| [`counter.js`](src/stores/counter.js) | `count` | • `doubleCount`: 2배수 연산<br>• `increment()`: 1씩 증가 | 기본 카운터 실습 |

### 7.2 핵심 구현 특징

1. **상태 영속화 (State Persistence)**:
   * `watch(unit)`를 활용해 사용자가 변경한 온도 단위 설정을 브라우저 `localStorage`에 자동 보관하여, 새로고침 후에도 설정이 유지됩니다.
2. **매개변수 지원 Getter (`formatTemp`)**:
   * 컴포넌트마다 화씨 변환 공식을 중복 작성하지 않고, `configStore.formatTemp(item.temp)` 한 줄로 변환값과 기호를 일괄 출력합니다.
3. **네비게이션 뱃지 실시간 동기화**:
   * `alertStore.dangerCount`를 상단 내비게이션 바의 `🚨 안전 수칙 (N)` 뱃지에 연결하여, 위험 산단 발생 시 실시간으로 사용자에게 알립니다.
