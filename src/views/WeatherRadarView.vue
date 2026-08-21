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
  <div class="radar-container">
    <div class="header-row">
      <h3>🗺️ 전국 국가산단 기상 레이더 및 24시간 예측 관제</h3>
      <a-button
        type="primary"
        size="small"
        :loading="weatherStore.isLoading"
        @click="weatherStore.fetchLiveWeatherData(true)"
      >
        🔄 레이더 갱신
      </a-button>
    </div>
    <hr />

    <!-- 1. 24시간 최고 기온(피크) 및 사전 예방 알림 배너 (Ant Design Alert) -->
    <a-alert
      message="24시간 피크 사전 예측 경보"
      :description="`${weatherStore.peakWarning.time} 기준 ${weatherStore.peakWarning.complexName} 최고 ${configStore.formatTemp(weatherStore.peakWarning.temp)} 도달 예상 - 피크 1시간 30분 전 공조 칠러 사전 예냉 가동 권장`"
      type="warning"
      show-icon
      class="peak-alert-box"
    />

    <!-- 2. OpenWeatherMap 공식 기상 레이더 타일 맵 뷰어 -->
    <a-card class="radar-viewer-card">
      <div class="viewer-header">
        <h4>📡 한반도 실시간 기상 레이더 오버레이</h4>
        <div class="layer-btn-group">
          <a-radio-group v-model:value="activeLayer" size="small" button-style="solid">
            <a-radio-button v-for="(label, key) in layerLabels" :key="key" :value="key">
              {{ label }}
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <!-- 레이더 타일 맵 디스플레이 영역 -->
      <div class="radar-map-display">
        <img
          :src="`https://tile.openweathermap.org/map/${activeLayer}/6/53/25.png?appid=d2b5a5dafabfd6672625a209f2f74423`"
          alt="OpenWeatherMap 레이더 맵 타일"
          class="radar-tile-img"
        />
        <div class="map-overlay-info">
          <span class="map-tag">OpenWeatherMap Realtime Radar Tile (Zoom 6 / Korea)</span>
          <span class="layer-indicator">현재 활성: {{ layerLabels[activeLayer] }}</span>
        </div>
      </div>
    </a-card>

    <!-- 3. 전국 6대 산단 실시간 종합 지표 비교 매트릭스 표 -->
    <a-card class="matrix-card">
      <h4>📊 전국 6대 국가산업단지 실시간 지표 종합 비교</h4>
      <div class="table-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>산단명</th>
              <th>대표 공정</th>
              <th>실시간 기온</th>
              <th>대기 습도</th>
              <th>공정 특화 리스크 지표</th>
              <th>대기질 (PM2.5)</th>
              <th>관제 상태</th>
              <th>상세</th>
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
                <a-tag v-if="item.temp >= 30" color="red">경보</a-tag>
                <a-tag v-else-if="item.temp >= 24" color="orange">주의</a-tag>
                <a-tag v-else color="green">정상</a-tag>
              </td>
              <td>
                <a-button type="link" size="small" @click="goToDetail(item.id)">이동 →</a-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-card>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 이동</button>
  </div>
</template>

<style scoped>
.radar-container {
  width: 600px;
  margin: 0 auto;
  background: white;
  padding: 22px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  color: #2c3e50;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #2c3e50;
  font-weight: 700;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin-bottom: 14px;
}

.peak-alert-box {
  margin-bottom: 14px;
  border-radius: 6px;
}

.radar-viewer-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 14px;
}

.viewer-header {
  margin-bottom: 10px;
}

.viewer-header h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #1e293b;
  font-weight: 700;
}

.layer-btn-group {
  margin-bottom: 10px;
}

.radar-map-display {
  position: relative;
  width: 100%;
  height: 240px;
  background: #1e293b;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-tile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

.map-overlay-info {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.65);
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 10px;
}

.matrix-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 14px;
}

.matrix-card h4 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #1e293b;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}

.matrix-table th {
  background: #f8fafc;
  color: #475569;
  padding: 8px 6px;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.matrix-table td {
  padding: 8px 6px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  white-space: nowrap;
}

.col-name {
  font-weight: 700;
  color: #1e293b;
}

.col-industry {
  font-size: 11px;
  color: #64748b;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-temp strong {
  color: #1e293b;
}

.col-temp small {
  display: block;
  font-size: 10px;
  color: #94a3b8;
}

.col-risk {
  color: #d97706;
  font-weight: 600;
}

.pm-val {
  font-size: 11px;
  color: #475569;
}

.back-btn {
  width: 100%;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #1a252f;
}
</style>
