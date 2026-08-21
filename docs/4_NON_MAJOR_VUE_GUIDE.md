# 비전공자를 위한 Vue 3 엔지니어링 핵심 이론 총정리

> **참조 과정**: Vue.js 프론트엔드 엔지니어링 과정 (1~10단원)  
> **목적**: 전공자가 아닌 동료 및 입문 개발자도 Vue 3의 핵심 아키텍처와 디버깅 포인트를 직관적으로 이해할 수 있도록 실제 산업단지 관제 시스템의 동작 원리와 1:1로 매핑하여 정리한 가이드입니다.

---

## 1. 라우터(Router) vs 라우트(Route)의 결정적 차이

비전공자가 가장 많이 혼동하는 두 단어입니다. 둘은 이름은 비슷하지만 **'명령을 내리는 도구'**와 **'현재 상태를 읽는 도구'**라는 완전히 다른 역할을 합니다.

```
┌────────────────────────────────────────────────────────┐
│  Router (useRouter): 목적지를 바꾸는 "네비게이션 리모컨"   │  -> router.push('/radar')
│  Route  (useRoute):  현재 내 위치를 보는 "GPS 좌표 돋보기"  │  -> route.params.cityId
└────────────────────────────────────────────────────────┘
```

### 1) `router` (`useRouter()`) — "어디로 갈지 명령하는 리모컨"
* **역할**: 페이지를 다른 주소로 이동시키거나 뒤로 가기를 실행하는 **액션 도구**입니다.
* **비유**: 자동차의 **핸들** 또는 TV의 **채널 전환 리모컨**.
* **실전 사용 예시**:
```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// 버튼 클릭 시 전국 레이더 화면으로 이동
const goToRadar = () => {
  router.push('/radar')
}

// 특정 산단 상세 화면으로 파라미터를 담아 이동
const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
```

### 2) `route` (`useRoute()`) — "현재 내가 어디 있는지 읽는 돋보기"
* **역할**: 사용자가 지금 머물고 있는 현재 페이지의 **URL 정보(주소, 파라미터, 쿼리스트링)**를 읽어오는 **조회 도구**입니다. (직접 이동시키는 기능은 없음)
* **비유**: 현재 내 위치를 알려주는 **GPS 계측기** 또는 주소창을 확대해 보는 **돋보기**.
* **실전 사용 예시**:
```javascript
import { useRoute } from 'vue-router'

const route = useRoute()

// 1. URL 동적 파라미터 읽기 (예: /weather/city_01 -> "city_01")
const currentCityId = route.params.cityId

// 2. URL 쿼리스트링 읽기 (예: /?search=창원 -> "창원")
const currentKeyword = route.query.search

// 3. 현재 접속 경로 읽기 (예: "/alerts")
const currentPath = route.path
```

---

## 2. 컴포넌트(Component) vs 뷰(View)의 차이점

Vue 프로젝트의 `src/components/`와 `src/views/`는 둘 다 `.vue` 파일이지만, 건축에 비유하면 **'벽돌/가구'**와 **'완성된 방'**의 차이입니다.

| 구분 | 컴포넌트 (`src/components/`) | 뷰 (`src/views/`) |
| :--- | :--- | :--- |
| **비유** | 레고 블록, 의자, 전등, 검색창 (개별 부품) | 거실, 안방, 회의실 (완성된 공간) |
| **역할** | 독립적이고 어디서든 재사용 가능한 UI 조각 | 특정 URL 주소와 1:1로 매핑되는 최상위 화면 |
| **라우터 연결** | 라우터에 직접 등록하지 않고 뷰 안에서 조립됨 | `src/router/index.js`의 `routes`에 직접 등록됨 |
| **우리 프로젝트 예시** | `SearchBar.vue`, `WeatherCard.vue`, `UnitToggler.vue` | `WeatherHomeView.vue`, `WeatherRadarView.vue`, `WeatherDetailView.vue` |

