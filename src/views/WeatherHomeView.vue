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
import NationalComplexMap from '@/components/handson/NationalComplexMap.vue'
import ComplexTrendChart from '@/components/handson/ComplexTrendChart.vue'

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
    mild: '☀️ 표준 가동 상태 (22℃ 외기온 안정)',
    heatwave: '🚨 하계 폭염 셧다운 경보 (36℃ / 다크 비상 관제 전환)',
    heavyrain: '🌧️ 집중호우 지하 침수 방어 (96% / 다크 비상 관제 전환)',
    dust: '😷 클린룸 고농도 분진 경보 (120μg / 다크 비상 관제 전환)',
  }
  ElNotification({
    title: titleMap[type] || '플랜트 공정 시뮬레이션',
    message: '가상 기상 조건이 적용되어 공정 위험 지표와 관제 화면 테마가 연동되었습니다.',
    type: type === 'mild' ? 'success' : 'warning',
    duration: 3500,
  })
}

const handleResetSimulation = async () => {
  await weatherStore.fetchLiveWeatherData(true)
  ElMessage.success('실시간 국가산단 기상 관측 데이터로 정상 복원되었습니다.')
}

const handleResetFilter = () => {
  searchQuery.value = ''
  filterMode.value = 'all'
}

const handleDrawerDetailJump = () => {
  if (drawerTarget.value) {
    const id = drawerTarget.value.id
    drawerVisible.value = false
    handleDetailJump(id)
  }
}
</script>

