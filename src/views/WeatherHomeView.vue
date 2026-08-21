<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { useAlertStore } from '@/stores/alertStore'
import { ElNotification, ElMessage } from 'element-plus'

import BaseDashboardCard from '@/components/handson/BaseDashboardCard.vue'
import SearchBar from '@/components/handson/SearchBar.vue'
import WeatherCard from '@/components/handson/WeatherCard.vue'
import ComplexRegisterCard from '@/components/handson/ComplexRegisterCard.vue'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const alertStore = useAlertStore()

// 검색어 및 필터 모드 (all, favorites, alerts)
const searchQuery = ref('')
const filterMode = ref('all')

// 신속 점검 드로어 (Ant Design Drawer)
const drawerVisible = ref(false)
const drawerTarget = ref(null)

onMounted(async () => {
  await weatherStore.fetchLiveWeatherData()
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

// 검색어 및 필터 모드 기준 산단 목록 필터링
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let list = weatherStore.complexes

  if (query) {
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.industry.toLowerCase().includes(query),
    )
  }

  if (filterMode.value === 'favorites') {
    list = list.filter((item) => weatherStore.favorites.includes(item.id))
  } else if (filterMode.value === 'alerts') {
    list = list.filter((item) => item.temp >= 30 || item.humidity >= 90 || item.pm25 > 35)
  }

  // 즐겨찾기 산단 상단 우선 정렬
  return [...list].sort((a, b) => {
    const aFav = weatherStore.favorites.includes(a.id) ? 1 : 0
    const bFav = weatherStore.favorites.includes(b.id) ? 1 : 0
    return bFav - aFav
  })
})

// 산단 상세 관제 뷰로 안전하게 이동 (:cityId)
const handleDetailJump = (target) => {
  const id = typeof target === 'object' ? target.id : target
  router.push(`/weather/${id}`)
}

const handleCardSelect = (msg) => {
  ElMessage({
    message: msg,
    type: 'info',
    duration: 1800,
  })
}

const handleQuickInspect = (item) => {
  drawerTarget.value = item
  drawerVisible.value = true
}

const handleApplySimulation = (type) => {
  weatherStore.applySimulation(type)
  const titleMap = {
    mild: '☀️ 온화한 봄날씨 시뮬레이션 (라이트 모드 유지)',
    heatwave: '🚨 폭염(36℃) 시뮬레이션 (다크 관제 자동 전환)',
    heavyrain: '🌧️ 집중호우(96%) 시뮬레이션 (다크 관제 자동 전환)',
    dust: '😷 고농도 미세먼지(120μg) 시뮬레이션 (다크 관제 자동 전환)',
  }
  ElNotification({
    title: titleMap[type] || '산단 상태 시뮬레이션',
    message: '가상 기상 조건이 적용되어 공정 위험 지표와 관제 화면 테마가 연동되었습니다.',
    type: type === 'mild' ? 'success' : 'warning',
    duration: 3500,
  })
}

const handleResetSimulation = async () => {
  await weatherStore.fetchLiveWeatherData(true)
  ElMessage.success('실시간 오픈 기상 데이터로 정상 복원되었습니다.')
}
</script>