### 동작 구조도
```
[사용자가 브라우저 주소창에 /weather/city_01 입력]
                           │
                           ▼
          src/router/index.js (라우터가 주소 감지)
                           │
                           ▼
          src/views/WeatherDetailView.vue (뷰 화면 로드)
             ├── <BaseDashboardCard> (컴포넌트 조립)
             ├── <UnitToggler> (컴포넌트 조립)
             └── <a-descriptions> / <a-timeline> (UI 라이브러리 부품 조립)
```

---

## 3. 부모-자식 간 데이터 전달 흐름: `props`와 `emits`

Vue 3 컴포넌트 통신의 절대 원칙은 **"단방향 데이터 흐름 (Top-Down Data Flow)"**입니다.  
데이터가 위아래로 제멋대로 흐르면 어디서 에러가 났는지 추적할 수 없기 때문에 규칙이 정해져 있습니다.

```
       부모 컴포넌트 (WeatherHomeView)
         │                    ▲
 [props] │ 데이터 전달         │ [emits] 이벤트 신호 발신
 (택배)  │ (:item="plant")    │ (@click-detail="handleJump")
         ▼                    │
       자식 컴포넌트 (WeatherCard)
```

### 1) `props` (부모 ➡️ 자식) — "부모가 자식에게 보내는 선물 택배"
* 부모가 자식에게 데이터를 내려보낼 때 사용합니다.
* **⚠️ 주의 (불변성 원칙)**: 자식은 전달받은 `props`를 **읽기 전용**으로만 써야 하며, 자식 내부에서 직접 값을 수정해서는 안 됩니다. (수정이 필요하면 부모에게 `emit`으로 요청해야 함)

```html
<!-- 부모: WeatherHomeView.vue -->
<template>
  <!-- 자식에게 plant 객체를 :item이라는 이름의 props로 전달 -->
  <WeatherCard :item="plant" />
</template>
```

```javascript
<!-- 자식: WeatherCard.vue -->
<script setup>
// 부모가 보낸 props를 정의하고 수신
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div>
    <h4>{{ item.name }}</h4>
    <p>기온: {{ item.temp }}℃</p>
  </div>
</template>
```

---

### 2) `emits` (자식 ➡️ 부모) — "자식이 부모에게 누르는 호출 벨"
* 자식 컴포넌트에서 버튼 클릭 같은 이벤트가 일어났을 때, 부모에게 **"이 작업 좀 처리해 주세요!"**라고 신호를 보내는 방식입니다.

```javascript
<!-- 자식: WeatherCard.vue -->
<script setup>
const props = defineProps({ item: Object })

// 1. 부모에게 보낼 커스텀 이벤트 이름 등록
const emit = defineEmits(['click-detail'])

const onButtonClick = () => {
  // 2. 부모에게 신호와 함께 데이터(item)를 실어서 발신
  emit('click-detail', props.item)
}
</script>

<template>
  <button @click="onButtonClick">상세보기 →</button>
</template>
```

```html
<!-- 부모: WeatherHomeView.vue -->
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

// 3. 자식이 올린 신호를 받아서 실제 화면 이동 실행
const handleDetailJump = (targetItem) => {
  router.push(`/weather/${targetItem.id}`)
}
</script>

<template>
  <!-- 자식의 @click-detail 신호를 감지하여 부모의 함수 실행 -->
  <WeatherCard :item="plant" @click-detail="handleDetailJump" />
</template>
```

---

## 4. 최상위와 최하위 간 데이터를 바로 보내는 방식 (Props Drilling 해결)

컴포넌트 구조가 깊어지면 (할아버지 ➡️ 아버지 ➡️ 아들 ➡️ 손자), 손자에게 데이터를 주기 위해 중간에 있는 아버지, 아들이 쓰지도 않는 props를 계속 전달해야 하는 **Props Drilling(프롭스 드릴링)** 문제가 발생합니다.

