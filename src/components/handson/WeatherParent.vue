<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// 1. 사용자 정의 산업단지 공정 데이터셋 (WeatherComposition 기반)
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

// 2. 검색어 및 상태바 반응형 상태
const searchQuery = ref('')
const selectedCityInfo = ref('산업단지 카드를 클릭하거나 검색해 보세요.')

// 3. 실시간 검색 필터링 (computed)
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 4. 전체 산단 평균 기온 계산 (computed)
const avgTemp = computed(() => {
  if (weatherList.value.length === 0) return 0
  let totalTemp = 0
  for (const plant of weatherList.value) {
    totalTemp += plant.temp
  }
  return Math.round(totalTemp / weatherList.value.length)
})

// 5. 최고 열변형 위험 산단 찾기 (computed)
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

// 6. 상태 변화 감시자 (watch & watchEffect)
watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 산단 데이터를 필터링합니다.`,
  )
})

// 7. 상세보기 알림 함수
const showDetail = (item) => {
  window.alert(
    `${item.name}의 현재 날씨는 [${item.status}] 상태이며, 습도 ${item.humidity}%, 예상 열변형 오차는 +${item.expansionRate}μm 입니다.`,
  )
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 상단 종합 모니터링 통계 요약 바 -->
    <div class="summary-bar">
      평균 기온: {{ avgTemp }}°C | 최고 열변형 위험 지역:
      {{ maxExpansionRate ? maxExpansionRate.name : '없음' }} (+{{
        maxExpansionRate ? maxExpansionRate.expansionRate : 0
      }}μm)
    </div>

    <!-- [1] 검색 상자: BaseDashboardCard 슬롯에 SearchBar 주입 -->
    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <!-- [2] 날씨 리스트 상자: BaseDashboardCard 슬롯에 WeatherCard 목록 주입 -->
    <BaseDashboardCard>
      <h3>🏙️ 산업단지별 날씨 및 공정 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="showDetail"
      />

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 산업단지가 없습니다.
      </p>
    </BaseDashboardCard>

    <!-- 하단 선택 정보 상태바 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
/* 대시보드 레이아웃 및 상태바 스타일 */
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}

.summary-bar {
  background-color: #2c3e50;
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
}

h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.15rem;
  color: #2c3e50;
}

.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
