<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 1. 산업단지 날씨 및 공정 데이터 배열 (기계공학 도메인 확장)
const weatherList = ref([
  {
    id: 'city_01',
    name: '창원',
    temp: 29,
    status: '맑음',
    humidity: 45,
    expansionRate: 11.2,
  },
  {
    id: 'city_02',
    name: '울산',
    temp: 24,
    status: '비',
    humidity: 85,
    expansionRate: 4.5,
  },
  {
    id: 'city_03',
    name: '군산',
    temp: 32,
    status: '맑음',
    humidity: 75,
    expansionRate: 14.8,
  },
  {
    id: 'city_04',
    name: '광주',
    temp: 22,
    status: '흐림',
    humidity: 55,
    expansionRate: 3.0,
  },
])

// 2. 검색어 및 상태바 반응형 변수
const searchQuery = ref('')
const selectedCityInfo = ref('산업단지 카드를 클릭하거나 검색해 보세요.')

// 3. 검색창 입력 시 실시간으로 카드 목록을 걸러주는 계산된 속성 (filteredWeatherList)
const filteredWeatherList = computed(() => {
  if (!searchQuery.value) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(searchQuery.value.trim()))
})

// 4. 전체 산업단지 평균 기온 계산기 (computed)
const avgTemp = computed(() => {
  if (weatherList.value.length === 0) return 0
  let totalTemp = 0
  for (const plant of weatherList.value) {
    totalTemp += plant.temp
  }
  return Math.round(totalTemp / weatherList.value.length)
})

// 5. 열변형 발생 위험이 가장 높은 지역 찾기 (computed)
const maxExpansionRate = computed(() => {
  if (weatherList.value.length === 0) return null
  let maxPlant = weatherList.value[0]
  for (const plant of weatherList.value) {
    if (plant.expansionRate > maxPlant.expansionRate) {
      maxPlant = plant
    }
  }
  return maxPlant
})

// 6. 상세보기 알림창 함수
const showDetail = (cityName, status, humidity, expansionRate) => {
  window.alert(
    `${cityName}의 현재 날씨는 [${status}] 상태이며, 습도 ${humidity}%, 예상 열변형 오차는 +${expansionRate}μm 입니다.`,
  )
}

// 7. selectedCityInfo 상태 변화 감시 (watch)
watch(selectedCityInfo, (newVal, oldVal) => {
  console.log(`[공정 선택 감시] 이전 상태: ${oldVal} ➔ 현재 상태: ${newVal}`)
})

// 8. searchQuery 검색어 자동 추적 (watchEffect)
watchEffect(() => {
  console.log(`[실시간 검색어 추적]: ${searchQuery.value}`)
})
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 1) 산업단지 검색 섹션 -->
    <section class="search-box">
      <h3>🔍 산업단지 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 산업단지 이름 입력"
      />
      <p>
        검색 중인 지역: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <!-- 2) 공정 모니터링 통계 요약 바 (클래스 분리) -->
    <div class="status-bar summary-bar">
      평균 기온: {{ avgTemp }}°C | 최고 열변형 위험 지역:
      {{ maxExpansionRate ? maxExpansionRate.name : '없음' }} (+{{
        maxExpansionRate ? maxExpansionRate.expansionRate : 0
      }}μm)
    </div>

    <!-- 3) 산업단지 카드 리스트 섹션 -->
    <section class="list-box">
      <h3>🏙️ 산업단지별 날씨 및 공정 현황</h3>

      <!-- 3-1) 검색 결과가 존재할 때 (v-if) -->
      <div v-if="filteredWeatherList.length > 0">
        <div
          v-for="item in filteredWeatherList"
          :key="item.id"
          class="weather-card"
          @click="selectedCityInfo = `${item.name} 공정이 선택되었습니다.`"
        >
          <h4>{{ item.name }} ({{ item.status }})</h4>
          <p>현재 기온: {{ item.temp }}°C</p>
          <p>공정 습도: {{ item.humidity }}%</p>
          <p>열변형 오차: +{{ item.expansionRate }}μm</p>

          <!-- 기온별 3단계 뱃지 (25도 이상 / 20~24도 / 20도 미만) -->
          <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
          <span v-else-if="item.temp >= 20" class="badge warm">🌤️ 따뜻함 (20~24도)</span>
          <span v-else class="badge cool">❄️ 선선함 (20도 미만)</span>

          <!-- 상세보기 버튼 (이벤트 버블링 차단) -->
          <button
            class="btn-detail"
            @click.stop="showDetail(item.name, item.status, item.humidity, item.expansionRate)"
          >
            상세보기
          </button>
        </div>
      </div>

      <!-- 3-2) 검색 결과가 없을 때 (v-else: 클래스 분리) -->
      <div v-else class="status-bar empty-bar">일치하는 산업단지가 없습니다.</div>
    </section>

    <!-- 4) 하단 상태바 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style>
/* 🎨 강의 표준 스타일 불러오기 */
@import '@/assets/exercise.css';

/* 🎨 20~24도 따뜻함 뱃지 스타일 */
.badge.warm {
  background-color: #f39c12;
}

/* 🎨 상단 통계 요약 바 전용 스타일 */
.summary-bar {
  margin-bottom: 20px;
  background-color: #2c3e50;
  color: #ffffff;
}

/* 🎨 검색 결과 없음 안내 바 전용 스타일 */
.empty-bar {
  background-color: #f8d7da;
  color: #721c24;
  text-align: center;
}
</style>
