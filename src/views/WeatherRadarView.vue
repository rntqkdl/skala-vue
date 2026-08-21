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
const layerLabels = {
  precipitation_new: '🌧️ 강우 레이더',
  temp_new: '🌡️ 기온 열지도',
  clouds_new: '☁️ 구름 위성',
  wind_new: '💨 풍속 레이더',
}

onMounted(async () => {
  await weatherStore.fetchLiveWeatherData()
  await weatherStore.fetchAllForecasts()
})

const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="cal-radar-container">
    <div class="header-row">
      <div class="header-titles">
        <span class="eyebrow-tag">RADAR & FORECAST</span>
        <h3 class="main-title">전국 산단 기상 레이더 및 24시간 예측 관제</h3>
      </div>
      <button
        class="cal-btn-refresh"
        :disabled="weatherStore.isLoading"
        @click="weatherStore.fetchLiveWeatherData(true)"
      >
        {{ weatherStore.isLoading ? '통신 중...' : '🔄 레이더 갱신' }}
      </button>
    </div>

    <!-- 1. 24시간 최고 기온(피크) 및 사전 예방 알림 배너 -->
    <div class="cal-peak-card">
      <div class="peak-top">
        <span class="peak-badge">⚠️ 24H PEAK ALERT</span>
        <span class="peak-time">{{ weatherStore.peakWarning.time }} 기준</span>
      </div>
      <p class="peak-text">
        <strong>{{ weatherStore.peakWarning.complexName }}</strong
        >이 최고 <strong>{{ configStore.formatTemp(weatherStore.peakWarning.temp) }}</strong
        >에 도달할 것으로 예측됩니다. (피크 1시간 30분 전 공조 냉각 칠러 사전 예냉 가동 권고)
      </p>
    </div>

    <!-- 2. OpenWeatherMap 공식 기상 레이더 타일 맵 뷰어 -->
    <div class="cal-section-card">
      <div class="viewer-header">
        <h4 class="section-title">한반도 상공 실시간 기상 레이더 오버레이</h4>
        <!-- Cal.com Nav-Pill-Group 스타일 레이어 선택기 -->
        <div class="layer-pill-group">
          <button
            v-for="(label, key) in layerLabels"
            :key="key"
            class="layer-pill"
            :class="{ active: activeLayer === key }"
            @click="activeLayer = key"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <!-- 레이더 타일 맵 디스플레이 영역 -->
      <div class="radar-map-box">
        <img
          :src="`https://tile.openweathermap.org/map/${activeLayer}/6/53/25.png?appid=d2b5a5dafabfd6672625a209f2f74423`"
          alt="OpenWeatherMap 레이더 맵 타일"
          class="radar-tile-img"
        />
        <div class="map-overlay-footer">
          <span class="map-source">OpenWeatherMap Realtime Radar Tile (Zoom 6 / Korea)</span>
          <span class="map-active-layer">활성: {{ layerLabels[activeLayer] }}</span>
        </div>
      </div>
    </div>

    <!-- 3. 전국 6대 산단 실시간 종합 지표 비교 매트릭스 표 -->
    <div class="cal-section-card">
      <h4 class="section-title">전국 6대 국가산업단지 실시간 지표 종합 비교</h4>
      <div class="table-scroll-wrapper">
        <table class="cal-data-table">
          <thead>
            <tr>
              <th>산단명</th>
              <th>대표 공정</th>
              <th>실시간 기온</th>
              <th>대기 습도</th>
              <th>공정 특화 리스크 지표</th>
              <th>대기질 (PM2.5)</th>
              <th>관제 상태</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in weatherStore.complexes" :key="item.id">
              <td class="col-name">{{ item.name }}</td>
              <td class="col-industry">{{ item.industry }}</td>
              <td class="col-temp">
                <strong>{{ configStore.formatTemp(item.temp) }}</strong>
                <small>(체감 {{ configStore.formatTemp(item.feels_like) }})</small>
              </td>
              <td>{{ item.humidity }}%</td>
              <td class="col-risk">{{ item.processRiskText || '+7.5μm' }}</td>
              <td>
                <span class="pm-val">{{ item.pm25 }} μg/㎥</span>
              </td>
              <td>
                <span v-if="item.temp >= 30" class="status-pill red">경보</span>
                <span v-else-if="item.temp >= 24" class="status-pill orange">주의</span>
                <span v-else class="status-pill green">정상</span>
              </td>
              <td>
                <button class="cal-btn-table-link" @click="goToDetail(item.id)">이동 →</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <button class="cal-btn-back" @click="router.push('/')">← 메인 대시보드로 이동</button>
  </div>
</template>

<style scoped>
.cal-radar-container {
  width: 100%;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.eyebrow-tag {
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 2px;
}

.main-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.6px;
  color: #111111;
}

.cal-btn-refresh {
  background: #111111;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cal-btn-refresh:hover {
  background: #262626;
}

.cal-peak-card {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.peak-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.peak-badge {
  background: #f59e0b;
  color: white;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.peak-time {
  font-size: 11px;
  color: #92400e;
}

.peak-text {
  margin: 0;
  font-size: 12px;
  color: #78350f;
  line-height: 1.5;
}

.peak-text strong {
  color: #111111;
}

.cal-section-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.section-title {
  margin: 0 0 10px 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #111111;
}

.viewer-header {
  margin-bottom: 10px;
}

.layer-pill-group {
  display: flex;
  gap: 4px;
  background: #f8f9fa;
  padding: 3px;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  width: fit-content;
  margin-bottom: 10px;
}

.layer-pill {
  background: transparent;
  border: none;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.15s ease;
}

.layer-pill.active {
  background: #ffffff;
  color: #111111;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.radar-map-box {
  position: relative;
  width: 100%;
  height: 240px;
  background: #111111;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-tile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.92;
}

.map-overlay-footer {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  background: rgba(17, 17, 17, 0.75);
  padding: 4px 10px;
  border-radius: 6px;
  color: white;
  font-size: 10px;
}

.table-scroll-wrapper {
  overflow-x: auto;
}

.cal-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}

.cal-data-table th {
  background: #f9fafb;
  color: #4b5563;
  padding: 8px 10px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.cal-data-table td {
  padding: 10px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  white-space: nowrap;
}

.col-name {
  font-weight: 600;
  color: #111111;
}

.col-industry {
  font-size: 11px;
  color: #6b7280;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-temp strong {
  color: #111111;
}

.col-temp small {
  display: block;
  font-size: 10px;
  color: #9ca3af;
}

.col-risk {
  color: #d97706;
  font-weight: 600;
}

.status-pill {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-pill.red {
  background: #fef2f2;
  color: #b91c1c;
}

.status-pill.orange {
  background: #fff7ed;
  color: #c2410c;
}

.status-pill.green {
  background: #ecfdf5;
  color: #047857;
}

.cal-btn-table-link {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #111111;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cal-btn-table-link:hover {
  background: #e5e7eb;
}

.cal-btn-back {
  width: 100%;
  padding: 10px;
  background-color: #111111;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cal-btn-back:hover {
  background-color: #262626;
}
</style>
