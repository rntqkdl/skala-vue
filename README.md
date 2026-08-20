# SKALA Vue.js 실습 및 문법 분석 (skala-vue)

Vue 3 Composition API와 Vite 기반 템플릿 디렉티브 실습, 날씨 대시보드(WeatherMockup & WeatherComposition) 구현, 개발자도구 검증 및 트러블슈팅 기록입니다.

---

## 1. 개발 및 실행 환경

* **프레임워크**: Vue 3 (Composition API / `<script setup>`)
* **빌드 도구**: Vite
* **디버깅 도구**: `vite-plugin-vue-devtools`
* **개발 언어**: JavaScript (ES6+)

### 실행 명령어
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (기본 포트: 5173)
npm run dev

# 프로덕션 빌드 검증
npm run build
```

---

## 2. 핵심 디렉티브 동작 원리 및 분석

### ① 텍스트 바인딩 및 XSS 보안 (`v-text`, `v-html`, `SampleXss.vue`)
* **`v-text`**: 엘리먼트의 `innerText`를 업데이트합니다. 텍스트 내부의 HTML 태그는 일반 문자열로 이스케이프 처리됩니다.
* **`v-html`**: 엘리먼트의 `innerHTML`을 업데이트합니다. 문자열로 작성된 HTML 마크업을 실제 DOM 엘리먼트로 파싱하여 렌더링합니다.
* **보안 관점**:
  * `v-html`은 가상 DOM(Virtual DOM)을 거치지 않고 직접 DOM을 조작하므로 XSS(Cross-Site Scripting) 취약점에 노출될 수 있습니다.
  * 브라우저는 `innerHTML`로 주입된 `<script>` 태그의 직접 실행은 차단하지만, `<img src="x" onerror="alert(1)">`와 같은 인라인 이벤트 핸들러는 그대로 실행됩니다.
  * 신뢰할 수 없는 사용자 입력값에는 `v-html`을 배제하고 텍스트 보간법(`{{ }}`)이나 `v-text`를 사용하는 것이 안전합니다.

### ② 속성 바인딩 (`v-bind`, `:class`, `:style`, `SampleVbindhigh.vue`)
* 단축 문법인 콜론(`:`)을 사용하여 HTML 속성에 JavaScript 반응형 데이터를 연결합니다.
* 클래스 바인딩 시 객체 문법(`:class="{ active: isActive, 'text-danger': hasError }"`)을 사용하여 boolean 상태값에 따라 클래스를 토글합니다.
* 스타일 바인딩 시 CSS 속성명을 camelCase 또는 kebab-case 문자열로 객체화하여 인라인 스타일을 제어합니다.

### ③ 조건부 렌더링 비교 (`v-if` vs `v-show`, `SampleVif.vue`, `SampleVshow.vue`)
* **`v-if` (조건부 렌더링)**:
  * 조건이 false일 때 엘리먼트를 실제 DOM 트리에서 제거하고 주석 노드(`<!---->`)로 대체합니다.
  * 초기 조건이 false이면 아무것도 렌더링하지 않으므로 초기 렌더링 비용이 낮습니다.
* **`v-show` (조건부 표시)**:
  * 조건 여부와 상관없이 항상 DOM 트리에 요소를 생성하여 렌더링합니다.
  * 조건이 false일 때는 CSS 인라인 스타일 `display: none;`을 적용하여 화면에서만 숨깁니다.
* **선택 기준**:
  * 상태가 자주 바뀌는 토글 요소는 DOM 생성 및 파괴 비용이 들지 않는 `v-show`가 적합합니다.
  * 런타임 중에 조건이 거의 바뀌지 않거나 권한별 화면 분기처럼 초기 조건이 거짓일 확률이 높은 경우 `v-if`가 적합합니다.

### ④ 리스트 렌더링 및 키 바인딩 (`v-for`, `:key`, `SampleVfor.vue`)
* `v-for="(item, index) in items" :key="item.id"` 문법으로 배열이나 객체를 순회하여 복수의 엘리먼트를 렌더링합니다.
* **`:key` 속성의 역할**:
  * Vue의 가상 DOM Diffing 알고리즘에서 각 노드를 구별하는 고유 식별자 역할을 합니다.
  * `:key`를 생략하거나 단순 `index`를 바인딩할 경우, 항목 추가, 삭제, 정렬 시 노드를 올바르게 추적하지 못해 폼 입력 상태가 엉뚱한 행에 남아있는 상태 불일치 문제가 생길 수 있습니다.
  * 고유한 데이터 ID(`item.id`)를 key로 지정해야 변경된 요소만 정확하게 재사용 및 패치됩니다.

### ⑤ 렌더링 제어 디렉티브 (`v-pre`, `v-once`, `v-memo`, `v-cloak`)
* **`v-pre`**: 해당 엘리먼트와 자식 엘리먼트의 컴파일을 건너뛰고 머스태시 태그(`{{ }}`)를 원본 텍스트 그대로 표시합니다.
* **`v-once`**: 엘리먼트와 컴포넌트를 단 한 번만 렌더링하고 이후의 반응형 데이터 변경을 감지하지 않는 정적 캐시로 처리합니다.
* **`v-memo`**: 지정한 의존성 배열(`v-memo="[item.id, item.updatedAt]"`)의 값이 변경되었을 때만 해당 영역을 다시 렌더링합니다.
* **`v-cloak`**: 컴파일이 완료될 때까지 엘리먼트에 남아있으며, CSS `[v-cloak] { display: none; }`과 함께 사용하여 초기 로딩 시 컴파일되지 않은 머스태시 텍스트가 노출되는 현상을 방지합니다.

### ⑥ 이벤트 핸들링 및 수식어 (`v-on` / `@`, `$event`, `VueEventModifier.vue`)
* `@click`, `@input` 등 단축 문법을 사용하여 DOM 이벤트를 수신하고 메서드나 인라인 표현식을 실행합니다.
* **이벤트 수식어**:
  * `.prevent`: `event.preventDefault()`를 호출하여 기본 동작(form 제출 후 페이지 이동, a 링크 이동 등)을 차단합니다.
  * `.stop`: `event.stopPropagation()`을 호출하여 이벤트 캡처링 및 버블링 전파를 중단합니다.
  * `.once`: 이벤트를 단 한 번만 실행합니다.
  * 수식어를 사용함으로써 JavaScript 함수 내부에서 DOM 이벤트 제어 로직을 분리하고 데이터 처리에 집중할 수 있습니다.

### ⑦ 양방향 데이터 바인딩 (`v-model`, `VueFormDataBinding.vue`)
* 폼 요소(input, select, textarea)에서 사용자 입력값과 반응형 상태(`ref`)를 양방향으로 동기화합니다.
* **수식어 활용**:
  * `.lazy`: `input` 이벤트 대신 `change` 이벤트(포커스를 잃거나 Enter를 칠 때)로 동기화 시점을 지연시킵니다.
  * `.number`: 입력된 문자열을 `parseFloat()`를 통해 자동으로 숫자(Number) 타입으로 형변환합니다.
  * `.trim`: 사용자가 입력한 문자열의 앞뒤 공백을 자동으로 제거합니다.

---

## 3. 핸즈온 실습: 날씨 및 공정 대시보드

### 3.1 템플릿 문법 중심 기초 실습 ([`WeatherMockup.vue`](src/components/handson/WeatherMockup.vue))
1. **배열 렌더링 (`v-for` & `:key`)**:
   * 도시별 날씨 데이터(`weatherList`) 배열을 순회하여 카드를 반복 출력하고 `:key="item.id"`를 연결했습니다.
2. **다중 조건부 렌더링 (`v-if`, `v-else-if`, `v-else`)**:
   * 기온별 3단계 뱃지(25도 이상 더움, 20~24도 따뜻함, 20도 미만 선선함)를 분기 처리했습니다.
3. **한글(IME) 실시간 입력 처리 (`:value` & `@input`)**:
   * 한글 입력 시 한 박자 늦게 반영되는 `v-model`의 특성을 보완하기 위해 단방향 값 바인딩과 입력 이벤트 리스너를 조합했습니다.
4. **이벤트 핸들링 및 버블링 차단 (`@click` & `@click.stop`)**:
   * 날씨 카드 클릭 시 하단 상태바에 선택된 도시명을 표기하고, 카드 내부 [상세보기] 버튼 클릭 시 부모 카드의 클릭 이벤트가 함께 실행되지 않도록 `@click.stop`으로 전파를 차단했습니다.
5. **검색 필터링 (`computed`)**:
   * 검색창에 입력한 도시명(`searchQuery`)이 포함된 데이터만 카드 목록에 필터링되도록 계산된 속성을 적용했습니다.

---

### 3.2 Composition API & 기계공학 도메인 심화 실습 ([`WeatherComposition.vue`](src/components/handson/WeatherComposition.vue))

기본 날씨 대시보드에서 나아가 **기계공학 도메인**을 접목하여, 기상 변화가 금속 정밀 가공 및 공장에 미치는 영향을 모니터링하는 대시보드로 구성했습니다.

#### 1) 도메인 데이터 모델링
* 주요 산업단지(창원 정밀기계, 울산 중공업, 군산 기계가공, 광주 부품가공) 데이터를 구축했습니다.
* 가공품 부식 위험도를 나타내는 **습도(`humidity`, %)**와 금속 열팽창 변위를 나타내는 **열변형 오차량(`expansionRate`, μm)** 속성을 정의했습니다.

#### 2) `computed` 기반 집계 및 통계 연산
* **검색 필터링 (`filteredWeatherList`)**: 검색창 입력어에 따라 산단 목록을 필터링합니다.
* **전체 산단 평균 기온 (`avgTemp`)**: `for ... of` 루프를 활용하여 전체 공장의 평균 외기온도를 계산하고 정수로 반올림 표기합니다.
* **최대 열변형 위험 산단 (`maxExpansionRate`)**: 배열을 순회하여 열변형 오차가 가장 큰 지역을 찾습니다.

#### 3) `watch` vs `watchEffect` 감시 로직 구축
* **`watch(selectedCityInfo, ...)`**: 마우스 클릭으로 공정 카드를 선택할 때마다 **이전 상태(`oldVal`)와 현재 상태(`newVal`)**를 비교하여 콘솔에 기록합니다.
* **`watchEffect(...)`**: 사용자가 검색창에 키보드를 입력할 때마다 내부에서 참조한 `searchQuery.value`를 **자동 감지하여 콘솔에 출력**합니다.

#### 4) 조건부 렌더링 및 스타일 클래스 분리
* **검색 결과 없음 분기 (`v-if` / `v-else`)**: 검색어와 일치하는 데이터가 없을 때 카드가 사라지는 대신 안내 바(`.status-bar.empty-bar`)를 표출합니다.
* **인라인 스타일 분리**: 템플릿의 `style="..."` 속성을 `.summary-bar`와 `.empty-bar` 클래스로 분리해 코드 가독성과 유지보수성을 높였습니다.

```vue
<!-- 공정 모니터링 통계 요약 바 -->
<div class="status-bar summary-bar">
  평균 기온: {{ avgTemp }}°C | 최고 열변형 위험 지역:
  {{ maxExpansionRate ? maxExpansionRate.name : '없음' }} (+{{
    maxExpansionRate ? maxExpansionRate.expansionRate : 0
  }}μm)
