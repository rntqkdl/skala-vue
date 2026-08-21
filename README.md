# 스마트 팩토리 기상 리스크 관제 및 열변형 사전 예측 시스템 (skala-vue)

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

## 2. 시스템 아키텍처 및 디렉토리 구조

```text
src/
├── main.js                     # Pinia 및 라우터 인스턴스 전역 주입 (.use(createPinia()), .use(router))
├── App.vue                     # 공통 내비게이션 바, 단위 토글러(<UnitToggler />), 뷰포트 (<RouterView />)
├── router/
│   └── index.js                # 지연 로딩, 동적 라우트(/weather/:cityId), /radar, Catch-all 404
├── api/                        # Axios 비동기 통신 계층
│   └── weatherApi.js           # OpenWeatherMap 4대 API 공통 클라이언트 인스턴스
├── data/                       # 산업단지 도메인 데이터
│   └── incidentHistory.js      # 6대 국가산단 실제 기상 재해 이력 및 SOP 데이터베이스
├── stores/                     # Pinia 전역 상태 관리 모듈
│   ├── configStore.js          # 단위 설정(℃/℉) 및 localStorage 동기화
│   ├── weatherStore.js         # 실시간 기상 병렬 수신, 24시간 예보, 피크 예측 및 즐겨찾기 관리
│   ├── alertStore.js           # 산단 안전 특보, 위험도 자동 판정 및 현장 SOP 체크리스트
│   └── counter.js              # 기본 카운터 스토어 실습
├── components/
│   └── handson/                # 실습용 부품 컴포넌트 격리 폴더
│       ├── BaseDashboardCard.vue  # 슬롯 기반 공통 카드 래퍼
│       ├── SearchBar.vue          # 검색 입력 및 이벤트 송신
│       ├── WeatherCard.vue        # 개별 산단 지표, 즐겨찾기(⭐), 삭제(✕) 제어
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

---

## 3. 라우팅 명세 및 4대 핵심 화면 (Vue Router 4)

| URL 경로 | 뷰 컴포넌트 | 로딩 방식 | 주요 기능 |
|---|---|---|---|
| `/` | `WeatherHomeView.vue` | 직접 로딩 | 6대 산단 실시간 현황, 즐겨찾기 필터, 신규 산단 등록, 가상 스트레스 테스트 |
| `/radar` | `WeatherRadarView.vue` | 지연 로딩 | 실시간 기상 레이더 타일 맵(강우/기온/구름/풍속) 및 24시간 피크 열변형 예측 관제 |
| `/weather/:cityId` | `WeatherDetailView.vue` | 지연 로딩 | `:cityId` 기반 24시간 예보 타임라인, 실시간 대기질(AQI), 과거 재해 분석 및 SOP 체크리스트 |
| `/alerts` | `WeatherAlertView.vue` | 지연 로딩 | 실시간 기상 vs 과거 재해 임계치 대조 기반 산단별 위험도 및 표준 안전 매뉴얼 |
| `/about` | `WeatherAboutView.vue` | 지연 로딩 | 기상이변 설비 파손 메커니즘(포항, 텍사스, 창원, 여수) 및 아키텍처 소개 |
| `/:pathMatch(.*)*` | `NotFoundView.vue` | 지연 로딩 | 잘못된 URL 접근 시 404 안내 화면 출력 및 홈 복귀 유도 |

---

## 4. Pinia 전역 상태 관리 아키텍처 (과제 5)

컴포넌트 간 깊은 계층 구조(Props Drilling)를 탈피하고, 전역 상태 변경을 애플리케이션 전체에 즉각 동기화하기 위해 Pinia를 도입했습니다.

### 4.1 스토어 구조 및 역할 분리

| 스토어 | 관리 상태 (State) | 연산 및 액션 (Getters / Actions) | 주요 역할 |
|---|---|---|---|
| [`configStore.js`](src/stores/configStore.js) | `unit` (celsius / fahrenheit) | - `unitSymbol`: 단위 기호(℃/℉) 반환<br>- `formatTemp(temp)`: 1줄 단위 변환 및 기호 포맷팅<br>- `toggleUnit()`: 단위 전환 및 `localStorage` 자동 동기화 | 단위 체계 및 영속화 |
| [`weatherStore.js`](src/stores/weatherStore.js) | `complexes`, `favorites`, `isLoading`, `lastUpdated` | - `averageTemp`: 평균 기온<br>- `maxExpansionComplex`: 최고 열변형 산단<br>- `peakWarning`: 24시간 피크 최고 기온 예측<br>- `toggleFavorite(id)`: 즐겨찾기 토글 및 영속화<br>- `deleteComplex(id)`: 관제 산단 삭제<br>- `searchAndAddComplex()`: 신규 산단 Geocoding 등록 | 실시간 기상 및 예보 |
| [`alertStore.js`](src/stores/alertStore.js) | `checklistState` | - `dangerCount`: 긴급/주의 산단 개수 실시간 집계<br>- `evaluatedAlerts`: 위험도 자동 판정<br>- `getChecklistProgress`: 현장 SOP 진행률 | 안전 특보 및 관제 |
| [`counter.js`](src/stores/counter.js) | `count` | - `doubleCount`: 2배수 연산<br>- `increment()`: 1씩 증가 | 기본 카운터 실습 |

### 4.2 핵심 구현 특징

1. **상태 영속화 (State Persistence)**:
   * `watch(unit)` 및 `watch(favorites)`를 활용해 온도 단위와 즐겨찾기 산단 목록을 브라우저 `localStorage`에 자동 보관하여, 새로고침 후에도 설정이 유지됩니다.
2. **매개변수 지원 Getter (`formatTemp`)**:
   * 컴포넌트마다 화씨 변환 공식을 중복 작성하지 않고, `configStore.formatTemp(item.temp)` 한 줄로 변환값과 기호를 일괄 출력합니다.
3. **네비게이션 뱃지 실시간 동기화**:
   * `alertStore.dangerCount`를 상단 내비게이션 바의 `🚨 안전 수칙 (N)` 뱃지에 연결하여, 위험 산단 발생 시 실시간으로 사용자에게 알립니다.

---

## 5. Axios 실시간 비동기 연동 및 스마트 재해 예측 관제 아키텍처 (과제 6)

OpenWeatherMap 오픈 API 생태계와 6대 국가산업단지 실제 재해 데이터베이스를 결합하여 지능형 사전 예방 관제 시스템을 완성했습니다.

### 5.1 OpenWeatherMap 4대 핵심 API 연동 규격

1. **실시간 기상 계측 (`/weather`)**: 6대 국가산단 좌표 기준 실시간 기온, 체감 기온, 습도, 풍속, 기압 수신
2. **24시간 단기 예보 (`/forecast`)**: 3시간 단위 기온 변화 및 강수 확률 타임라인 렌더링
3. **실시간 대기오염 관제 (`/air_pollution`)**: 통합 대기질(AQI) 등급, 초미세먼지(PM2.5), 미세먼지(PM10) 분석
4. **실시간 기상 레이더 타일 (`/map`)**: 강우 레이더, 기온 열지도, 구름 위성, 풍속 타일 맵 오버레이
5. **Geocoding 좌표 변환 (`/geo/1.0/direct`)**: 도시명 검색을 통한 신규 산단 위경도 자동 획득 및 동적 관제 등록

### 5.2 산업 공학적 리스크 모델 및 실사례 DB

* **CNC 정밀 열변형 공식**: `열변형 오차(μm) = max(0, 현재기온 - 20℃) × 1.5 + 3.0`
* **6대 국가산단 실제 재해 DB**:
  1. **창원 국가산단**: 2022년 폭염 시 CNC 베드 열팽창(42μm)으로 방산 부품 전량 불량 (12억 원 손실)
  2. **울산 석유화학**: 2020년 집중호우 및 고습 지속으로 노출 배관 부식 셧다운 (48억 원 손실)
  3. **군산 국가산단**: 2023년 폭염기 유압 프레스 오일 과열(60℃↑)로 씰 파손 및 라인 중단 (6.5억 원 손실)
  4. **광주 첨단산단**: 2024년 고농도 미세먼지 유입 시 클린룸 필터 과부하 및 파티클 불량 (8.2억 원 손실)
  5. **포항 철강공단**: 2022년 태풍 힌남노 하천 범람 고로 3기 휴풍 및 모터 침수 (1조 원 손실)
  6. **여수 석유화학**: 하계 낙뢰 순간전압강하로 펌프 트립 및 긴급 플레어스택 방출 (1,000억 원 손실)
* **24시간 피크 사전 경보 엔진**: 향후 24시간 중 최고 기온 도달 시간을 예측하여 도달 1시간 30분 전 공조 예냉 조치를 사전에 권고하는 스마트 팩토리 관제 구현

---

## 6. 코드 품질 및 클린 코드 준수 기준

* **`im-not-ai` 한글 윤문 준수**: 기계적 번역투, 피동형 표현, AI 상투구를 배제하고 능동형 기술 문장으로 서술
* **중간점 완전 배제**: 저장소 전체에서 중간점 문자를 배제하고 하이픈(`-`), 슬래시(`/`), 쉼표(`,`) 사용
* **린트 및 빌드 무결성**: ESLint 및 oxlint 0 에러 유지, Vite 프로덕션 빌드 번들링 정상 완료
