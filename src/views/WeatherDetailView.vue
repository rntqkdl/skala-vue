<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { useAlertStore } from '@/stores/alertStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const alertStore = useAlertStore()

const cityId = computed(() => route.params.cityId)
const complex = computed(() => weatherStore.getComplexById(cityId.value))

// 산단별 체크리스트 진행률
const progress = computed(() => alertStore.getChecklistProgress(complex.value))

onMounted(async () => {
  if (complex.value) {
    // 24시간 시간대별 예보 호출
    await weatherStore.fetchComplexForecast(complex.value.id)
  }
})

// 대기질 AQI 등급 텍스트 및 클래스
const aqiInfo = computed(() => {
  const aqi = complex.value?.aqi || 2
  switch (aqi) {
    case 1:
      return { text: '매우 좋음', class: 'aqi-good' }
    case 2:
      return { text: '좋음', class: 'aqi-good' }
    case 3:
      return { text: '보통', class: 'aqi-moderate' }
    case 4:
      return { text: '나쁨 (주의)', class: 'aqi-bad' }
    case 5:
      return { text: '매우 나쁨 (경보)', class: 'aqi-danger' }
    default:
      return { text: '보통', class: 'aqi-moderate' }
  }
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 {{ complex.name }} 정밀 기상 및 공정 관제</h3>
    <hr />

    <div v-if="complex" class="detail-content">
      <!-- 1. 기본 관제 정보 카드 -->
      <div class="info-card">
        <div class="card-header-row">
          <h4>📍 {{ complex.fullName }}</h4>
          <span class="industry-tag">{{ complex.industry }}</span>
        </div>

        <div class="grid-metrics">
          <div class="metric-box">
            <span class="label">현재 기온</span>
            <strong>{{ configStore.formatTemp(complex.temp) }}</strong>
            <small>체감 {{ configStore.formatTemp(complex.feels_like) }}</small>
          </div>
          <div class="metric-box">
            <span class="label">열변형 오차</span>
            <strong class="highlight-warn">+{{ complex.expansionRate }}μm</strong>
            <small>기준 공차: ±5.0μm</small>
          </div>
          <div class="metric-box">
            <span class="label">대기 습도</span>
            <strong>{{ complex.humidity }}%</strong>
            <small>기압 {{ complex.pressure }}hPa</small>
          </div>
          <div class="metric-box">
            <span class="label">풍속 / 풍향</span>
            <strong>{{ complex.wind }}m/s</strong>
            <small>실시간 관측</small>
          </div>
        </div>
      </div>

      <!-- 2. 24시간 시간대별 기온 예보 타임라인 (OpenWeatherMap /forecast) -->
      <div class="section-card">
        <div class="section-title-row">
          <h5>🕒 향후 24시간 기온 및 날씨 예보 타임라인</h5>
          <span class="sub-desc">3시간 단위 OpenWeather 예보</span>
        </div>
        <div v-if="complex.forecast && complex.forecast.length > 0" class="forecast-rail">
          <div v-for="(fc, idx) in complex.forecast" :key="idx" class="forecast-item">
            <span class="fc-time">{{ fc.time }}</span>
            <img
              :src="`https://openweathermap.org/img/wn/${fc.icon}.png`"
              alt="예보"
              class="fc-icon"
            />
            <strong class="fc-temp">{{ configStore.formatTemp(fc.temp) }}</strong>
            <span class="fc-pop" v-if="fc.pop > 0">💧{{ fc.pop }}%</span>
          </div>
        </div>
        <div v-else class="empty-forecast">예보 데이터를 수신 중입니다...</div>
      </div>

      <!-- 3. 실시간 대기오염 및 미세먼지(AQI) 관제 (OpenWeatherMap /air_pollution) -->
      <div class="section-card">
        <h5>🌿 실시간 대기질 및 미세먼지 환경 지표</h5>
        <div class="pollution-row">
          <div class="aqi-badge-box" :class="aqiInfo.class">
            <span class="aqi-title">통합 대기질 (AQI)</span>
            <strong class="aqi-val">{{ aqiInfo.text }}</strong>
          </div>
          <div class="pollution-metrics">
            <p>
              초미세먼지 (PM2.5): <strong>{{ complex.pm25 }} μg/㎥</strong> (기준: 35 이하)
            </p>
            <p>
              미세먼지 (PM10): <strong>{{ complex.pm10 }} μg/㎥</strong> (기준: 80 이하)
            </p>
          </div>
        </div>
      </div>

      <!-- 4. 과거 실제 기상 재해 및 공장 피해 사례 분석 배너 -->
      <div class="incident-banner">
        <div class="banner-header">
          <span class="incident-badge">⚠️ 과거 실제 기상 재해 이력 분석</span>
          <span class="incident-year">{{ complex.incident.year }}</span>
        </div>
        <h5 class="incident-title">{{ complex.incident.title }}</h5>
        <p class="incident-loss"><strong>피해 규모:</strong> {{ complex.incident.loss }}</p>
        <p class="incident-cause"><strong>사고 원인:</strong> {{ complex.incident.cause }}</p>
        <div class="incident-prevention">
          <strong>💡 시스템 사전 권고 조치:</strong> {{ complex.incident.preventAction }}
        </div>
      </div>

      <!-- 5. 현장 안전 SOP 체크리스트 (인터랙션) -->
      <div class="section-card checklist-card">
        <div class="checklist-header">
          <h5>📋 재해 예방 현장 표준 대응 절차 (SOP)</h5>
          <span class="progress-tag"
            >조치율: {{ progress.completed }}/{{ progress.total }} ({{ progress.percent }}%)</span
          >
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: `${progress.percent}%` }"></div>
        </div>
        <ul class="checklist-items">
          <li
            v-for="item in complex.sopChecklist"
            :key="item.id"
            class="check-row"
            :class="{ active: alertStore.checklistState[complex.id]?.[item.id] }"
            @click="alertStore.toggleChecklist(complex.id, item.id)"
          >
            <input
              type="checkbox"
              :checked="alertStore.checklistState[complex.id]?.[item.id]"
              @click.stop="alertStore.toggleChecklist(complex.id, item.id)"
            />
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>
    </div>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
  width: 600px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.15rem;
  color: #2c3e50;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin-bottom: 15px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.info-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header-row h4 {
  margin: 0;
  font-size: 1.05rem;
  color: #2c3e50;
}

