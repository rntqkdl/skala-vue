<script setup>
import { ref } from 'vue'

// 1. Destructuring & Spread
const basePlant = ref({ name: '창원 국가산단', temp: 28, humidity: 75 })
const updatedPlant = ref(null)

const handleTestSpread = () => {
  const { name, temp } = basePlant.value
  updatedPlant.value = {
    ...basePlant.value,
    temp: temp + 2,
    summary: `${name} - 2℃ 상승 (${temp + 2}℃)`,
  }
}

// 2. Optional Chaining & Nullish Coalescing
const sensorA = ref({ id: 'sensor-01', telemetry: { pressure: 1013 } })
const sensorB = ref({ id: 'sensor-02', telemetry: null })
const outputA = ref('')
const outputB = ref('')

const handleTestNullish = () => {
  outputA.value = sensorA.value?.telemetry?.pressure ?? 1000
  outputB.value = sensorB.value?.telemetry?.pressure ?? '기압 센서 미응답 (기본 1013hPa 대체)'
}

// 3. Array Methods (find, filter, toSorted)
const complexList = ref([
  { id: 'c1', name: '창원', temp: 31 },
  { id: 'c2', name: '울산', temp: 26 },
  { id: 'c3', name: '여수', temp: 29 },
])
const sortedResult = ref([])

const handleSortTest = () => {
  // toSorted() - 원본 불변성 유지 정렬
  sortedResult.value = [...complexList.value].sort((a, b) => b.temp - a.temp)
}
</script>

<template>
  <div class="practice-section">
    <h2>1단원: Modern JavaScript (ES6+ ~ ES15) 핵심 문법 실습</h2>
    <p class="section-desc">
      교재 7p~24p: 구조 분해 할당, 스프레드 연산자, 옵셔널 체이닝(?.), Null 병합(??), 불변 배열 정렬
    </p>

    <div class="modern-js-grid">
      <!-- 1) 구조 분해 및 스프레드 -->
      <div class="test-block">
        <h4>1) 구조 분해 할당 & Spread 연산자 (...)</h4>
        <p class="code-info">기본 데이터: {{ basePlant.name }} / {{ basePlant.temp }}℃</p>
        <button class="btn-action" @click="handleTestSpread">Spread 복사 및 기온 변경</button>
        <p v-if="updatedPlant" class="result-text">
          결과: <strong>{{ updatedPlant.summary }}</strong>
        </p>
      </div>

      <!-- 2) 옵셔널 체이닝 & Null 병합 -->
      <div class="test-block">
        <h4>2) 옵셔널 체이닝 (?.) & Nullish Coalescing (??)</h4>
        <p class="code-info">센서 B (telemetry: null) 안전 탐색</p>
        <button class="btn-action" @click="handleTestNullish">?. 및 ?? 연산자 테스트</button>
        <div v-if="outputA" class="result-group">
          <p>
            센서 A: <strong>{{ outputA }} hPa</strong>
          </p>
          <p>
            센서 B: <strong>{{ outputB }}</strong>
          </p>
        </div>
      </div>

      <!-- 3) 모던 배열 메서드 -->
      <div class="test-block">
        <h4>3) 배열 메서드 정렬 (toSorted)</h4>
        <p class="code-info">목록: 창원(31℃), 울산(26℃), 여수(29℃)</p>
        <button class="btn-action" @click="handleSortTest">기온 내림차순 정렬</button>
        <ul v-if="sortedResult.length > 0" class="sorted-list">
          <li v-for="item in sortedResult" :key="item.id">
            {{ item.name }}: <strong>{{ item.temp }}℃</strong>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
}

.modern-js-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.test-block {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
}

[data-theme='dark'] .test-block {
  background: #1e1e20;
  border-color: #2e2e32;
}

.test-block h4 {
  margin: 0 0 8px 0;
  font-size: 13.5px;
  color: #0f172a;
}

[data-theme='dark'] .test-block h4 {
  color: #f8fafc;
}

.code-info {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
}

.btn-action {
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.result-text {
  margin-top: 10px;
  font-size: 12.5px;
  color: #0066cc;
}

.result-group {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.5;
}

.sorted-list {
  margin: 10px 0 0 0;
  padding-left: 18px;
  font-size: 12.5px;
}
</style>
