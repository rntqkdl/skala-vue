<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

import BaseDashboardCard from '@/components/handson/BaseDashboardCard.vue'
import SearchBar from '@/components/handson/SearchBar.vue'
import WeatherCard from '@/components/handson/WeatherCard.vue'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()

// 산업단지 공정 및 기상 관측 목록
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

// 검색어 및 하단 상태 바 문구
const searchQuery = ref('')
const selectedCityInfo = ref('산업단지 카드를 클릭하거나 검색해 보세요.')

// 마운트 시 URL 쿼리스트링(?search=)에 입력값이 있으면 검색창에 반영
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

// 검색어 입력 시 주소창 쿼리스트링 동기화
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

// 검색어 기준 산단 목록 필터링
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 전체 산단 평균 기온 계산
const avgTemp = computed(() => {
  if (weatherList.value.length === 0) return 0
  const totalTemp = weatherList.value.reduce((sum, item) => sum + item.temp, 0)
  return Math.round(totalTemp / weatherList.value.length)
})

// 최고 열변형 위험 산단 추출
const maxExpansionRate = computed(() => {
  if (weatherList.value.length === 0) return null
  return weatherList.value.reduce((prev, curr) =>
    curr.expansionRate > prev.expansionRate ? curr : prev,
  )
})

// 상세보기 클릭 시 동적 라우트(/weather/:id)로 이동
const handleDetailJump = (target) => {
  const id = typeof target === 'object' ? target.id : target
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 상단 종합 관측 통계 바 -->
    <div class="summary-bar">
      평균 기온: {{ configStore.formatTemp(avgTemp) }} | 최고 열변형 위험 지역:
      {{ maxExpansionRate ? maxExpansionRate.name : '없음' }} (+{{
        maxExpansionRate ? maxExpansionRate.expansionRate : 0
      }}μm)
    </div>

    <!-- 검색 입력 영역 -->
    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <!-- 산단별 날씨 카드 목록 -->
    <BaseDashboardCard>
      <h3>🏙️ 산업단지별 날씨 및 공정 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="handleDetailJump"
      />

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 일치하는 산업단지가 없습니다.
      </p>
    </BaseDashboardCard>

    <!-- 선택 상태 바 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
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
