# SKALA Vue.js 실습 및 문법 분석 (skala-vue)

Vue 3 Composition API와 Vite 기반 템플릿 디렉티브 실습, 동작 원리 분석, 개발자도구 검증 및 트러블슈팅 기록입니다.

---

## 1. 개발 및 실행 환경

* **프레임워크**: Vue 3 (Composition API / `<script setup>`)
* **빌드 도구**: Vite
* **디버깅 플러그인**: `vite-plugin-vue-devtools`
* **개발 언어**: JavaScript (ES6+)

### 실행 명령어
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드 검증
npm run build
```

---

## 2. 디렉티브별 동작 원리 및 분석

### ① 텍스트 바인딩 및 XSS 보안 (`v-text`, `v-html`, `SampleXss.vue`)
* **동작 원리**:
  * `v-text`: 엘리먼트의 `innerText`를 업데이트합니다. 텍스트 내부의 HTML 태그는 일반 문자열로 이스케이프 처리됩니다.
  * `v-html`: 엘리먼트의 `innerHTML`을 업데이트합니다. 문자열로 작성된 HTML 마크업을 실제 DOM 엘리먼트로 파싱하여 렌더링합니다.
* **보안 및 주의사항**:
  * `v-html`은 가상 DOM(Virtual DOM)을 거치지 않고 직접 DOM을 조작하므로 XSS(Cross-Site Scripting) 취약점에 노출될 수 있습니다.
  * 브라우저는 `innerHTML`로 주입된 `<script>` 태그의 직접 실행은 차단하지만, `<img src="x" onerror="alert(1)">`와 같은 인라인 이벤트 핸들러는 그대로 실행됩니다.
  * 신뢰할 수 없는 사용자 입력값에는 `v-html`을 사용하지 않고 텍스트 보간법(`{{ }}`)이나 `v-text`를 사용하는 것이 원칙입니다.

### ② 속성 바인딩 (`v-bind`, `:class`, `:style`, `SampleVbindhigh.vue`)
* **동작 원리**:
  * 단축 문법인 콜론(`:`)을 사용하여 HTML 속성(id, href, disabled 등)에 JavaScript 반응형 데이터를 동적으로 연결합니다.
  * 클래스 바인딩 시 객체 문법(`:class="{ active: isActive, 'text-danger': hasError }"`)을 사용하여 boolean 상태값에 따라 클래스를 토글합니다.
  * 스타일 바인딩 시 CSS 속성명을 camelCase 또는 kebab-case 문자열로 객체화하여 인라인 스타일을 제어합니다.

### ③ 조건부 렌더링 비교 (`v-if` vs `v-show`, `SampleVif.vue`, `SampleVshow.vue`)
* **`v-if` (조건부 렌더링)**:
  * 조건이 false일 때 엘리먼트를 실제 DOM 트리에서 완전히 제거하고 주석 노드(`<!---->`)로 대체합니다.
  * 조건이 참이 될 때만 내부 컴포넌트와 이벤트 리스너를 초기화하므로 초기 렌더링 비용이 낮습니다.
* **`v-show` (조건부 표시)**:
  * 조건 여부와 상관없이 항상 DOM 트리에 요소를 생성하여 렌더링합니다.
  * 조건이 false일 때는 CSS 인라인 스타일 `display: none;`을 적용하여 화면에서만 숨깁니다.
* **선택 기준**:
  * 상태가 자주 바뀌는 토글 요소는 DOM 생성 및 파괴 비용이 들지 않는 `v-show`를 사용합니다.
  * 런타임 중에 조건이 거의 바뀌지 않거나 권한별 화면 분기처럼 초기 조건이 거짓일 확률이 높은 경우 `v-if`를 사용합니다.

### ④ 리스트 렌더링 및 키 바인딩 (`v-for`, `:key`, `SampleVfor.vue`)
* **동작 원리**:
  * `v-for="(item, index) in items" :key="item.id"` 문법으로 배열이나 객체를 순회하여 복수의 엘리먼트를 렌더링합니다.
* **`:key` 속성의 역할**:
  * Vue의 가상 DOM Diffing 알고리즘에서 각 노드를 고유하게 식별하는 고유 식별자 역할을 합니다.
  * `:key`를 생략하거나 배열의 `index`를 바인딩할 경우, 리스트 항목의 추가, 삭제, 정렬 시 노드를 올바르게 추적하지 못해 폼 입력 상태가 엉뚱한 행에 남아있는 상태 불일치 문제가 발생할 수 있습니다.
  * 고유한 데이터 ID(`item.id`)를 key로 지정해야 변경된 요소만 정확하게 재사용 및 패치됩니다.

### ⑤ 렌더링 최적화 디렉티브 (`v-pre`, `v-once`, `v-memo`, `v-cloak`)
* **`v-pre` (`SampleVpre.vue`)**:
  * 해당 엘리먼트와 모든 자식 엘리먼트의 컴파일을 건너뜁니다. 머스태시 태그(`{{ }}`)를 원본 텍스트 그대로 표시해야 할 때 사용합니다.
* **`v-once` (`SampleVonce.vue`)**:
  * 엘리먼트와 컴포넌트를 단 한 번만 렌더링하고 이후의 반응형 데이터 변경에 반응하지 않고 정적 캐시로 처리합니다.
* **`v-memo` (`SampleVmemo.vue`)**:
  * 지정한 의존성 배열(`v-memo="[item.id, item.updatedAt]"`)의 값이 변경되었을 때만 해당 서브트리를 다시 렌더링합니다. 대량의 리스트 아이템 중 변경된 행만 선별 렌더링할 때 성능을 개선합니다.
* **`v-cloak` (`SampleVcloak.vue`)**:
  * Vue 인스턴스가 컴파일을 완료하고 마운트될 때까지 엘리먼트에 남아있으며, CSS `[v-cloak] { display: none; }`과 함께 사용하여 초기 로딩 시 컴파일되지 않은 머스태시 텍스트가 깜빡이며 노출되는 현상을 방지합니다.

### ⑥ 이벤트 핸들링 및 수식어 (`v-on` / `@`, `$event`, `VueEventModifier.vue`)
* **동작 원리**:
  * `@click`, `@input` 등 단축 문법을 사용하여 DOM 이벤트를 수신하고 메서드나 인라인 표현식을 실행합니다.
  * 핸들러 함수에 암묵적으로 네이티브 DOM `event` 객체가 전달되며, 인라인 호출 시 `$event` 키워드로 명시적 전달이 가능합니다.
* **이벤트 수식어**:
  * `.prevent`: `event.preventDefault()`를 호출하여 기본 동작(form 제출 후 페이지 이동, a 태그 이동 등)을 차단합니다.
  * `.stop`: `event.stopPropagation()`을 호출하여 이벤트 캡처링 및 버블링 전파를 중단합니다.
  * `.once`: 이벤트를 단 한 번만 트리거합니다.
  * 수식어를 사용함으로써 JavaScript 함수 내부에서 DOM 이벤트 제어 로직을 분리하고 순수 데이터 처리에 집중할 수 있습니다.

### ⑦ 양방향 데이터 바인딩 (`v-model`, `SampleVmodel.vue`)
* **동작 원리**:
  * 폼 요소(input, select, textarea)에서 사용자 입력값과 반응형 상태(`ref`)를 양방향으로 동기화합니다.
  * `v-model="text"`는 텍스트 입력창 기준 `:value="text"` 속성 바인딩과 `@input="text = $event.target.value"` 이벤트 리스너를 결합한 축약 문법입니다.

---

## 3. 개발자도구를 활용한 상태 및 DOM 검증

### ① `vite-plugin-vue-devtools`를 통한 컴포넌트 추적
* 브라우저 화면 하단의 DevTools 플로팅 버튼을 통해 활성화하며, 화면의 UI 요소를 클릭하면 VS Code 에디터의 해당 `.vue` 소스 코드 위치로 즉시 이동하는 Component Inspector 기능을 확인했습니다.

### ② Chrome DevTools Elements 탭을 통한 렌더링 차이 검증
* **`v-if="false"` 검증**:
  * Elements 패널 확인 시 해당 태그가 DOM 트리에서 완전히 삭제되고 `<!---->` 주석 노드만 남아있는 것을 확인했습니다.
* **`v-show="false"` 검증**:
  * DOM 트리에 엘리먼트가 그대로 유지되며, 인라인 스타일로 `style="display: none;"` 속성이 동적으로 추가되는 것을 확인했습니다.

### ③ Vue DevTools Components 탭을 통한 반응형 상태 조작
* Components 패널에서 `isLoggedIn`의 boolean 값이나 `score`의 숫자 값을 수동으로 변경했을 때, 연관된 템플릿의 조건 분기 및 학점 텍스트가 즉시 재계산되어 UI에 반영되는 반응형 동작을 확인했습니다.

---

## 4. 트러블슈팅 일지 (Troubleshooting Log)

### [Case 1] Import 식별자명과 템플릿 태그명 불일치 에러
* **발생 상황**:
  * `<script setup>`에서는 `VueonEventHandler`로 임포트했으나, `<template>` 내부에서 관습적으로 `Sample` 접두사를 붙여 `<SampleVueonEventHandler />`로 호출함.
* **에러 메시지**:
  ```text
  'VueonEventHandler' is defined but never used. (vue/no-unused-components)
  ```
* **원인 분석**:
  * Vue 3 `<script setup>` 문법에서는 임포트된 변수명이 템플릿에서 컴포넌트 태그명으로 1:1 매핑됩니다. 태그명이 일치하지 않아 린터와 컴파일러가 임포트된 컴포넌트를 미사용 변수로 판단하고 에러를 발생시켰습니다.
* **해결 방법**:
  * `App.vue`의 템플릿 태그를 `<VueonEventHandler />`로 수정하여 임포트 식별자명과 일치시켰습니다.

### [Case 2] 누락된 컴포넌트 파일 참조로 인한 Vite 빌드 실패
* **발생 상황**:
  * `App.vue`에서 `./components/practices/SampleVmodel.vue`를 임포트하도록 작성되었으나 해당 파일이 디렉터리에 존재하지 않음.
* **에러 메시지**:
  ```text
  [plugin:vite:import-analysis] Failed to resolve import "./components/practices/SampleVmodel.vue" from "src/App.vue". Does the file exist?
  ```
* **해결 방법**:
  * `src/components/practices/SampleVmodel.vue` 파일을 생성하여 `v-model` 실습 코드를 작성하고 `npm run build`를 정상 통과시켰습니다.

---

## 5. 결론 및 학습 요약

* **선언적 렌더링(Declarative Rendering)**:
  * 바닐라 자바스크립트의 명령형 DOM 제어 방식(`document.querySelector`, `innerHTML` 조작)과 달리, 데이터 상태(State)를 변경하면 Vue의 반응형 엔진이 가상 DOM을 통해 필요한 최소한의 실제 DOM만 효율적으로 갱신함을 확인했습니다.
* **디렉티브의 적절한 활용**:
  * 렌더링 빈도에 따른 `v-if`와 `v-show`의 구분, 가상 DOM 안정성을 위한 `:key` 바인딩, 템플릿 이벤트 수식어를 통한 관심사 분리 등 각 디렉티브의 의도에 맞는 설계가 중요함을 학습했습니다.
