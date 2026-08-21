<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

import BaseDashboardCard from '@/components/handson/BaseDashboardCard.vue'
import SearchBar from '@/components/handson/SearchBar.vue'
import WeatherCard from '@/components/handson/WeatherCard.vue'
import ComplexRegisterCard from '@/components/handson/ComplexRegisterCard.vue'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

// 검색어, 즐겨찾기 필터 모드 및 하단 상태 바 문구
const searchQuery = ref('')
const onlyFavorites = ref(false)
const selectedCityInfo = ref('산업단지 카드를 클릭하거나 검색해 보세요.')

// 마운트 시 실시간 오픈 기상 데이터 호출
onMounted(() => {
  weatherStore.fetchLiveWeatherData()
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

// 검색어 및 즐겨찾기 기준 산단 목록 필터링 (즐겨찾기 우선 정렬)
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let list = weatherStore.complexes

  if (query) {
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.industry.toLowerCase().includes(query),
    )
  }

  if (onlyFavorites.value) {
    list = list.filter((item) => weatherStore.favorites.includes(item.id))
  }

  // 즐겨찾기 산단 상단 우선 정렬
  return [...list].sort((a, b) => {
    const aFav = weatherStore.favorites.includes(a.id) ? 1 : 0
    const bFav = weatherStore.favorites.includes(b.id) ? 1 : 0
    return bFav - aFav
  })
})

// 상세보기 클릭 시 동적 라우트(/weather/:id)로 이동
const handleDetailJump = (target) => {
  const id = typeof target === 'object' ? target.id : target
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 상단 종합 관측 통계 및 실시간 갱신 바 -->
    <div class="summary-bar">
      <div class="summary-text">
        평균 기온: <strong>{{ configStore.formatTemp(weatherStore.averageTemp) }}</strong> | 최고
        열변형:
        <strong>{{
          weatherStore.maxExpansionComplex ? weatherStore.maxExpansionComplex.name : '없음'
        }}</strong>
        (+{{
          weatherStore.maxExpansionComplex ? weatherStore.maxExpansionComplex.expansionRate : 0
        }}μm)
      </div>
      <div class="summary-actions">
        <span class="time-tag" v-if="weatherStore.lastUpdated"
          >갱신: {{ weatherStore.lastUpdated }}</span
        >
        <button
          @click="weatherStore.fetchLiveWeatherData(true)"
          class="btn-refresh"
          :disabled="weatherStore.isLoading"
        >
          {{ weatherStore.isLoading ? '통신 중...' : '🔄 실시간 갱신' }}
        </button>
      </div>
    </div>

    <!-- 가상 기상 스트레스 테스트 (시뮬레이션 바) -->
    <div class="simulation-bar">
      <span class="sim-label">⚡ 가상 기상 시뮬레이션:</span>
      <button @click="weatherStore.applySimulation('heatwave')" class="btn-sim hot">
        ☀️ 폭염(35℃)
      </button>
      <button @click="weatherStore.applySimulation('heavyrain')" class="btn-sim rain">
        🌧️ 집중호우(95%)
      </button>
      <button @click="weatherStore.applySimulation('dust')" class="btn-sim dust">
        😷 미세먼지
      </button>
      <button @click="weatherStore.fetchLiveWeatherData(true)" class="btn-sim reset">
        ↺ 실시간 복귀
      </button>
    </div>

    <!-- 신규 전국 산단/도시 동적 등록 전용 컴포넌트 -->
    <ComplexRegisterCard />

    <!-- 검색 및 즐겨찾기 필터 영역 -->
    <BaseDashboardCard>
      <div class="filter-controls">
        <div class="search-flex">
          <SearchBar :query="searchQuery" @update-query="(val) => (searchQuery = val)" />
        </div>
        <button
          class="btn-fav-filter"
          :class="{ active: onlyFavorites }"
          @click="onlyFavorites = !onlyFavorites"
        >
          ⭐ 즐겨찾기만 ({{ weatherStore.favorites.length }})
        </button>
      </div>
    </BaseDashboardCard>

    <!-- 산단별 실시간 날씨 카드 목록 -->
    <BaseDashboardCard>
      <div class="card-list-header">
        <h3>🏙️ 전국 국가산업단지 실시간 기상 및 열변형 현황</h3>
        <span class="count-tag">총 {{ filteredWeatherList.length }}개 산단 관제 중</span>
      </div>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="handleDetailJump"
      />

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 15px 0"
      >
        😭 조건에 일치하는 관제 산업단지가 없습니다.
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
  margin-bottom: 10px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-text strong {
  color: #54a0ff;
}

.summary-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.time-tag {
  font-size: 11px;
  color: #c8d6e5;
}

.btn-refresh {
  background: #3498db;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-refresh:hover {
  background-color: #2980b9;
}

.simulation-bar {
  background: #f1f2f6;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dfe4ea;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.sim-label {
  font-weight: bold;
  color: #2f3542;
  margin-right: 2px;
}

.btn-sim {
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  font-weight: 500;
}

.btn-sim.hot {
  background: #ff7675;
  color: white;
}
.btn-sim.rain {
  background: #0984e3;
  color: white;
}
.btn-sim.dust {
  background: #fdcb6e;
  color: #2d3436;
}
.btn-sim.reset {
  background: #636e72;
  color: white;
}

.filter-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-flex {
  flex: 1;
}

.btn-fav-filter {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: bold;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-fav-filter:hover {
  border-color: #f1c40f;
  color: #2c3e50;
}

.btn-fav-filter.active {
  background: #fef9e7;
  border-color: #f1c40f;
  color: #d35400;
}

.card-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-list-header h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #2c3e50;
}

.count-tag {
  font-size: 11px;
  color: #7f8c8d;
  font-weight: 600;
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