<template>
  <div class="resend-dashboard-view">
    <!-- 상단 대시보드 소개 배너 -->
    <section class="resend-hero-band">
      <div class="hero-editorial-eyebrow">
        <span class="status-dot-live"></span>
        <span>실시간 기상 관측 및 공정 위험 관제 스트림</span>
      </div>
      <h1 class="hero-editorial-headline">스마트 산업단지 기상 관제 대시보드</h1>
      <p class="hero-editorial-desc">
        OpenWeatherMap 실시간 기상 데이터와 6대 국가산업단지 설비 물리 위험 예측 모델을 결합한 스마트 안전 관리 플랫폼입니다.
      </p>
    </section>

    <!-- 1. 4분면 핵심 관제 통계 그리드 (Element Plus <el-statistic>) -->
    <div class="stats-grid-row">
      <el-row :gutter="14">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card-box">
            <el-statistic
              title="전국 산단 평균 기온"
              :value="weatherStore.averageTemp"
              :precision="1"
              suffix="℃"
            />
            <span class="stat-sub-text">실시간 관측치 집계</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card-box">
            <el-statistic
              title="최고 기온 산단"
              :value="weatherStore.maxExpansionComplex ? weatherStore.maxExpansionComplex.name : '창원'"
            />
            <span class="stat-sub-text font-warn">
              {{ weatherStore.maxExpansionComplex ? configStore.formatTemp(weatherStore.maxExpansionComplex.temp) : '25℃' }} (열변형 주의)
            </span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card-box">
            <el-statistic
              title="관제 산업단지"
              :value="weatherStore.complexes.length"
              suffix="개소"
            />
            <span class="stat-sub-text">전국 주요 국가산단 등록</span>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card-box highlight-stat">
            <el-statistic
              title="활성 기상 특보"
              :value="alertStore.dangerCount"
              suffix="건 발령"
            />
            <span class="stat-sub-text font-danger">즉각적인 점검(SOP) 필요</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 2. 산단 상태 시뮬레이션 테스트 (Status Test) -->
    <div class="resend-simulation-bar">
      <div class="sim-left">
        <span class="sim-title font-mono">⚡ 상태 테스트:</span>
        <button class="btn-secondary btn-sm" @click="handleApplySimulation('mild')">
          ☀️ 봄날씨 (22℃ / 라이트)
        </button>
        <button class="btn-secondary btn-sm" @click="handleApplySimulation('heatwave')">
          🚨 폭염 (36℃ / 다크)
        </button>
        <button class="btn-secondary btn-sm" @click="handleApplySimulation('heavyrain')">
          🌧️ 호우 (96% / 다크)
        </button>
        <button class="btn-secondary btn-sm" @click="handleApplySimulation('dust')">
          😷 미세먼지 (120μg / 다크)
        </button>
        <button class="btn-secondary btn-sm" @click="handleResetSimulation">
          ↺ 실시간 복원
        </button>
      </div>

      <div class="sim-right">
        <span class="time-tag font-mono" v-if="weatherStore.lastUpdated">{{ weatherStore.lastUpdated }}</span>
        <button
          class="btn-primary btn-sm"
          :disabled="weatherStore.isLoading"
          @click="weatherStore.fetchLiveWeatherData(true)"
        >
          🔄 새로고침
        </button>
      </div>
    </div>

    <!-- 3. 전국 산단 Geocoding 동적 등록 컴포넌트 -->
    <ComplexRegisterCard />

    <!-- 4. 검색창 및 세그먼트 필터 바 (Element Plus <el-segmented>) -->
    <BaseDashboardCard>
      <div class="filter-layout-row">
        <div class="search-flex-item">
          <SearchBar :query="searchQuery" @update-query="(val) => (searchQuery = val)" />
        </div>
        <div class="segmented-flex-item">
          <el-segmented
            v-model="filterMode"
            :options="[
              { label: '🌐 전체 산단 (' + weatherStore.complexes.length + ')', value: 'all' },
              { label: '⭐ 즐겨찾기 (' + weatherStore.favorites.length + ')', value: 'favorites' },
              { label: '🚨 특보 발령', value: 'alerts' }
            ]"
            size="large"
          />
        </div>
      </div>
    </BaseDashboardCard>

    <!-- 5. 24시간 최고 기온 피크 사전 권고 콜아웃 (Peak Warning Banner) -->
    <div class="cream-callout-card peak-warning-banner" v-if="weatherStore.peakWarning">
      <div class="peak-header">
        <span class="resend-badge badge-coral">🔥 최고 기온 피크 주의 권고</span>
        <span class="peak-time-lead font-mono">대응 권고 시점: {{ weatherStore.peakWarning.leadTime }}</span>
      </div>
      <p class="peak-body-text">
        향후 24시간 내 <strong>{{ weatherStore.peakWarning.complexName }}</strong>에서
        <strong>{{ weatherStore.peakWarning.time }}</strong>에 최고 기온
        <strong style="color: var(--colors-accent-red);">{{ configStore.formatTemp(weatherStore.peakWarning.temp) }}</strong>
        (예측 열변형 +{{ weatherStore.peakWarning.expansion }}μm)에 도달할 예정입니다.
        정밀 가공 공차 유지 및 공조 냉방 칠러 가동을 권고합니다.
      </p>
    </div>

    <!-- 6. 산단 기상 카드 목록 (WeatherCard 컴포넌트 렌더링) -->
    <div v-if="weatherStore.isLoading" class="loading-state-box">
      <el-skeleton :rows="4" animated />
    </div>

    <div v-else-if="filteredWeatherList.length > 0" class="cards-vertical-list">
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="handleCardSelect"
        @click-detail="handleDetailJump"
        @quick-inspect="handleQuickInspect"
      />
    </div>

    <div v-else class="empty-state-box resend-card">
      <el-empty description="조건에 일치하는 관제 산업단지가 없습니다.">
        <button class="btn-primary" @click="searchQuery = ''; filterMode = 'all'">
          검색 및 필터 초기화
        </button>
      </el-empty>
    </div>

    <!-- 7. 신속 점검 드로어 (Ant Design Vue <a-drawer>) -->
    <a-drawer
      v-model:open="drawerVisible"
      :title="drawerTarget ? `${drawerTarget.name} 신속 공정 점검` : '신속 점검'"
      placement="right"
      :width="440"
    >
      <template v-if="drawerTarget">
        <div class="drawer-inner-content">
          <div class="drawer-top-badge-row">
            <span class="industry-chip">{{ drawerTarget.industry }}</span>
            <span class="resend-badge badge-blue">실시간 관제 피드</span>
          </div>

          <div class="drawer-telemetry-box">
            <div class="drawer-metric-line">
              <span>현재 기온:</span>
              <strong>{{ configStore.formatTemp(drawerTarget.temp) }} (체감 {{ configStore.formatTemp(drawerTarget.feels_like) }})</strong>
            </div>
            <div class="drawer-metric-line">
              <span>대기 습도:</span>
              <strong>{{ drawerTarget.humidity }}% (기압 {{ drawerTarget.pressure || 1013 }} hPa)</strong>
            </div>
            <div class="drawer-metric-line">
              <span>공정 위험도:</span>
              <strong style="color: var(--colors-accent-orange);">{{ drawerTarget.processRiskText }}</strong>
            </div>
          </div>

          <h5 class="drawer-sub-title">📋 현장 안전 수칙 점검 항목</h5>
          <div class="drawer-checklist-group">
            <label
              v-for="chk in (drawerTarget.sopChecklist || [])"
              :key="chk.id"
              class="drawer-check-item"
            >
              <input
                type="checkbox"
                :checked="alertStore.isChecklistDone(chk.id)"
                @change="alertStore.toggleChecklistItem(chk.id)"
              />
              <span :class="{ 'line-through': alertStore.isChecklistDone(chk.id) }">
                {{ chk.text }}
              </span>
            </label>
          </div>

          <div class="drawer-bottom-action">
            <button
              class="btn-primary btn-full"
              @click="drawerVisible = false; handleDetailJump(drawerTarget.id)"
            >
              정밀 상세 관제 화면으로 이동 →
            </button>
          </div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<style scoped>
