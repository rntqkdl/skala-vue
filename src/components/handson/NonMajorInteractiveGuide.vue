<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentChapter = ref(0)

const practiceAnchorMap = [
  'ch01', // 1장 -> 1단원
  'ch08', // 2장 -> 8단원 (반응형)
  'ch03', // 3장 -> 3단원 (디렉티브)
  'ch09', // 4장 -> 9단원 (Computed/Watch)
  'ch12', // 5장 -> 12단원 (Props/Emits)
  'ch15', // 6장 -> 15단원 (Pinia)
  'ch10', // 7장 -> 10단원 (Router/Hands-on)
  'ch14', // 8장 -> 14단원 (Axios/Hands-on)
  'ch13', // 9장 -> 13단원 (UI Library/Slots)
  'ch11', // 10장 -> 11단원 (Lifecycle/Debug)
]

const chapters = [
  {
    num: 1,
    title: '제 1단원: Modern JavaScript (ES6+) 핵심 문법',
    eyebrow: '1단원: ES6+ 및 비동기 처리',
    analogy: 'ES6+ 문법은 복잡한 배선을 줄이고 원터치로 연결해 주는 전동 공구 세트와 같습니다. 간결하고 안전한 변수 선언과 비동기 처리를 제공합니다.',
    concepts: [
      {
        name: '1. let / const (변수 선언)',
        desc: 'var의 함수 스코프와 호이스팅 문제를 없애고, 블록 단위 스코프({ })로 안전하게 변수를 만듭니다. 기본은 const(상수), 변경이 필요할 때만 let을 씁니다.',
        code: `const API_URL = 'https://api.openweathermap.org' // 재할당 불가\nlet currentTemp = 25 // 나중에 currentTemp = 30 가능`,
      },
      {
        name: '2. 화살표 함수 (Arrow Function)',
        desc: 'function 키워드 대신 =>를 사용하여 코드를 간결하게 만들고, 상위 스코프의 this를 그대로 상속받습니다.',
        code: `const add = (a, b) => a + b\nconst getWarning = (temp) => (temp >= 30 ? '폭염' : '정상')`,
      },
      {
        name: '3. 구조 분해 할당 (Destructuring)',
        desc: '객체나 배열 내부의 필요한 속성만 쏙 뽑아내어 독립된 변수로 선언합니다.',
        code: `const plant = { name: '창원', temp: 31, humidity: 85 }\nconst { name, temp } = plant\nconsole.log(name, temp) // '창원', 31`,
      },
      {
        name: '4. Spread 연산자 (...) & 템플릿 리터럴',
        desc: '불변성을 유지하며 객체나 배열을 복사하고, 백틱 안에 변수를 삽입합니다.',
        code: `const original = { id: 1, name: '포항' }\nconst updated = { ...original, status: '경보 발령' }\nconst logMsg = \`[\${updated.name}] 상태: \${updated.status}\``,
      },
    ],
    pitfall: 'const로 선언한 객체/배열 내부의 프로퍼티는 수정 가능하지만, 변수 자체에 새 객체를 통째로 재할당(obj = {})하면 에러가 납니다.',
    routeTest: {
      label: '메인 대시보드 실시간 API 연동 테스트',
      path: '/',
      desc: 'ES6+ async/await 및 구조 분해 할당으로 가공된 실시간 기상 관측 데이터를 대시보드에서 직접 확인합니다.',
    },
  },
  {
    num: 2,
    title: '제 2단원: Vue 3 반응성(Reactivity) 원리와 Ref / Reactive',
    eyebrow: '2단원: 반응형 상태 관리',
    analogy: '반응성(Reactivity)은 데이터가 변경될 때 화면이 스스로 감지하여 갱신하는 자동화 메커니즘입니다.',
    concepts: [
      {
        name: '1. ref() vs reactive() 차이',
        desc: 'ref는 숫자, 문자, 불리언, 객체 등 모든 타입에 만능으로 쓰이며 .value로 접근합니다. reactive는 오직 객체/배열만 받으며 .value 없이 씁니다.',
        code: `import { ref, reactive } from 'vue'\n\nconst count = ref(0) // JS에서 count.value++, 템플릿에서는 {{ count }}\nconst state = reactive({ count: 0 }) // state.count++`,
      },
      {
        name: '2. 왜 ref를 권장하는가?',
        desc: 'reactive로 만든 객체를 구조 분해 할당({ count } = state)하면 반응성이 깨집니다. 반면 ref는 toRefs()나 단독 변수로 다루기 훨씬 안전합니다.',
        code: `// 비전공자 추천: 모든 반응형 상태는 ref()로 통일하는 것이 실수를 예방합니다.`,
      },
    ],
    pitfall: '<script setup> 안에서는 반드시 count.value로 접근해야 합니다. 템플릿(<template>) 안에서는 Vue가 자동으로 .value를 언래핑해주므로 count로 씁니다.',
    routeTest: {
      label: '온도 단위(℃/℉) 반응형 전환 테스트',
      path: '/',
      desc: '상단 스위처를 눌러 ref() 상태 변경 시 모든 카드의 기온이 실시간 자동 재계산되는 반응형 렌더링을 테스트합니다.',
    },
  },
  {
    num: 3,
    title: '제 3단원: 템플릿 디렉티브(Directives) 핵심 원리',
    eyebrow: '3단원: 템플릿 문법 & 바인딩',
    analogy: '디렉티브(v-)는 HTML 태그에 조건부 표시, 반복 렌더링, 양방향 입력 바인딩을 부여하는 Vue 전용 특수 속성입니다.',
    concepts: [
      {
        name: '1. v-bind (:) 와 v-model',
        desc: 'v-bind(:)는 단방향 데이터 바인딩, v-model은 입력창과 상태를 실시간으로 일치시키는 양방향 데이터 바인딩입니다.',
        code: `<img :src="weatherIconUrl" :alt="status" />\n<input v-model="searchQuery" placeholder="검색어 입력" />`,
      },
      {
        name: '2. v-if vs v-show의 렌더링 비용 차이',
        desc: 'v-if는 조건이 거짓일 때 DOM에서 요소를 완전히 제거하고, v-show는 display: none 스타일로 화면에만 숨깁니다.',
        code: `<!-- 토글 빈도가 적을 때 (초기 로딩 절약) -->\n<div v-if="isAdmin">관리자 전용 패널</div>\n\n<!-- 수시로 켜고 꺼질 때 (DOM 재생성 비용 절약) -->\n<div v-show="isTooltipVisible">상세 툴팁</div>`,
      },
      {
        name: '3. v-for와 고유 키(:key)의 중요성',
        desc: '목록 순회 시 고유한 :key="item.id"를 주지 않으면 가상 DOM이 변경 노드를 찾지 못해 엉뚱한 항목이 업데이트되는 버그가 발생합니다.',
        code: `<div v-for="item in complexList" :key="item.id">\n  {{ item.name }} - {{ item.temp }}℃\n</div>`,
      },
    ],
    pitfall: 'v-html은 악성 스크립트(XSS) 공격에 노출될 수 있으므로 사용자 입력값에는 절대 쓰지 말고 일반 {{ }} 보간법이나 v-text를 사용해야 합니다.',
    routeTest: {
      label: '창원 산단 검색(v-model & v-for) 테스트',
      path: '/?search=창원',
      desc: 'v-model 양방향 바인딩과 v-for 리스트 렌더링 필터링 동작을 메인 대시보드 검색창에서 직접 테스트합니다.',
    },
  },
  {
    num: 4,
    title: '제 4단원: Computed vs Watch vs WatchEffect',
    eyebrow: '4단원: 의존성 캐싱 & 감시자',
    analogy: 'Computed는 계산 결과를 기억하는 스마트 캐시 계산기이며, Watch는 특정 값의 변경을 감지해 부수 효과를 실행하는 감시자입니다.',
    concepts: [
      {
        name: '1. computed() — 의존성 캐싱 계산기',
        desc: '반응형 데이터가 바뀔 때만 다시 계산되고, 값이 같으면 이전 계산 결과를 즉시 재사용(캐싱)하여 연산 속도를 극대화합니다.',
        code: `const celsius = ref(25)\nconst fahrenheit = computed(() => Math.round((celsius.value * 9) / 5 + 32))`,
      },
      {
        name: '2. watch() — 이전 값과 현재 값 비교 감시',
        desc: '특정 변수의 변경을 감지하여 URL 쿼리스트링 동기화, API 재호출, localStorage 저장 같은 부수 효과를 실행합니다.',
        code: `watch(searchQuery, (newVal, oldVal) => {\n  router.push({ query: { search: newVal } })\n})`,
      },
    ],
    pitfall: '단순히 값을 가공해 화면에 보여줄 때는 watch 대신 computed를 사용하는 것이 코드도 간결하고 성능상 유리합니다.',
    routeTest: {
      label: '전국 기상 레이더 24시간 피크 연산 테스트',
      path: '/radar',
      desc: 'computed()로 자동 캐싱 연산되는 24시간 최고 기온 피크 산단과 예측 위험 지표를 레이더 화면에서 확인합니다.',
    },
  },
  {
    num: 5,
    title: '제 5단원: 컴포넌트(Component) vs 뷰(View) & Props / Emits',
    eyebrow: '5단원: 컴포넌트 통신 & 불변성',
    analogy: '컴포넌트는 재사용 가능한 부품이고 뷰는 완성된 전체 화면입니다. 데이터는 상위에서 하위로 내려주고(Props), 이벤트는 하위에서 상위로 올립니다(Emits).',
    concepts: [
      {
        name: '1. 컴포넌트 vs 뷰의 분리',
        desc: '컴포넌트(src/components/)는 재사용 부품, 뷰(src/views/)는 라우터 주소(URL)와 1:1로 매핑되는 최상위 페이지입니다.',
        code: `<template>\n  <div class="view-container">\n    <SearchBar :query="query" @update-query="onSearch" />\n    <WeatherCard v-for="c in list" :key="c.id" :item="c" @click-detail="goDetail" />\n  </div>\n</template>`,
      },
      {
        name: '2. 단방향 데이터 흐름: Props (부모 ➡️ 자식)',
        desc: '부모가 자식에게 데이터를 전달하며, 자식은 전달받은 props를 절대로 직접 수정해서는 안 됩니다 (불변성 원칙).',
        code: `<!-- 자식 컴포넌트 내부 -->\nconst props = defineProps({ item: Object })`,
      },
      {
        name: '3. 이벤트 발신: Emits (자식 ➡️ 부모)',
        desc: '자식 내부에서 클릭이 일어났을 때 부모에게 신호(Event)를 발신하여 상위에서 액션을 처리하게 합니다.',
        code: `<!-- 자식 컴포넌트 -->\nconst emit = defineEmits(['click-detail'])\nemit('click-detail', props.item) // 부모에게 전달`,
      },
    ],
    pitfall: '자식이 props.item.temp = 40처럼 props를 직접 바꾸려 하면 Vue 경고가 발생합니다. 상태 변경은 반드시 부모에게 emit하거나 Pinia 스토어를 통해야 합니다.',
    routeTest: {
      label: '창원 산단 상세 뷰(Props/Emits) 테스트',
      path: '/weather/city_01',
      desc: '부모 대시보드에서 자식 카드로 전달된 Props와 자식에서 emit된 상세보기 이벤트 흐름을 상세 뷰에서 테스트합니다.',
    },
  },
  {
    num: 6,
    title: '제 6단원: Props Drilling 문제와 Pinia 전역 상태 관리',
    eyebrow: '6단원: Pinia 전역 중앙 창고',
    analogy: '여러 계층을 거쳐 데이터를 전달하는 Props Drilling 문제를 해결하기 위해, 모든 컴포넌트가 직접 접근할 수 있는 중앙 스토어(Pinia)를 활용합니다.',
    concepts: [
      {
        name: '1. Props Drilling의 문제점',
        desc: '중간 부모 컴포넌트들이 사용하지도 않는 props를 계속 아래로 전달해야 하므로 유지보수가 복잡해집니다.',
        code: `최상위 ──(props)──▶ 중간 부모 ──(props)──▶ 하위 자식 (비효율)`,
      },
      {
        name: '2. Pinia 중앙 스토어 솔루션',
        desc: '컴포넌트 트리 외부에 독립된 Store를 두고, 어느 깊이의 컴포넌트에서든 1줄로 즉시 데이터 조회 및 수정을 실행합니다.',
        code: `// src/stores/configStore.js\nexport const useConfigStore = defineStore('config', () => {\n  const unit = ref('celsius')\n  const toggleUnit = () => { unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius' }\n  return { unit, toggleUnit }\n})\n\n// 어떤 컴포넌트에서든 즉시 호출\nconst configStore = useConfigStore()`,
      },
    ],
    pitfall: 'Pinia 스토어의 state를 구조 분해 할당할 때는 storeToRefs(store)를 써야 반응성이 유지됩니다.',
    routeTest: {
      label: '기상 특보 & SOP 체크리스트 영속화 테스트',
      path: '/alerts',
      desc: 'Pinia 중앙 스토어에 보관되어 새로고침 후에도 유지되는 산단별 점검표 진행률을 안전수칙 화면에서 테스트합니다.',
    },
  },
  {
    num: 7,
    title: '제 7단원: Vue Router 4 마스터 (useRouter vs useRoute)',
    eyebrow: '7단원: SPA 라우팅 & 스크롤 복원',
    analogy: 'useRouter는 화면을 다른 주소로 이동시키는 조작 도구이며, useRoute는 현재 주소창의 파라미터와 쿼리를 읽는 도구입니다.',
    concepts: [
      {
        name: '1. useRouter() — 이동 명령',
        desc: '화면을 다른 URL로 이동시키거나 뒤로 가기, 앞으로 가기를 실행하는 액션 인스턴스입니다.',
        code: `import { useRouter } from 'vue-router'\nconst router = useRouter()\n\nrouter.push('/radar') // 전국 레이더로 이동\nrouter.push(\`/weather/\${cityId}\`) // 상세 페이지로 이동`,
      },
      {
        name: '2. useRoute() — 현재 주소창 정보 읽기',
        desc: '현재 페이지의 URL 정보(파라미터 :cityId, 쿼리 ?search=)를 반응형으로 읽어옵니다.',
        code: `import { useRoute } from 'vue-router'\nconst route = useRoute()\n\nconst currentId = route.params.cityId // 동적 파라미터\nconst keyword = route.query.search    // 쿼리스트링`,
      },
      {
        name: '3. scrollBehavior — 화면 최상단 복원',
        desc: '페이지 이동 시 이전 페이지의 스크롤 위치에 머물지 않고 항상 새 화면의 최상단(Y=0)으로 이동시키는 설정입니다.',
        code: `scrollBehavior() { return { top: 0, left: 0 } }`,
      },
    ],
    pitfall: 'route.push()는 존재하지 않는 함수입니다. 화면을 이동시킬 때는 반드시 router.push()를 사용해야 합니다.',
    routeTest: {
      label: '울산 산단 동적 라우트(:cityId) 이동 테스트',
      path: '/weather/city_02',
      desc: 'useRouter().push() 액션과 useRoute().params 동적 세그먼트 추출 동작을 울산 산단 상세 뷰에서 테스트합니다.',
    },
  },
  {
    num: 8,
    title: '제 8단원: Axios와 비동기 REST API 파이프라인',
    eyebrow: '8단원: Axios REST API',
    analogy: 'Axios는 외부 날씨 서버와 HTTP 통신을 수행하여 최신 기상 데이터를 주고받는 비동기 클라이언트 라이브러리입니다.',
    concepts: [
      {
        name: '1. async / await 비동기 처리',
        desc: '서버 응답이 완료될 때까지 대기한 후 데이터를 안전하게 변수에 할당하여 코드 흐름을 직관적으로 만듭니다.',
        code: `const fetchWeather = async (lat, lon) => {\n  try {\n    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {\n      params: { lat, lon, appid: API_KEY, units: 'metric' }\n    })\n    return res.data\n  } catch (error) {\n    console.error('날씨 호출 실패:', error)\n  }\n}`,
      },
      {
        name: '2. 3중 엔드포인트 파이프라인 구축',
        desc: '무료 플랜 401 차단을 방지하기 위해 /weather(현재), /forecast(예보), /air_pollution(대기질)을 분리하여 병렬 호출(Promise.allSettled)합니다.',
        code: `const [curr, fc, air] = await Promise.allSettled([\n  fetchCurrentWeather(lat, lon),\n  fetchForecast(lat, lon),\n  fetchAirPollution(lat, lon)\n])`,
      },
    ],
    pitfall: 'API Key는 코드에 직접 하드코딩하지 말고 .env 파일의 VITE_OPENWEATHER_API_KEY 환경변수에 넣고 import.meta.env로 읽어야 안전합니다.',
    routeTest: {
      label: '전국 기상 레이더 위성 타일 관측소 테스트',
      path: '/radar',
      desc: 'OpenWeatherMap 4대 REST API를 비동기 병렬 결합(Promise.allSettled)한 타일 레이더 뷰를 테스트합니다.',
    },
  },
  {
    num: 9,
    title: '제 9단원: UI 라이브러리 (Element Plus & Ant Design) 결합',
    eyebrow: '9단원: 듀얼 UI 컴포넌트 결합',
    analogy: 'Element Plus와 Ant Design Vue의 컴포넌트들을 역할별로 결합하여 대시보드와 슬라이드 드로어를 구성합니다.',
    concepts: [
      {
        name: '1. Element Plus 활용 영역',
        desc: '<el-statistic>(실시간 통계 위젯), <el-progress>(원형/선형 리스크 게이지), <el-segmented>(필터/단위 스위치), <el-table>(데이터 표)',
        code: `<el-statistic title="평균 기온" :value="25.4" suffix="℃" />\n<el-progress type="circle" :percentage="85" status="success" />`,
      },
      {
        name: '2. Ant Design Vue 활용 영역',
        desc: '<a-drawer>(우측 슬라이드 SOP 신속 점검 패널), <a-timeline>(24시간 예보 및 조치 타임라인), <a-descriptions>(설비 제원표), <a-popconfirm>(삭제 확인)',
        code: `<a-drawer v-model:open="drawerOpen" title="SOP 현장 점검">...</a-drawer>\n<a-timeline>\n  <a-timeline-item color="red">1단계 감지</a-timeline-item>\n</a-timeline>`,
      },
    ],
    pitfall: '두 UI 라이브러리를 함께 쓸 때는 CSS 클래스 충돌을 방지하기 위해 각 컴포넌트에 scoped 스타일이나 전역 토큰 오버라이드를 명확히 지정해야 합니다.',
    routeTest: {
      label: '대시보드 통계 및 신속 점검 드로어 테스트',
      path: '/',
      desc: 'Element Plus의 <el-statistic>, <el-progress>와 Ant Design의 <a-drawer> 결합 동작을 메인 대시보드에서 테스트합니다.',
    },
  },
  {
    num: 10,
    title: '제 10단원: 비전공자를 위한 실전 디버깅 10계명',
    eyebrow: '10단원: 실전 디버깅 & 404 방어',
    analogy: '디버깅은 브라우저 개발자 도구의 콘솔 메시지와 네트워크 탭을 확인하여 원인을 진단하고 수정하는 체계적인 과정입니다.',
    concepts: [
      {
        name: '1. Cannot read properties of undefined 에러',
        desc: '원인: 데이터가 비동기로 로드되기 전에 complex.incident.year처럼 깊은 객체에 접근했을 때 발생.',
        code: `<!-- 해결책: 옵셔널 체이닝(?.) 또는 v-if 가드 사용 -->\n<p>{{ complex?.incident?.year || '2024년' }}</p>`,
      },
      {
        name: '2. 화면 이동 시 빈 화면이 나오는 현상',
        desc: '원인: 컴포넌트 렌더링 중 자바스크립트 런타임 에러 발생 또는 스크롤이 맨 아래에 머물러 있는 경우.',
        code: `// 해결책 1: scrollBehavior() { return { top: 0 } }\n// 해결책 2: 브라우저 개발자 도구(F12) 콘솔(Console)의 빨간 에러 메시지 1번째 줄 확인`,
      },
      {
        name: '3. 새로고침하면 검색어나 즐겨찾기가 사라지는 현상',
        desc: '원인: 상태가 메모리에만 머물러 있음. 해결책: localStorage.setItem() + watch() 연동.',
        code: `const favs = ref(JSON.parse(localStorage.getItem('favs') || '[]'))\nwatch(favs, (val) => localStorage.setItem('favs', JSON.stringify(val)), { deep: true })`,
      },
    ],
    pitfall: '에러가 발생하면 F12를 눌러 Console 탭의 최상단 빨간색 에러 메시지의 파일명과 라인 번호를 먼저 확인해야 합니다.',
    routeTest: {
      label: '404 Not Found 비정상 경로 복구 테스트',
      path: '/unknown-test-path',
      desc: '잘못된 URL 입력 시 Catch-all 라우트가 404 에러 화면으로 안전하게 연결하고 복귀시키는 메커니즘을 테스트합니다.',
    },
  },
]

