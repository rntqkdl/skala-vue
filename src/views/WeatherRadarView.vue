<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

// 레이더 레이어 종류 (precipitation_new, temp_new, clouds_new, wind_new)
const activeLayer = ref('precipitation_new')
const layerOptions = [
  { label: '🌧️ 강우 레이더', value: 'precipitation_new' },
  { label: '🌡️ 기온 열지도', value: 'temp_new' },
  { label: '☁️ 구름 위성', value: 'clouds_new' },
  { label: '💨 풍속 레이더', value: 'wind_new' },
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
  <div class="resend-radar-view">
    <!-- 상단 소개 영역 -->
    <section class="resend-hero-band">
      <div class="hero-editorial-eyebrow">
        <span class="status-dot-live"></span>
        <span>실시간 위성 기상 레이더 & 24시간 예측</span>
      </div>
      <h1 class="hero-editorial-headline">전국 기상 레이더 및 24시간 예측 매트릭스</h1>
      <p class="hero-editorial-desc">
        한반도 상공 실시간 기상 레이더 타일 맵과 전국 6대 국가산업단지 24시간 최고 기온 피크 사전 예측 정보입니다.
      </p>
    </section>

    <!-- 1. 24시간 최고 기온(피크) 및 사전 예방 알림 배너 -->
    <div class="signature-coral-card">
      <div class="peak-top">
        <span class="resend-badge badge-danger">⚠️ 24시간 최고 기온 피크 경보</span>
        <span class="peak-time font-mono">{{ weatherStore.peakWarning.time }} 기준</span>
      </div>
      <p class="peak-text">
        <strong>{{ weatherStore.peakWarning.complexName }}</strong> 산단이 최고
        <strong>{{ configStore.formatTemp(weatherStore.peakWarning.temp) }}</strong>에 도달할 것으로 예측됩니다.
        (도달 1시간 30분 전 공조 냉각 칠러 사전 가동 권고)
      </p>
    </div>

    <!-- 2. OpenWeatherMap 공식 기상 레이더 타일 맵 뷰어 -->
    <div class="code-window radar-window-box">
      <div class="viewer-header">
        <div class="traffic-light-bar">
          <span class="traffic-dot dot-red"></span>
          <span class="traffic-dot dot-yellow"></span>
          <span class="traffic-dot dot-green"></span>
          <span class="code-window-title font-mono">한반도 기상 레이더 관측 맵</span>
        </div>

        <!-- Element Plus Segmented Controller -->
        <el-segmented
          v-model="activeLayer"
          :options="layerOptions"
          size="default"
        />
      </div>

      <!-- 레이더 타일 맵 디스플레이 영역 -->
      <div class="radar-map-box">
        <img
          :src="`https://tile.openweathermap.org/map/${activeLayer}/6/53/25.png?appid=d2b5a5dafabfd6672625a209f2f74423`"
          alt="OpenWeatherMap 레이더 맵 타일"
          class="radar-tile-img"
        />
        <div class="map-overlay-footer">
          <span class="map-source font-mono">출처: OpenWeatherMap 실시간 타일 서버</span>
          <span class="map-active-layer font-mono">
            선택 레이어: {{ layerOptions.find(o => o.value === activeLayer)?.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- 3. 전국 6대 산단 실시간 종합 지표 비교 매트릭스 표 (Element Plus Table) -->
    <div class="resend-card" style="margin-top: 16px;">
      <div class="section-header-row">
        <div>
          <h4 class="section-title">전국 6대 국가산업단지 실시간 지표 종합 비교</h4>
          <span class="section-sub">산단별 실시간 기온, 습도, 대기질 및 특화 위험도 종합 표</span>
        </div>
      </div>

      <el-table
        :data="weatherStore.complexes"
        style="width: 100%; margin-top: 16px;"
        size="middle"
        :header-cell-style="{ background: 'var(--colors-surface-elevated)', color: 'var(--colors-ink)' }"
      >
        <el-table-column prop="name" label="산단 명칭" width="130">
          <template #default="{ row }">
            <strong style="color: var(--colors-ink);">{{ row.name }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="industry" label="주력 업종" width="140">
          <template #default="{ row }">
            <span class="industry-tag">{{ row.industry }}</span>
          </template>
        </el-table-column>

        <el-table-column label="실시간 기온" width="120">
          <template #default="{ row }">
            <strong :style="{ color: row.temp >= 30 ? 'var(--colors-accent-red)' : 'var(--colors-ink)' }">
              {{ configStore.formatTemp(row.temp) }}
            </strong>
          </template>
        </el-table-column>

        <el-table-column prop="humidity" label="대기 습도" width="110">
          <template #default="{ row }">
            <span>{{ row.humidity }}%</span>
          </template>
        </el-table-column>

        <el-table-column label="초미세먼지" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-danger': row.pm25 > 35 }">{{ row.pm25 }} μg/㎥</span>
          </template>
        </el-table-column>

        <el-table-column label="공정 위험 지표" min-width="160">
          <template #default="{ row }">
            <span class="risk-highlight font-mono">{{ row.processRiskText || '+7.5μm' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="관제 조치" width="110" align="center">
          <template #default="{ row }">
            <button class="btn-primary btn-sm" @click="goToDetail(row.id)">상세보기</button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="bottom-action-row">
      <button class="btn-secondary" @click="router.push('/')">← 대시보드로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.resend-radar-view {
  width: 100%;
}

.signature-coral-card {
  background: var(--colors-surface-card, #f8fafc);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-left: 4px solid var(--colors-accent-red, #dc2626);
  border-radius: var(--rounded-md, 8px);
  padding: 16px 20px;
  margin-bottom: 16px;
}

.peak-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.peak-time {
  font-size: 11px;
  color: var(--colors-mute, #64748b);
}

.peak-text {
  margin: 0;
  font-size: 13.5px;
  color: var(--colors-body, #334155);
  line-height: 1.5;
}

.radar-window-box {
  background: var(--colors-surface-card, #f8fafc);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-radius: var(--rounded-lg, 12px);
  padding: 20px;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.radar-map-box {
  position: relative;
  width: 100%;
  height: 380px;
  background: #020617;
  border-radius: var(--rounded-md, 8px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
}

.radar-tile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

.map-overlay-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #f1f5f9;
}

.section-header-row {
  margin-bottom: 12px;
}

.section-title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #0f172a);
}

.section-sub {
  font-size: 12px;
  color: var(--colors-mute, #64748b);
}

.industry-tag {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #64748b);
  background: var(--colors-surface-elevated, #ffffff);
  border: 1px solid var(--colors-hairline, #e2e8f0);
  padding: 2px 6px;
  border-radius: var(--rounded-xs, 4px);
}

.risk-highlight {
  color: var(--colors-accent-orange, #ea580c);
  font-weight: 600;
}

.text-danger {
  color: var(--colors-accent-red, #dc2626);
  font-weight: 600;
}

.bottom-action-row {
  margin-top: 24px;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
