<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || 'd2b5a5dafabfd6672625a209f2f74423'
const tileBaseUrl =
  import.meta.env.VITE_OPENWEATHER_TILE_URL || 'https://tile.openweathermap.org/map'

// 레이더 레이어 종류 (precipitation_new, temp_new, clouds_new, wind_new)
const activeLayer = ref('precipitation_new')
const layerOptions = [
  { label: '강우 레이더', value: 'precipitation_new' },
  { label: '기온 열지도', value: 'temp_new' },
  { label: '구름 위성', value: 'clouds_new' },
  { label: '풍속 레이더', value: 'wind_new' },
]

onMounted(async () => {
  await weatherStore.fetchLiveWeatherData()
  await weatherStore.fetchAllForecasts()
})

const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="apple-radar-view">
    <!-- 상단 소개 영역 -->
    <section class="resend-hero-band">
      <div class="hero-editorial-eyebrow">
        <span class="status-dot-live"></span>
        <span>실시간 위성 기상 레이더 & 24시간 예측</span>
      </div>
      <h1 class="hero-editorial-headline">전국 기상 레이더 및 24시간 예측 매트릭스</h1>
      <p class="hero-editorial-desc">
        한반도 상공 실시간 기상 레이더 타일 맵과 전국 6대 국가산업단지 24시간 최고 기온 피크 사전
        예측 정보입니다.
      </p>
    </section>

    <!-- 1. 24시간 최고 기온(피크) 사전 예방 알림 (Element Plus <el-alert>) -->
    <el-alert
      v-if="weatherStore.peakWarning"
      type="warning"
      show-icon
      :closable="false"
      class="apple-ui-peak-alert"
    >
      <template #title>
        <div class="peak-alert-title">
          24시간 최고 기온 피크 경보 ({{ weatherStore.peakWarning.time }} 기준)
        </div>
      </template>
      <div class="peak-alert-desc">
        <strong>{{ weatherStore.peakWarning.complexName }}</strong> 산단이 최고
        <strong>{{ configStore.formatTemp(weatherStore.peakWarning.temp) }}</strong
        >에 도달할 것으로 예측됩니다. (도달 1시간 30분 전 공조 냉각 칠러 사전 가동 권고)
      </div>
    </el-alert>

    <!-- 2. OpenWeatherMap 공식 기상 레이더 타일 맵 뷰어 (Element Plus <el-card>) -->
    <el-card shadow="never" class="apple-ui-radar-card" :body-style="{ padding: '20px 24px' }">
      <div class="viewer-header">
        <div class="viewer-title-cluster">
          <strong class="radar-title">한반도 기상 레이더 관측 맵</strong>
          <span class="radar-sub">OpenWeatherMap 실시간 타일 위성 스트림</span>
        </div>

        <!-- Element Plus Segmented Controller -->
        <el-segmented v-model="activeLayer" :options="layerOptions" size="default" />
      </div>

      <!-- 레이더 타일 맵 디스플레이 영역 -->
      <div class="radar-map-box">
        <img
          :src="`${tileBaseUrl}/${activeLayer}/6/53/25.png?appid=${apiKey}`"
          alt="OpenWeatherMap 레이더 맵 타일"
          class="radar-tile-img"
        />
        <div class="map-overlay-footer">
          <span class="map-source font-mono">출처: OpenWeatherMap 공식 타일 서버 (Zoom Lv 6)</span>
          <span class="map-active-layer font-mono">
            선택 레이어: {{ layerOptions.find((o) => o.value === activeLayer)?.label }}
          </span>
        </div>
      </div>
    </el-card>

    <!-- 3. 전국 6대 산단 실시간 종합 지표 비교 매트릭스 표 (Element Plus Table in <el-card>) -->
    <el-card shadow="never" class="apple-ui-table-card" :body-style="{ padding: '20px 24px' }">
      <div class="section-header-row">
        <h4 class="section-title">전국 6대 국가산업단지 실시간 지표 종합 비교</h4>
        <span class="section-sub">산단별 실시간 기온, 습도, 대기질 및 특화 위험도 종합 표</span>
      </div>

      <el-table :data="weatherStore.complexes" style="width: 100%; margin-top: 14px" size="large">
        <el-table-column prop="name" label="산단 명칭" width="130">
          <template #default="{ row }">
            <strong class="table-ink-name">{{ row.name }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="industry" label="주력 업종" width="160">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" round>{{ row.industry.split(' ')[0] }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="실시간 기온" width="130">
          <template #default="{ row }">
            <strong :class="row.temp >= 30 ? 'temp-danger' : 'temp-normal'">
              {{ configStore.formatTemp(row.temp) }}
            </strong>
          </template>
        </el-table-column>

        <el-table-column prop="humidity" label="대기 습도" width="120">
          <template #default="{ row }">
            <span>{{ row.humidity }}%</span>
          </template>
        </el-table-column>

        <el-table-column label="초미세먼지" width="140">
          <template #default="{ row }">
            <el-tag size="small" :type="row.pm25 > 35 ? 'danger' : 'success'" effect="light" round>
              {{ row.pm25 }} μg/㎥
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="공정 위험 지표" min-width="160">
          <template #default="{ row }">
            <span class="risk-highlight font-mono">{{ row.processRiskText || '+7.5μm' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="관제 조치" width="120" align="center">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              round
              class="apple-primary-btn"
              @click="goToDetail(row.id)"
            >
              상세보기
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="bottom-action-row">
      <el-button size="default" round @click="router.push('/')">← 대시보드로 돌아가기</el-button>
    </div>
  </div>
</template>

<style scoped>
.apple-radar-view {
  width: 100%;
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

.apple-ui-radar-card,
.apple-ui-table-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  margin-bottom: 18px;
  box-shadow: var(--shadow-apple-card);
}

[data-theme='dark'] .apple-ui-radar-card,
[data-theme='dark'] .apple-ui-table-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.viewer-title-cluster {
  display: flex;
  flex-direction: column;
}

.radar-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .radar-title {
  color: #f5f5f7 !important;
}

.radar-sub {
  font-size: 12.5px;
  color: var(--colors-mute, #86868b);
  margin-top: 2px;
}

[data-theme='dark'] .radar-sub {
  color: #a1a1a6 !important;
}

.radar-map-box {
  position: relative;
  width: 100%;
  height: 380px;
  background: #000000;
  border-radius: var(--rounded-md, 12px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
}

[data-theme='dark'] .radar-map-box {
  border-color: #272729;
}

.radar-tile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.95;
}

.map-overlay-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #f5f5f7;
}

.section-header-row {
  margin-bottom: 8px;
}

.section-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .section-title {
  color: #f5f5f7 !important;
}

.section-sub {
  font-size: 12.5px;
  color: var(--colors-mute, #86868b);
}

[data-theme='dark'] .section-sub {
  color: #a1a1a6 !important;
}

.table-ink-name {
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .table-ink-name {
  color: #f5f5f7 !important;
}

.temp-normal {
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .temp-normal {
  color: #f5f5f7 !important;
}

.temp-danger {
  color: var(--colors-accent-red, #ff3b30);
}

.risk-highlight {
  color: var(--colors-accent-orange, #f56300);
  font-weight: 600;
}

.bottom-action-row {
  margin-top: 24px;
}

.apple-primary-btn {
  background-color: var(--colors-primary, #0066cc) !important;
  border-color: var(--colors-primary, #0066cc) !important;
}

.apple-primary-btn:hover {
  background-color: var(--colors-primary-focus, #0071e3) !important;
}

.apple-primary-btn:active {
  transform: scale(0.95);
}
</style>