.resend-dashboard-view {
  width: 100%;
}

.stats-grid-row {
  margin-bottom: 16px;
}

.stat-card-box {
  background: var(--colors-surface-card, #f8fafc);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-radius: var(--rounded-md, 8px);
  padding: 16px 20px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.stat-sub-text {
  font-size: 11px;
  color: var(--colors-mute, #64748b);
  margin-top: 6px;
  display: block;
}

.font-warn {
  color: var(--colors-accent-orange, #ea580c);
  font-weight: 500;
}

.font-danger {
  color: var(--colors-accent-red, #dc2626);
  font-weight: 500;
}

.resend-simulation-bar {
  background: var(--colors-surface-card, #f8fafc);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-radius: var(--rounded-md, 8px);
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.sim-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.sim-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--colors-link, #2563eb);
}

.sim-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-tag {
  font-size: 11px;
  color: var(--colors-mute, #64748b);
}

.filter-layout-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.search-flex-item {
  flex: 1;
  min-width: 260px;
}

.segmented-flex-item {
  display: flex;
  align-items: center;
}

.peak-warning-banner {
  background: var(--colors-surface-card, #f8fafc);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-left: 4px solid var(--colors-accent-red, #dc2626);
  border-radius: var(--rounded-md, 8px);
  padding: 16px 20px;
  margin-bottom: 16px;
}

.peak-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.peak-time-lead {
  font-size: 11px;
  color: var(--colors-mute, #64748b);
}

.peak-body-text {
  margin: 0;
  font-size: 13px;
  color: var(--colors-body, #334155);
  line-height: 1.5;
}

.cards-vertical-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-state-box,
.empty-state-box {
  padding: 36px;
  text-align: center;
}

.drawer-inner-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drawer-top-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-telemetry-box {
  background: var(--colors-surface-deep, #f1f5f9);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-radius: var(--rounded-md, 8px);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drawer-metric-line {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.drawer-sub-title {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: var(--colors-ink, #0f172a);
}

.drawer-checklist-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer-check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--colors-body, #334155);
  cursor: pointer;
}

.line-through {
  text-decoration: line-through;
  color: var(--colors-mute, #64748b);
}

.drawer-bottom-action {
  margin-top: 16px;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
