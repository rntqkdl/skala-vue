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
  <div class="cal-dashboard-container">
    <!-- 상단 종합 요약 배너 (Cal.com Surface-Card + Hairline) -->
    <div class="cal-summary-card">
      <div class="summary-left">
        <span class="summary-eyebrow">NATIONAL OVERVIEW</span>
        <div class="summary-metric-row">
          <span
            >전국 평균 <strong>{{ configStore.formatTemp(weatherStore.averageTemp) }}</strong></span
          >
          <span class="dot-divider">/</span>
          <span
            >최고 기온 산단:
            <strong>{{
              weatherStore.maxExpansionComplex ? weatherStore.maxExpansionComplex.name : '창원'
            }}</strong>
            ({{
              weatherStore.maxExpansionComplex
                ? configStore.formatTemp(weatherStore.maxExpansionComplex.temp)
                : '25℃'
            }})</span
          >
        </div>
      </div>
      <div class="summary-right">
        <span class="time-tag" v-if="weatherStore.lastUpdated">{{ weatherStore.lastUpdated }}</span>
        <button
          @click="weatherStore.fetchLiveWeatherData(true)"
          class="cal-refresh-btn"
          :disabled="weatherStore.isLoading"
        >
          {{ weatherStore.isLoading ? '통신 중...' : '🔄 갱신' }}
        </button>
      </div>
    </div>

    <!-- 가상 기상 스트레스 테스트 (Cal.com Nav-Pill-Group 스타일) -->
    <div class="cal-simulation-group">
      <span class="sim-title">⚡ 가상 시뮬레이션:</span>
      <button @click="weatherStore.applySimulation('heatwave')" class="sim-pill pill-hot">
        ☀️ 폭염(35℃)
      </button>
      <button @click="weatherStore.applySimulation('heavyrain')" class="sim-pill pill-rain">
        🌧️ 집중호우(95%)
      </button>
      <button @click="weatherStore.applySimulation('dust')" class="sim-pill pill-dust">
        😷 미세먼지
      </button>
      <button @click="weatherStore.fetchLiveWeatherData(true)" class="sim-pill pill-reset">
        ↺ 초기화
      </button>
    </div>

    <!-- 전국 산단 동적 등록 전용 컴포넌트 -->
    <ComplexRegisterCard />

    <!-- 검색 및 즐겨찾기 필터 제어 바 -->
    <BaseDashboardCard>
      <div class="filter-flex-row">
        <div class="search-input-wrapper">
          <SearchBar :query="searchQuery" @update-query="(val) => (searchQuery = val)" />
        </div>
        <button
          class="cal-fav-filter-btn"
          :class="{ active: onlyFavorites }"
          @click="onlyFavorites = !onlyFavorites"
        >
          ⭐ 즐겨찾기만 ({{ weatherStore.favorites.length }})
        </button>
      </div>
    </BaseDashboardCard>

    <!-- 산단별 실시간 날씨 카드 목록 -->
    <div class="card-list-wrapper">
      <div class="card-list-top">
        <h3 class="list-heading">전국 국가산업단지 실시간 공정 리스크 현황</h3>
        <span class="count-badge">{{ filteredWeatherList.length }}개 산단 관제</span>
      </div>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="handleDetailJump"
      />

      <p v-if="filteredWeatherList.length === 0" class="empty-notice">
        😭 일치하는 관제 산업단지가 없습니다.
      </p>
    </div>

    <!-- 선택 상태 바 -->
    <div class="cal-status-toast">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.cal-dashboard-container {
  width: 100%;
}

.cal-summary-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.summary-eyebrow {
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 2px;
}

.summary-metric-row {
  font-size: 13px;
  color: #374151;
}

.summary-metric-row strong {
  color: #111111;
  font-weight: 600;
}

.dot-divider {
  margin: 0 6px;
  color: #d1d5db;
}

.summary-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-tag {
  font-size: 11px;
  color: #9ca3af;
}

.cal-refresh-btn {
  background: #111111;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cal-refresh-btn:hover {
  background: #262626;
}

.cal-simulation-group {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  padding: 4px 10px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sim-title {
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
  margin-right: 2px;
}

.sim-pill {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 9999px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sim-pill.pill-hot {
  color: #dc2626;
  border-color: #fecaca;
  background: #fef2f2;
}

.sim-pill.pill-rain {
  color: #2563eb;
  border-color: #bfdbfe;
  background: #eff6ff;
}

.sim-pill.pill-dust {
  color: #d97706;
  border-color: #fde68a;
  background: #fffbeb;
}

.sim-pill.pill-reset {
  color: #4b5563;
  background: #ffffff;
}

.filter-flex-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
}

.cal-fav-filter-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.cal-fav-filter-btn:hover {
  border-color: #111111;
  color: #111111;
}

.cal-fav-filter-btn.active {
  background: #111111;
  color: #ffffff;
  border-color: #111111;
}

.card-list-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 2px;
}

.list-heading {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #111111;
}

.count-badge {
  font-size: 11px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 500;
}

.empty-notice {
  text-align: center;
  color: #dc2626;
  padding: 24px 0;
  font-size: 13px;
}

.cal-status-toast {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 10px;
  text-align: center;
  color: #15803d;
  font-weight: 600;
  font-size: 12px;
  border-radius: 8px;
  margin-top: 14px;
}
</style>