<template>
  <div class="apple-dashboard-view">
    <!-- 상단 대시보드 소개 배너 (스마트 팩토리 관제 콘셉트) -->
    <section class="resend-hero-band">
      <div class="hero-editorial-eyebrow">
        <span class="status-dot-live"></span>
        <span>스마트 팩토리 기상 연동 설비 물리 관제 스트림</span>
      </div>
      <h1 class="hero-editorial-headline">스마트 산업단지 기상 관제 종합 대시보드</h1>
      <p class="hero-editorial-desc">
        OpenWeatherMap 실시간 기상 관측 데이터와 6대 국가산업단지 설비 열변형·염해·침수 물리 예측
        모델을 결합한 스마트 안전 관리 플랫폼입니다.
      </p>
    </section>

    <!-- 1. 4분면 핵심 관제 통계 그리드 (Element Plus <el-statistic> in <el-card>) -->
    <div class="stats-grid-row">
      <el-row :gutter="14">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="apple-ui-stat-card" :body-style="{ padding: '18px 20px' }">
            <el-statistic
              title="전국 산단 평균 기온"
              :value="weatherStore.averageTemp"
              :precision="1"
              suffix="℃"
            />
            <span class="stat-sub-text">실시간 외기온 계측치</span>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="apple-ui-stat-card" :body-style="{ padding: '18px 20px' }">
            <el-statistic
              title="최고 기온 산단"
              :value="
                weatherStore.maxExpansionComplex ? weatherStore.maxExpansionComplex.name : '창원'
              "
            />
            <span class="stat-sub-text font-warn">
              {{
                weatherStore.maxExpansionComplex
                  ? configStore.formatTemp(weatherStore.maxExpansionComplex.temp)
                  : '25℃'
              }}
              (설비 열변형 주의)
            </span>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="apple-ui-stat-card" :body-style="{ padding: '18px 20px' }">
            <el-statistic
              title="동적 관제 산단"
              :value="weatherStore.complexes.length"
              suffix="개소"
            />
            <span class="stat-sub-text">전국 주요 국가산단 인프라</span>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card
            shadow="hover"
            class="apple-ui-stat-card highlight-stat"
            :body-style="{ padding: '18px 20px' }"
          >
            <el-statistic title="활성 기상 특보" :value="alertStore.dangerCount" suffix="건 발령" />
            <span class="stat-sub-text font-danger">즉각적인 공정 SOP 점검 필요</span>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 2. 공정 기상 시뮬레이션 제어 바 (Element Plus <el-card> & <el-button>) -->
    <el-card shadow="never" class="apple-ui-sim-card" :body-style="{ padding: '12px 18px' }">
      <div class="sim-bar-flex">
        <div class="sim-left">
          <span class="sim-title">공정 시뮬레이션:</span>
          <el-button size="small" round @click="handleApplySimulation('mild')">
            ☀️ 표준 가동 (22℃)
          </el-button>
          <el-button size="small" round @click="handleApplySimulation('heatwave')">
            🚨 폭염 셧다운 (36℃)
          </el-button>
          <el-button size="small" round @click="handleApplySimulation('heavyrain')">
            🌧️ 호우 침수 (96%)
          </el-button>
          <el-button size="small" round @click="handleApplySimulation('dust')">
            😷 클린룸 분진 (120μg)
          </el-button>
          <el-button size="small" round type="info" plain @click="handleResetSimulation">
            ↺ 실시간 복원
          </el-button>
        </div>

        <div class="sim-right">
          <span class="time-tag font-mono" v-if="weatherStore.lastUpdated">{{
            weatherStore.lastUpdated
          }}</span>
          <el-button
            type="primary"
            size="small"
            round
            :loading="weatherStore.isLoading"
            @click="weatherStore.fetchLiveWeatherData(true)"
          >
            새로고침
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 3. 하이테크 Bento Grid: [전국 산단 인터랙티브 맵] + [24시간 공정 리스크 예측 곡선 차트] -->
    <div class="bento-vis-grid">
      <el-row :gutter="18">
        <el-col :xs="24" :lg="12">
          <NationalComplexMap />
        </el-col>
        <el-col :xs="24" :lg="12">
          <ComplexTrendChart />
        </el-col>
      </el-row>
    </div>

    <!-- 4. 전국 산단 Geocoding 동적 등록 컴포넌트 -->
    <ComplexRegisterCard />

    <!-- 5. 검색창 및 세그먼트 필터 바 (Element Plus <el-segmented>) -->
    <BaseDashboardCard>
      <div class="filter-layout-row">
        <div class="search-flex-item">
          <SearchBar :query="searchQuery" @update-query="(val) => (searchQuery = val)" />
        </div>
        <div class="segmented-flex-item">
          <el-segmented
            v-model="filterMode"
            :options="[
              { label: '전체 산단 (' + weatherStore.complexes.length + ')', value: 'all' },
              { label: '즐겨찾기 (' + weatherStore.favorites.length + ')', value: 'favorites' },
              { label: '특보 발령', value: 'alerts' },
            ]"
            size="default"
          />
        </div>
      </div>
    </BaseDashboardCard>

    <!-- 6. 24시간 최고 기온 피크 사전 권고 콜아웃 (Element Plus <el-alert>) -->
    <el-alert
      v-if="weatherStore.peakWarning"
      type="warning"
      show-icon
      :closable="false"
      class="apple-ui-peak-alert"
    >
      <template #title>
        <div class="peak-alert-title">
          <strong>{{ weatherStore.peakWarning.complexName }}</strong> 24시간 최고 기온 피크 주의
          권고 ({{ weatherStore.peakWarning.time }})
        </div>
      </template>
      <div class="peak-alert-desc">
        향후 24시간 내 최고 기온
        <strong>{{ configStore.formatTemp(weatherStore.peakWarning.temp) }}</strong> (예측 열변형
        +{{ weatherStore.peakWarning.expansion }}μm)에 도달할 예정입니다. 정밀 가공 공차 유지 및
        공조 냉방 칠러 가동을 권고합니다.
      </div>
    </el-alert>

    <!-- 7. 산단 기상 카드 목록 (WeatherCard 컴포넌트 렌더링) -->
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

    <div v-else class="empty-state-box">
      <el-empty description="조건에 일치하는 관제 산업단지가 없습니다.">
        <el-button type="primary" round @click="handleResetFilter"> 검색 및 필터 초기화 </el-button>
      </el-empty>
    </div>

    <!-- 8. 신속 점검 드로어 (Ant Design Vue <a-drawer>) -->
    <a-drawer
      v-model:open="drawerVisible"
      :title="drawerTarget ? `${drawerTarget.name} 신속 공정 점검` : '신속 점검'"
      placement="right"
      :width="440"
    >
      <template v-if="drawerTarget">
        <div class="drawer-inner-content">
          <div class="drawer-top-badge-row">
            <el-tag size="small" effect="plain" round class="drawer-industry-tag">
              {{ drawerTarget.industry }}
            </el-tag>
            <el-tag size="small" effect="light" round>실시간 관제 피드</el-tag>
          </div>

          <div class="drawer-telemetry-box">
            <div class="drawer-metric-line">
              <span class="d-label">현재 기온 / 체감:</span>
              <strong class="d-val"
                >{{ configStore.formatTemp(drawerTarget.temp) }} (체감
                {{ configStore.formatTemp(drawerTarget.feels_like) }})</strong
              >
            </div>
            <div class="drawer-metric-line">
              <span class="d-label">대기 환경 (습도/기압):</span>
              <strong class="d-val"
                >{{ drawerTarget.humidity }}% (기압 {{ drawerTarget.pressure || 1013 }} hPa)</strong
              >
            </div>
            <div class="drawer-metric-line">
              <span class="d-label">공정 물리 위험도:</span>
              <strong class="d-val text-risk">{{ drawerTarget.processRiskText }}</strong>
            </div>
          </div>

          <h5 class="drawer-sub-title">현장 표준 안전 수칙 (SOP) 점검</h5>
          <div class="drawer-checklist-group">
            <label
              v-for="chk in drawerTarget.sopChecklist || []"
              :key="chk.id"
              class="drawer-check-item"
            >
              <input
                type="checkbox"
                class="apple-checkbox"
                :checked="alertStore.isChecklistDone(chk.id)"
                @change="alertStore.toggleChecklistItem(chk.id)"
              />
              <span :class="{ 'line-through': alertStore.isChecklistDone(chk.id) }">
                {{ chk.text }}
              </span>
            </label>
          </div>

          <div class="drawer-bottom-action">
            <el-button
              type="primary"
              round
              class="apple-primary-btn btn-full"
              @click="handleDrawerDetailJump"
            >
              정밀 상세 관제 화면으로 이동 →
            </el-button>
          </div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<style scoped>