</div>

<!-- 검색 결과 유무에 따른 조건부 렌더링 -->
<div v-if="filteredWeatherList.length > 0">
  <div v-for="item in filteredWeatherList" :key="item.id" class="weather-card" ...>
    <h4>{{ item.name }} ({{ item.status }})</h4>
    <p>현재 기온: {{ item.temp }}°C</p>
    <p>공정 습도: {{ item.humidity }}%</p>
    <p>열변형 오차: +{{ item.expansionRate }}μm</p>
    <button class="btn-detail" @click.stop="showDetail(item.name, item.status, item.humidity, item.expansionRate)">
      상세보기
    </button>
  </div>
</div>
<div v-else class="status-bar empty-bar">
  일치하는 산업단지가 없습니다.
</div>
```

---

## 4. 개발자도구를 활용한 상태 및 DOM 검증

### ① `vite-plugin-vue-devtools`를 통한 컴포넌트 추적
* 브라우저 화면 하단의 DevTools 플로팅 버튼을 통해 활성화하며, 화면의 UI 요소를 클릭하면 에디터의 해당 `.vue` 소스 코드 위치로 바로 이동하는 Component Inspector 기능을 확인했습니다.

### ② Chrome DevTools Elements 탭을 통한 렌더링 차이 검증
* **`v-if="false"` 검증**: Elements 패널에서 해당 태그가 DOM 트리에서 삭제되고 `<!---->` 주석 노드만 남아있는 것을 확인했습니다.
* **`v-show="false"` 검증**: DOM 트리에 엘리먼트가 유지되며, 인라인 스타일로 `style="display: none;"` 속성이 동적으로 추가되는 것을 확인했습니다.

### ③ Vue DevTools Components 탭을 통한 반응형 상태 조작
* Components 패널에서 `weatherList`의 기온 값이나 `searchQuery`의 문자열을 수동으로 변경했을 때, 연관된 템플릿의 조건 분기 뱃지와 필터링 목록이 재계산되어 화면에 반영되는 반응형 동작을 확인했습니다.

---

## 5. 트러블슈팅 일지 (Troubleshooting Log)

### [Case 1] Import 식별자명과 템플릿 태그명 불일치 에러
* **발생 상황**: `<script setup>`에서는 `VueonEventHandler`로 임포트했으나, `<template>` 내부에서 관습적으로 `Sample` 접두사를 붙여 `<SampleVueonEventHandler />`로 호출함.
* **에러 메시지**:
  ```text
  'VueonEventHandler' is defined but never used. (vue/no-unused-components)
  ```
* **원인 및 해결**: Vue 3 `<script setup>` 문법에서는 임포트된 변수명이 템플릿에서 컴포넌트 태그명으로 1:1 매핑됩니다. 템플릿 태그를 `<VueonEventHandler />`로 수정하여 임포트 식별자명과 일치시켰습니다.

### [Case 2] 누락된 CSS 에셋 참조로 인한 PostCSS 번들링 실패
* **발생 상황**: 컴포넌트에서 `@import '@/assets/challenge.css';`를 호출했으나 해당 파일이 에셋 디렉터리에 존재하지 않음.
* **에러 메시지**:
  ```text
  [plugin:vite:css] [postcss] ENOENT: no such file or directory, open '.../src/assets/challenge.css'
  ```
* **원인 및 해결**: 실습용 공통 스타일시트(`practice.css`, `exercise.css`)를 동기화하고, 이를 통합 참조하는 `challenge.css`를 생성하여 빌드 에러를 해결했습니다.

### [Case 3] 한글 입력창의 `v-model` 중복 및 템플릿 `.value` 오사용
* **발생 상황**: 한글 실시간 검색 인풋창에 `v-model="searchQuery"`와 `@input="(e) => { searchQuery.value = e.target.value }"`를 중복 적용함.
* **원인 및 해결**: 템플릿 내부에서는 `ref` 변수가 자동으로 언래핑(Unwrap)되므로 `.value`를 붙이지 않습니다. 또한 한글 조합 문자 실시간 입력을 위해 `v-model`을 제거하고 `:value="searchQuery" @input="(e) => (searchQuery = e.target.value)"`로 분리하여 해결했습니다.

### [Case 4] 커스텀 뱃지 클래스(`.warm`) 스타일 누락 및 조건문 텍스트 불일치
* **발생 상황**: 20~24도 구간 뱃지(`class="badge warm"`)의 배경색이 투명하게 나오고, 하단 `v-else` 텍스트가 "22도 미만"으로 잘못 적힘.
* **원인 및 해결**: 컴포넌트 `<style>` 블록에 `.badge.warm { background-color: #f39c12; }` 스타일을 정의하고, `v-else` 텍스트를 "20도 미만"으로 수정하여 조건 범위와 UI 표기를 일치시켰습니다.

### [Case 5] `.stop` 수식어 제거 시 버블링이 발생하지 않는 것처럼 느껴진 착시 현상
* **발생 상황**: 카드 내부의 [상세보기] 버튼에서 `@click.stop`을 제거했음에도 하단 상태바의 텍스트가 변하지 않아 이벤트 버블링이 차단된 것처럼 오인함.
* **원인 및 검증**:
  1. 이미 선택된 카드와 동일한 카드의 [상세보기]를 눌러 동일한 텍스트로 덮어써졌기 때문에 시각적 변화가 없었음.
  2. `window.alert()` 모달이 브라우저 렌더링 스레드를 일시 정지시켰음.
  3. `watch(selectedCityInfo, ...)` 콘솔 감시기를 통해, 다른 도시 카드의 버튼을 클릭했을 때 부모 카드의 클릭 이벤트가 트리거되어 상태바와 콘솔 로그가 변경되는 것을 확인했습니다.

### [Case 6] 데이터 객체 내 단위 문자열(`%`, `μm`) 포함으로 인한 크기 비교 논리 오류
* **발생 상황**: `expansionRate: '11.2μm'`, `expansionRate: '4.5μm'`와 같이 문자열로 데이터를 선언한 뒤 `>` 크기 비교를 수행함.
* **원인 및 해결**: 자바스크립트 문자열 비교 시 사전식(ASCII) 순서로 인해 `'4.5μm' > '11.2μm'`가 참(True)으로 판정되는 논리 오류가 발생함. 데이터 원본은 순수 숫자(`11.2`, `4.5`)로 저장하고, 화면 템플릿 출력 시에만 단위(`μm`, `%`)를 덧붙이도록 수정했습니다.

---

## 6. 결론 및 학습 요약

* **선언적 렌더링(Declarative Rendering)**:
  * 바닐라 자바스크립트의 직접적인 DOM 제어 방식과 달리, 데이터 상태(State)를 변경하면 Vue의 반응형 엔진이 가상 DOM을 통해 필요한 최소한의 실제 DOM만 갱신하는 방식을 확인했습니다.
* **한글(조합 문자) 입력 처리의 이해**:
  * 영어와 달리 한글/한자는 자음과 모음이 합쳐지는 IME 조합 단계가 존재하므로, 실시간 검색창에서는 `v-model` 대신 `:value` + `@input` 조합이 필요함을 확인했습니다.
* **`watch` vs `watchEffect`의 구분**:
  * **마우스 클릭 (`watch`)**: 특정 대상(`selectedCityInfo`)을 지정하여 감시하며, 이전 상태(`oldVal`)와 새 상태(`newVal`)를 비교할 때 적합합니다.
  * **키보드 타이핑 (`watchEffect`)**: 검색창(`searchQuery`)에 글자를 입력할 때처럼 코드 내부에서 사용된 반응형 변수를 자동 감지해 반응할 때 적합합니다.
* **이벤트 전파 제어 및 데이터 모델링의 중요성**:
  * 카드형 UI 내부의 액션 버튼에는 `@click.stop`을 지정하여 의도치 않은 부모 이벤트 트리거를 방지해야 하며, 데이터는 순수 수치로 관리하고 단위 표기는 뷰(View) 영역으로 분리해야 계산 오류를 방지할 수 있음을 확인했습니다.