const nextChapter = () => {
  if (currentChapter.value < chapters.length - 1) {
    currentChapter.value++
  }
}

const prevChapter = () => {
  if (currentChapter.value > 0) {
    currentChapter.value--
  }
}

const jumpToChapter = (idx) => {
  currentChapter.value = idx
}

const goToRouteTest = (path) => {
  router.push(path)
}

const goToPractice = (idx) => {
  const anchor = practiceAnchorMap[idx] || 'ch01'
  router.push(`/practices#${anchor}`)
}
</script>

<template>
  <div class="interactive-guide-container">
    <!-- 상단 챕터 네비게이션 스텝퍼 & 진행률 (Element Plus 카드 래퍼) -->
    <el-card shadow="never" class="stepper-el-card">
      <div class="stepper-meta-row">
        <span class="chapter-count-tag font-mono">
          제 {{ currentChapter + 1 }}장 / 총 {{ chapters.length }}장
        </span>
        <span class="chapter-progress-text">
          전체 진도율: <strong>{{ Math.round(((currentChapter + 1) / chapters.length) * 100) }}%</strong>
        </span>
      </div>

      <!-- 10단원 퀵 점프 그리드 -->
      <div class="chapter-dot-rail">
        <button
          v-for="(ch, idx) in chapters"
          :key="ch.num"
          class="chapter-dot-btn"
          :class="{ active: currentChapter === idx, completed: currentChapter > idx }"
          @click="jumpToChapter(idx)"
          :title="ch.title"
        >
          <span class="dot-num font-mono">{{ ch.num }}</span>
          <span class="dot-label">{{ ch.num }}단원</span>
        </button>
      </div>

      <!-- 이전 / 다음 컨트롤 버튼 바 -->
      <div class="stepper-actions-row">
        <button
          class="btn-secondary btn-sm"
          :disabled="currentChapter === 0"
          @click="prevChapter"
        >
          ← 이전 단원 ({{ currentChapter > 0 ? chapters[currentChapter - 1].num + '단원' : '시작' }})
        </button>
        <button
          class="btn-primary btn-sm"
          :disabled="currentChapter === chapters.length - 1"
          @click="nextChapter"
        >
          다음 단원 ({{ currentChapter < chapters.length - 1 ? chapters[currentChapter + 1].num + '단원' : '완료' }}) →
        </button>
      </div>
    </el-card>

    <!-- 메인 슬라이드 카드 (현재 활성화된 챕터) -->
    <div class="resend-card slide-card-content" style="margin-top: 16px;">
      <div class="card-header-line">
        <span class="eyebrow-tag font-mono">{{ chapters[currentChapter].eyebrow }}</span>
        <h3 class="slide-main-title">{{ chapters[currentChapter].title }}</h3>
      </div>

      <!-- 1. 핵심 개념 비유 카드 (Element Plus Card) -->
      <el-card shadow="never" class="analogy-el-card">
        <template #header>
          <div class="card-mini-head">
            <span class="head-icon">💡</span>
            <strong class="head-title">핵심 개념 요약</strong>
          </div>
        </template>
        <p class="analogy-body-text">{{ chapters[currentChapter].analogy }}</p>
      </el-card>

      <!-- 2. 개념별 상세 해설 & 실전 코드 블록 (Element Plus Cards) -->
      <div class="concept-cards-grid">
        <el-card
          v-for="(c, cIdx) in chapters[currentChapter].concepts"
          :key="cIdx"
          shadow="never"
          class="concept-el-card"
        >
          <h4 class="concept-head">{{ c.name }}</h4>
          <p class="concept-desc">{{ c.desc }}</p>
          <div class="code-window code-inner-box">
            <div class="traffic-light-bar">
              <span class="traffic-dot dot-red"></span>
              <span class="traffic-dot dot-yellow"></span>
              <span class="traffic-dot dot-green"></span>
              <span class="code-window-title font-mono">CODE_SNIPPET_0{{ cIdx + 1 }}.VUE</span>
            </div>
            <pre class="concept-code-text font-mono"><code>{{ c.code }}</code></pre>
          </div>
        </el-card>
      </div>

      <!-- 3. 비전공자 주의 함정 & 처방전 (Element Plus Alert) -->
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        :title="'비전공자 핵심 체크포인트 & 디버깅 팁'"
        :description="chapters[currentChapter].pitfall"
        class="guide-el-alert"
      />

      <!-- 4. 라우터를 통한 실제 동작 화면 테스트 배너 (Element Plus Card) -->
      <el-card shadow="never" class="route-action-card">
        <div class="route-test-info">
          <div class="route-test-head">
            <el-tag size="small" type="success" effect="dark" class="font-mono">실전 라우트 테스트</el-tag>
            <span class="route-path-tag font-mono">경로: {{ chapters[currentChapter].routeTest.path }}</span>
          </div>
          <h4 class="route-test-title">{{ chapters[currentChapter].routeTest.label }}</h4>
          <p class="route-test-desc">{{ chapters[currentChapter].routeTest.desc }}</p>
        </div>
        <button
          class="btn-primary"
          @click="goToRouteTest(chapters[currentChapter].routeTest.path)"
        >
          해당 화면으로 이동하여 테스트 →
        </button>
      </el-card>

      <!-- 5. 해당 단원 교재 실습 코드 매칭 바로가기 (Element Plus Card) -->
      <el-card shadow="never" class="practice-action-card">
        <div class="jump-info">
          <span class="jump-label font-mono">🧪 교재 1~15단원 실습장 코드 매칭</span>
          <p class="jump-sub">교재에 수록된 실제 컴포넌트의 동작 결과를 실습장에서 즉시 확인해보세요.</p>
        </div>
        <button class="btn-secondary btn-sm" @click="goToPractice(currentChapter)">
          실습장 코드 보러가기 →
        </button>
      </el-card>
    </div>

    <!-- 하단 이전/다음 네비게이션 복사 -->
    <div class="bottom-stepper-row">
      <button class="btn-secondary" :disabled="currentChapter === 0" @click="prevChapter">
        ← 이전 단원으로
      </button>
      <span class="bottom-ch-indicator font-mono">제 {{ currentChapter + 1 }}장 / 총 {{ chapters.length }}장</span>
      <button class="btn-primary" :disabled="currentChapter === chapters.length - 1" @click="nextChapter">
        다음 단원으로 →
      </button>
    </div>
  </div>
