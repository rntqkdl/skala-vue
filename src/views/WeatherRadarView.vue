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
  precipitation_new: '🌧️ 실시간 강우 레이더',
  temp_new: '🌡️ 실시간 기온 열지도',
  clouds_new: '☁️ 실시간 구름 위성',
  wind_new: '💨 실시간 풍속 레이더',
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
      <button
        class="btn-refresh"
        @click="weatherStore.fetchLiveWeatherData(true)"
        :disabled="weatherStore.isLoading"
      >
        {{ weatherStore.isLoading ? '통신 중...' : '🔄 레이더 갱신' }}
      </button>
    </div>
    <hr />

    <!-- 1. 24시간 최고 기온(피크) 및 열변형 사전 예방 알림 배너 -->
    <div class="peak-banner">
      <div class="peak-header">
        <span class="peak-badge">⚠️ 24시간 피크 예측 알림</span>
        <span class="peak-sub">OpenWeather 3시간 단위 예보 연산</span>
      </div>
      <p class="peak-desc">
        <strong>{{ weatherStore.peakWarning.time }}</strong> 기준
        <strong>{{ weatherStore.peakWarning.complexName }}</strong
        >이 최고 <strong>{{ configStore.formatTemp(weatherStore.peakWarning.temp) }}</strong
        >에 도달할 것으로 예상됩니다.
      </p>
      <div class="peak-action">
        💡 <strong>사전 조치 권고:</strong> 피크 도달 1시간 30분 전 공조 냉각 칠러 예냉 가동 및 정밀
        가공 치수 센서 영점 보정 권장
      </div>
    </div>

    <!-- 2. OpenWeatherMap 공식 기상 레이더 타일 맵 뷰어 -->
    <div class="radar-viewer-card">
      <div class="viewer-header">
        <h4>📡 한반도 실시간 기상 레이더 오버레이</h4>
        <div class="layer-btn-group">
          <button
            v-for="(label, key) in layerLabels"
            :key="key"
            class="btn-layer"
            :class="{ active: activeLayer === key }"
            @click="activeLayer = key"
          >
            {{ label }}
          </button>
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
    </div>

    <!-- 3. 전국 6대 산단 실시간 종합 지표 비교 매트릭스 표 -->
    <div class="matrix-card">
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
              <td class="col-expansion">{{ item.processRiskText || '+7.5μm' }}</td>
              <td>
                <span class="pm-val">{{ item.pm25 }} μg/㎥</span>
              </td>
              <td>
                <span v-if="item.temp >= 30" class="mini-badge bg-danger">경보</span>
                <span v-else-if="item.temp >= 24" class="mini-badge bg-warning">주의</span>
                <span v-else class="mini-badge bg-success">정상</span>
              </td>
              <td>
                <button class="btn-table-jump" @click="goToDetail(item.id)">이동 →</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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

.btn-refresh {
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-refresh:hover {
  background-color: #2980b9;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin-bottom: 16px;
}

.peak-banner {
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 16px;
}

.peak-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.peak-badge {
  background: #f39c12;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.peak-sub {
  font-size: 11px;
  color: #8d6e63;
}

.peak-desc {
  margin: 4px 0;
  font-size: 13px;
  color: #2c3e50;
  line-height: 1.5;
}

.peak-desc strong {
  color: #d35400;
}

.peak-action {
  margin-top: 8px;
  padding: 6px 8px;
  background: #ffffff;
  border-radius: 4px;
  border-left: 3px solid #f39c12;
  font-size: 12px;
  color: #333;
}

.radar-viewer-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 16px;
}

.viewer-header {
  margin-bottom: 10px;
}

.viewer-header h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #2c3e50;
  font-weight: 700;
}

.layer-btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-layer {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-layer.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
  font-weight: bold;
}

.radar-map-display {
  position: relative;
  width: 100%;
  height: 240px;
  background: #2f3640;
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
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 16px;
}

.matrix-card h4 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #2c3e50;
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
  background: #f1f2f6;
  color: #475569;
  padding: 8px 6px;
  font-weight: 600;
  border-bottom: 1px solid #dfe4ea;
  white-space: nowrap;
}

.matrix-table td {
  padding: 8px 6px;
  border-bottom: 1px solid #f1f2f6;
  color: #334155;
  white-space: nowrap;
}

.col-name {
  font-weight: 700;
  color: #2c3e50;
}

.col-industry {
  font-size: 11px;
  color: #64748b;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-temp strong {
  color: #2c3e50;
}

.col-temp small {
  display: block;
  font-size: 10px;
  color: #94a3b8;
}

.col-expansion {
  color: #d35400;
  font-weight: 600;
}

.pm-val {
  font-size: 11px;
  color: #475569;
}

.mini-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.bg-danger {
  background: #e74c3c;
}
.bg-warning {
  background: #f39c12;
}
.bg-success {
  background: #2ecc71;
}

.btn-table-jump {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 3px 6px;
  font-size: 10px;
  cursor: pointer;
  font-weight: bold;
}

.btn-table-jump:hover {
  background: #2980b9;
}

.back-btn {
  width: 100%;
  padding: 11px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #1a252f;
}
</style>