```
[Props Drilling 문제점]
할아버지 ────(props)────▶ 아버지 ────(props)────▶ 아들 ────(props)────▶ 손자 (실제 필요)
(중간 컴포넌트들이 불필요한 배달부가 됨 -> 유지보수 지옥)
```

이 문제를 해결하는 2가지 핵심 방식이 있습니다:

### 방법 1: `Provide / Inject` (Vue 내장 전파 시스템)
* **비유**: 최상위 부모가 **사내 방송**을 켜면, 중간 관리자를 거치지 않고 모든 하위 직원이 라디오로 바로 듣는 방식입니다.
* **사용처**: 테마(다크모드), 다국어 언어 설정 등 간단한 전역 값 전달.

```javascript
// 최상위 컴포넌트 (App.vue)
import { provide, ref } from 'vue'

const currentTheme = ref('dark')
provide('globalTheme', currentTheme) // 방송 송출
```

```javascript
// 5단계 아래 손자 컴포넌트 (DeepChild.vue)
import { inject } from 'vue'

const theme = inject('globalTheme') // 다이렉트 수신
```

---

### 방법 2: `Pinia Store` (전역 중앙 물류창고 — 엔터프라이즈 표준) ⭐
* **비유**: 컴포넌트 트리 바깥에 **'중앙 물류창고'**를 짓고, 할아버지든 손자든 필요한 컴포넌트가 직접 창고에 가서 물건을 꺼내오고 수정하는 방식입니다.
* **우리 프로젝트 적용**:
  * `useWeatherStore`: 전국 산단 기상 데이터, 예보, CRUD
  * `useConfigStore`: 섭씨/화씨 온도 단위 설정
  * `useAlertStore`: 기상 특보 위험 판정, SOP 체크리스트

```
┌────────────────────────────────────────────────────────┐
│                   Pinia 중앙 물류창고                    │
│   (useWeatherStore / useConfigStore / useAlertStore)   │
└────────────────────────────────────────────────────────┘
        ▲                                ▲
        │ (직접 접근)                     │ (직접 접근)
┌───────┴────────┐              ┌────────┴───────┐
│ 최상위 App.vue  │              │ 최하위 손자카드  │
└────────────────┘              └────────────────┘
```

#### Pinia 실전 코드 예시
```javascript
// 1. 스토어 정의: src/stores/configStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius') // 섭씨/화씨 상태

  function formatTemp(celsius) {
    if (unit.value === 'fahrenheit') {
      return `${Math.round((celsius * 9) / 5 + 32)} ℉`
    }
    return `${celsius} ℃`
  }

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, formatTemp, toggleUnit }
})
```

```html
<!-- 2. 어떤 깊이의 컴포넌트에서든 즉시 1줄로 호출하여 사용 -->
<script setup>
import { useConfigStore } from '@/stores/configStore'

// 중앙 창고에서 즉시 스토어 인스턴스 가져오기 (Props Drilling 0%)
const configStore = useConfigStore()
</script>

<template>
  <div>
    <!-- 어디서든 일관된 변환 결과 출력 -->
    <span>현재 온도: {{ configStore.formatTemp(25) }}</span>
    <button @click="configStore.toggleUnit">단위 변경</button>
  </div>
</template>
```

---

## 5. 비전공자를 위한 핵심 요약 마인드맵

1. **`router`**: 이동 명령 리모컨 (`router.push('/radar')`)
2. **`route`**: 현재 주소 정보 돋보기 (`route.params.cityId`)
3. **`Component`**: 재사용 가능한 레고 블록 (`SearchBar.vue`)
4. **`View`**: 주소창과 1:1 매칭되는 완성된 방 (`WeatherHomeView.vue`)
5. **`props`**: 부모가 자식에게 주는 선물 상자 (단방향, 수정 불가)
6. **`emits`**: 자식이 부모에게 누르는 알림 벨 (이벤트 발신)
7. **`Pinia`**: Props Drilling을 없애는 중앙 물류창고 (어디서나 즉시 접근)