</template>

<style scoped>
.interactive-guide-container {
  width: 100%;
}

.stepper-el-card {
  background: var(--colors-surface-card, #ffffff) !important;
  border: 1px solid var(--colors-hairline, #d2d2d7) !important;
  border-radius: var(--rounded-lg, 18px) !important;
}

[data-theme="dark"] .stepper-el-card {
  background: #1d1d1f !important;
  border-color: #333336 !important;
}

.chapter-count-tag {
  font-size: 12px;
  font-weight: 600;
  color: var(--colors-primary, #0066cc);
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  padding: 4px 10px;
  border-radius: var(--rounded-pill, 9999px);
  display: inline-block;
}

[data-theme="dark"] .chapter-count-tag {
  background: #272729 !important;
  color: #2997ff !important;
  border-color: #333336 !important;
}

.chapter-progress-text {
  font-size: 13px;
  color: var(--colors-charcoal, #515154);
}

[data-theme="dark"] .chapter-progress-text {
  color: #d2d2d7 !important;
}

[data-theme="dark"] .chapter-progress-text strong {
  color: #f5f5f7 !important;
}

.chapter-dot-rail {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.chapter-dot-btn {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-sm, 8px);
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chapter-dot-btn:hover {
  background: var(--colors-surface-deep, #e8e8ed);
  border-color: var(--colors-primary, #0066cc);
}

[data-theme="dark"] .chapter-dot-btn {
  background: #161617;
  border-color: #333336;
}

[data-theme="dark"] .chapter-dot-btn:hover {
  background: #272729;
  border-color: #2997ff;
}

.chapter-dot-btn.active {
  background: var(--colors-primary, #0066cc) !important;
  border-color: var(--colors-primary, #0066cc) !important;
}

[data-theme="dark"] .chapter-dot-btn.active {
  background: #2997ff !important;
  border-color: #2997ff !important;
}

.chapter-dot-btn.active .dot-num,
.chapter-dot-btn.active .dot-label {
  color: #ffffff !important;
}

.chapter-dot-btn.completed {
  border-color: var(--colors-accent-green, #34c759);
}

.dot-num {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

.dot-label {
  font-size: 10.5px;
  color: var(--colors-mute, #86868b);
}

[data-theme="dark"] .dot-num {
  color: #f5f5f7 !important;
}

[data-theme="dark"] .dot-label {
  color: #a1a1a6 !important;
}

[data-theme="dark"] .bottom-ch-indicator {
  color: #f5f5f7 !important;
  font-weight: 600 !important;
}

.stepper-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--colors-hairline-soft, #e5e5ea);
}

[data-theme="dark"] .stepper-actions-row {
  border-top-color: #272729;
}

.card-header-line {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--colors-hairline, #e2e8f0);
  padding-bottom: 14px;
}

.eyebrow-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--colors-primary, #0066cc);
  margin-bottom: 6px;
}

[data-theme="dark"] .slide-eyebrow {
  color: #2997ff !important;
}

.slide-main-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
  letter-spacing: -0.3px;
}

[data-theme="dark"] .slide-main-title {
  color: #f5f5f7 !important;
}

.analogy-el-card {
  background: var(--colors-surface-card, #ffffff) !important;
  border: 1px solid var(--colors-hairline, #d2d2d7) !important;
  border-radius: var(--rounded-lg, 18px) !important;
  margin-bottom: 18px;
}

[data-theme="dark"] .analogy-el-card {
  background: #1d1d1f !important;
  border-color: #333336 !important;
}

.card-mini-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.head-icon {
  font-size: 16px;
}

.head-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .head-title {
  color: #f5f5f7 !important;
}

.analogy-body-text {
  margin: 0;
  font-size: 13.5px;
  color: var(--colors-body, #1d1d1f);
  line-height: 1.6;
}

[data-theme="dark"] .analogy-body-text {
  color: #d2d2d7 !important;
}

.concept-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.concept-el-card {
  background: var(--colors-surface-card, #ffffff) !important;
  border: 1px solid var(--colors-hairline, #d2d2d7) !important;
  border-radius: var(--rounded-lg, 18px) !important;
}

[data-theme="dark"] .concept-el-card {
  background: #1d1d1f !important;
  border-color: #333336 !important;
}

.concept-head {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .concept-head {
  color: #f5f5f7 !important;
}

.concept-desc {
  margin: 0 0 12px 0;
  font-size: 13.5px;
  color: var(--colors-charcoal, #515154);
  line-height: 1.5;
}

[data-theme="dark"] .concept-desc {
  color: #d2d2d7 !important;
}

.code-inner-box {
  background: var(--colors-canvas, #f5f5f7) !important;
  border: 1px solid var(--colors-hairline-soft, #e5e5ea) !important;
  border-radius: var(--rounded-sm, 8px) !important;
  padding: 12px 16px;
}

[data-theme="dark"] .code-inner-box {
  background: #161617 !important;
  border-color: #272729 !important;
}

.concept-code-text {
  margin: 8px 0 0 0;
  font-size: 12.5px;
  color: var(--colors-primary, #0066cc);
  line-height: 1.45;
  overflow-x: auto;
  font-family: var(--font-mono);
}

[data-theme="dark"] .concept-code-text {
  color: #2997ff !important;
}

.guide-el-alert {
  margin-bottom: 20px;
  border-radius: var(--rounded-lg, 18px) !important;
}

.route-action-card {
  background: var(--colors-surface-card, #ffffff) !important;
  border: 1px solid var(--colors-hairline, #d2d2d7) !important;
  border-radius: var(--rounded-lg, 18px) !important;
  margin-bottom: 14px;
}

[data-theme="dark"] .route-action-card {
  background: #1d1d1f !important;
  border-color: #333336 !important;
}

.route-action-card :deep(.el-card__body) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
}

.route-test-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 260px;
}

.route-test-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.route-path-tag {
  font-size: 11.5px;
  background: var(--colors-canvas, #f5f5f7);
  padding: 2px 8px;
  border-radius: var(--rounded-pill, 9999px);
  color: var(--colors-charcoal, #515154);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  font-family: var(--font-mono);
}

[data-theme="dark"] .route-path-tag {
  background: #272729;
  color: #d2d2d7;
  border-color: #333336;
}

.route-test-title {
  margin: 4px 0 2px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .route-test-title {
  color: #f5f5f7 !important;
}

.route-test-desc {
  margin: 0;
  font-size: 13px;
  color: var(--colors-body, #515154);
  line-height: 1.5;
}

[data-theme="dark"] .route-test-desc {
  color: #a1a1a6 !important;
}

.practice-action-card {
  background: var(--colors-canvas, #f5f5f7) !important;
  border: 1px solid var(--colors-hairline-soft, #e5e5ea) !important;
  border-radius: var(--rounded-lg, 18px) !important;
}

[data-theme="dark"] .practice-action-card {
  background: #161617 !important;
  border-color: #272729 !important;
}

.practice-action-card :deep(.el-card__body) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 20px;
}

.jump-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jump-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--colors-mute, #86868b);
}

[data-theme="dark"] .jump-label {
  color: #a1a1a6 !important;
}

.jump-sub {
  margin: 0;
  font-size: 12.5px;
  color: var(--colors-charcoal, #515154);
}

[data-theme="dark"] .jump-sub {
  color: #d2d2d7 !important;
}

.bottom-stepper-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.bottom-ch-indicator {
  font-size: 12.5px;
  color: var(--colors-mute, #86868b);
  font-weight: 600;
}

[data-theme="dark"] .bottom-ch-indicator {
  color: #a1a1a6 !important;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