.industry-tag {
  font-size: 12px;
  color: #636e72;
  font-weight: 500;
}

.grid-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.metric-box {
  background: white;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
}

.metric-box .label {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 2px;
}

.metric-box strong {
  font-size: 18px;
  color: #2c3e50;
}

.metric-box strong.highlight-warn {
  color: #e74c3c;
}

.metric-box small {
  font-size: 11px;
  color: #95a5a6;
  margin-top: 2px;
}

.section-card {
  background: #fdfdfd;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 14px;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-card h5 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #2c3e50;
}

.sub-desc {
  font-size: 11px;
  color: #8395a7;
}

.forecast-rail {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.forecast-item {
  flex: 0 0 62px;
  background: #f1f2f6;
  border: 1px solid #dfe4ea;
  border-radius: 6px;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11px;
}

.fc-time {
  font-weight: 600;
  color: #576574;
}

.fc-icon {
  width: 32px;
  height: 32px;
}

.fc-temp {
  color: #2c3e50;
  font-size: 13px;
}

.fc-pop {
  font-size: 10px;
  color: #3498db;
}

.empty-forecast {
  text-align: center;
  font-size: 12px;
  color: #95a5a6;
  padding: 15px 0;
}

.pollution-row {
  display: flex;
  gap: 15px;
  align-items: center;
}

.aqi-badge-box {
  padding: 8px 14px;
  border-radius: 6px;
  text-align: center;
  min-width: 90px;
}

.aqi-title {
  display: block;
  font-size: 10px;
  opacity: 0.85;
}

.aqi-val {
  font-size: 14px;
  font-weight: bold;
}

.aqi-good {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.aqi-moderate {
  background-color: #fff3e0;
  color: #e65100;
  border: 1px solid #ffe0b2;
}

.aqi-bad {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.aqi-danger {
  background-color: #d63031;
  color: white;
}

.pollution-metrics p {
  margin: 3px 0;
  font-size: 12px;
  color: #495057;
}

.incident-banner {
  background: #fff5f5;
  border: 1px solid #ffc9c9;
  border-radius: 6px;
  padding: 14px;
}

.banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.incident-badge {
  background: #e03131;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.incident-year {
  font-size: 11px;
  color: #c92a2a;
  font-weight: bold;
}

.incident-title {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #c92a2a;
  font-weight: 700;
}

.incident-loss,
.incident-cause {
  margin: 3px 0;
  font-size: 12px;
  color: #495057;
}

.incident-prevention {
  margin-top: 8px;
  padding: 6px 8px;
  background: #ffffff;
  border-radius: 4px;
  border-left: 3px solid #e03131;
  font-size: 12px;
  color: #2d3436;
}

.checklist-card {
  background: #f8fbfd;
  border-color: #cbe0f0;
}

.checklist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.progress-tag {
  font-size: 11px;
  font-weight: bold;
  color: #0984e3;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: #e1edf7;
  border-radius: 3px;
  margin-bottom: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #0984e3;
  transition: width 0.3s ease;
}

.checklist-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  background: white;
  border: 1px solid #e2edf6;
  font-size: 12px;
  color: #334155;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.check-row:hover {
  background: #edf5fc;
}

.check-row.active {
  background: #e8f4fd;
  color: #0984e3;
  font-weight: 600;
}

.back-btn {
  width: 100%;
  padding: 10px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #1a252f;
}
</style>