.apple-dashboard-view {
  width: 100%;
}

.stats-grid-row {
  margin-bottom: 18px;
}

.apple-ui-stat-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  margin-bottom: 14px;
  box-shadow: var(--shadow-apple-card);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.apple-ui-stat-card:hover {
  box-shadow: var(--shadow-apple-hover);
  transform: translateY(-1px);
}

[data-theme='dark'] .apple-ui-stat-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.stat-sub-text {
  font-size: 12px;
  color: var(--colors-mute, #86868b);
  margin-top: 6px;
  display: block;
}

[data-theme='dark'] .stat-sub-text {
  color: #a1a1a6 !important;
}

.font-warn {
  color: var(--colors-accent-orange, #f56300);
  font-weight: 500;
}

.font-danger {
  color: var(--colors-accent-red, #ff3b30);
  font-weight: 500;
}

.apple-ui-sim-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  margin-bottom: 18px;
  box-shadow: var(--shadow-apple-card);
}

[data-theme='dark'] .apple-ui-sim-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.sim-bar-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.sim-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.sim-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--colors-primary, #0066cc);
  margin-right: 4px;
}

[data-theme='dark'] .sim-title {
  color: #2997ff !important;
}

.sim-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-tag {
  font-size: 12px;
  color: var(--colors-mute, #86868b);
}

[data-theme='dark'] .time-tag {
  color: #a1a1a6 !important;
}

.bento-vis-grid {
  margin-bottom: 6px;
}

.filter-layout-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-flex-item {
  flex: 1;
  min-width: 280px;
}

.segmented-flex-item {
  display: flex;
  align-items: center;
}

.apple-ui-peak-alert {
  border-radius: var(--rounded-lg, 18px) !important;
  margin-bottom: 18px !important;
  padding: 16px 20px !important;
}

.peak-alert-title {
  font-size: 14.5px;
  font-weight: 600;
  margin-bottom: 4px;
}

.peak-alert-desc {
  font-size: 13.5px;
  line-height: 1.45;
}

.cards-vertical-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.loading-state-box,
.empty-state-box {
  padding: 36px;
  text-align: center;
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
}

[data-theme='dark'] .loading-state-box,
[data-theme='dark'] .empty-state-box {
  background-color: #1d1d1f;
  border-color: #333336;
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
  flex-wrap: wrap;
  gap: 8px;
}

.drawer-industry-tag {
  font-size: 12px;
}

.drawer-telemetry-box {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

[data-theme='dark'] .drawer-telemetry-box {
  background: #161617;
  border-color: #272729;
}

.drawer-metric-line {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.d-label {
  color: var(--colors-mute, #86868b);
}

[data-theme='dark'] .d-label {
  color: #a1a1a6 !important;
}

.d-val {
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .d-val {
  color: #f5f5f7 !important;
}

.text-risk {
  color: var(--colors-accent-orange, #f56300);
}

.drawer-sub-title {
  margin: 8px 0 0 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .drawer-sub-title {
  color: #f5f5f7 !important;
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
  font-size: 13.5px;
  color: var(--colors-body, #1d1d1f);
  cursor: pointer;
}

[data-theme='dark'] .drawer-check-item {
  color: #f5f5f7 !important;
}

.apple-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #0066cc;
  cursor: pointer;
}

.line-through {
  text-decoration: line-through;
  color: var(--colors-mute, #86868b);
}

[data-theme='dark'] .line-through {
  color: #86868b !important;
}

.drawer-bottom-action {
  margin-top: 16px;
}

.apple-primary-btn {
  background-color: var(--colors-primary, #0066cc) !important;
  border-color: var(--colors-primary, #0066cc) !important;
  font-size: 13px;
  height: 36px;
}

.apple-primary-btn:hover {
  background-color: var(--colors-primary-focus, #0071e3) !important;
}

.btn-full {
  width: 100%;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
