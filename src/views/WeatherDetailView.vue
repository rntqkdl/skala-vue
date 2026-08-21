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
      return { text: '매우 좋음', color: 'green' }
    case 2:
      return { text: '좋음', color: 'cyan' }
    case 3:
      return { text: '보통', color: 'blue' }
    case 4:
      return { text: '나쁨 (주의)', color: 'orange' }
    case 5:
      return { text: '매우 나쁨 (경보)', color: 'red' }
    default:
      return { text: '보통', color: 'blue' }
  }
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 {{ complex.name }} 정밀 기상 및 공정 관제</h3>
    <hr />

    <div v-if="complex" class="detail-content">
      <!-- 1. 기본 관제 정보 카드 -->
      <a-card class="info-card">
        <div class="card-header-row">
          <h4>📍 {{ complex.fullName }}</h4>
          <a-tag color="geekblue">{{ complex.industry }}</a-tag>
        </div>

        <div class="grid-metrics">
          <div class="metric-box">
            <span class="label">현재 기온</span>
            <strong>{{ configStore.formatTemp(complex.temp) }}</strong>
            <small>체감 {{ configStore.formatTemp(complex.feels_like) }}</small>
          </div>
          <div class="metric-box">
            <span class="label">{{ complex.metricLabel || '공정 위험 지표' }}</span>
            <strong class="highlight-warn">{{ complex.processRiskText }}</strong>
            <small>공정별 특화 지표</small>
          </div>
          <div class="metric-box">
            <span class="label">대기 습도</span>
            <strong>{{ complex.humidity }}%</strong>
            <small>기압 {{ complex.pressure }}hPa</small>
          </div>
          <div class="metric-box">
            <span class="label">풍속 및 풍향</span>
            <strong>{{ complex.wind }}m/s</strong>
            <small>실시간 관측</small>
          </div>
        </div>
      </a-card>

      <!-- 2. 24시간 시간대별 기온 예보 타임라인 (OpenWeatherMap /forecast) -->
      <a-card class="section-card">
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
            <span v-if="fc.pop > 0" class="fc-pop">💧{{ fc.pop }}%</span>
          </div>
        </div>
        <p v-else class="loading-forecast">24시간 예보 데이터를 불러오는 중입니다...</p>
      </a-card>

      <!-- 3. 실시간 대기질(AQI) 및 미세먼지 정밀 분석 (OpenWeatherMap /air_pollution) -->
      <a-card class="section-card">
        <div class="section-title-row">
          <h5>🌿 대기질 환경 및 미세먼지 정밀 관측</h5>
          <a-tag :color="aqiInfo.color">{{ aqiInfo.text }}</a-tag>
        </div>

        <div class="aqi-grid">
          <div class="aqi-item">
            <span class="aqi-sub">초미세먼지 (PM2.5)</span>
            <span class="aqi-num" :class="{ 'num-warn': complex.pm25 > 35 }"
              >{{ complex.pm25 }} μg/㎥</span
            >
            <span class="aqi-status">{{ complex.pm25 > 35 ? '클린룸 차압 주의' : '정상' }}</span>
          </div>
          <div class="aqi-item">
            <span class="aqi-sub">미세먼지 (PM10)</span>
            <span class="aqi-num">{{ complex.pm10 }} μg/㎥</span>
            <span class="aqi-status">{{ complex.pm10 > 80 ? '나쁨' : '보통' }}</span>
          </div>
        </div>
      </a-card>

      <!-- 4. 과거 재해 이력 분석 (Mock-up) -->
      <a-card class="incident-card">
        <h5>🚨 과거 기상 재해 분석 백서 (교육 및 실습용 목업)</h5>
        <div class="incident-row">
          <span class="inc-title"
            ><strong>{{ complex.incident.title }}</strong> ({{ complex.incident.year }})</span
          >
          <a-tag color="red">{{ complex.incident.loss }}</a-tag>
        </div>
        <p class="inc-cause"><strong>사고 원인:</strong> {{ complex.incident.cause }}</p>
        <p class="inc-action">
          <strong>표준 방어 대책:</strong> {{ complex.incident.preventAction }}
        </p>
      </a-card>

      <!-- 5. 현장 안전 표준 작업 절차 (SOP) 체크리스트 -->
      <a-card class="checklist-card">
        <div class="check-header">
          <h5>📋 현장 표준 안전 대응 절차 (SOP) 체크리스트</h5>
          <span class="progress-badge">진행률: {{ progress }}%</span>
        </div>

        <!-- Ant Design Progress Bar -->
        <a-progress
          :percent="progress"
          :status="progress === 100 ? 'success' : 'active'"
          class="progress-bar-antd"
        />

        <div class="checklist-items">
          <label v-for="chk in complex.sopChecklist" :key="chk.id" class="check-item">
            <input
              type="checkbox"
              :checked="alertStore.isChecklistDone(chk.id)"
              @change="alertStore.toggleChecklistItem(chk.id)"
            />
            <span :class="{ 'done-text': alertStore.isChecklistDone(chk.id) }">{{ chk.text }}</span>
          </label>
        </div>
      </a-card>

      <button class="back-btn" @click="router.push('/')">← 대시보드로 복귀</button>
    </div>

    <div v-else class="not-found">
      <p>⚠️ 해당 산업단지 정보를 찾을 수 없습니다.</p>
      <button class="back-btn" @click="router.push('/')">대시보드로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  width: 600px;
  margin: 0 auto;
  background: white;
  padding: 22px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.15rem;
  color: #2c3e50;
  font-weight: 700;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin-bottom: 16px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-card,
.section-card,
.incident-card,
.checklist-card {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header-row h4 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
  font-weight: 700;
}

.grid-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metric-box {
  background: #f8fafc;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
}

.metric-box .label {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 2px;
}

.metric-box strong {
  font-size: 14px;
  color: #1e293b;
}

.metric-box small {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 2px;
}

.highlight-warn {
  color: #d97706 !important;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-title-row h5 {
  margin: 0;
  font-size: 12px;
  color: #1e293b;
  font-weight: 700;
}

.sub-desc {
  font-size: 10px;
  color: #94a3b8;
}

.forecast-rail {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.forecast-item {
  min-width: 58px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.fc-time {
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
}

.fc-icon {
  width: 28px;
  height: 28px;
}

.fc-temp {
  font-size: 11px;
  color: #1e293b;
}

.fc-pop {
  font-size: 9px;
  color: #3b82f6;
  font-weight: bold;
}

.aqi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.aqi-item {
  background: #f8fafc;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.aqi-sub {
  font-size: 10px;
  color: #64748b;
}

.aqi-num {
  font-size: 13px;
  font-weight: bold;
  color: #1e293b;
  margin: 2px 0;
}

.num-warn {
  color: #ef4444;
}

.aqi-status {
  font-size: 10px;
  color: #059669;
  font-weight: 600;
}

.incident-card h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #dc2626;
  font-weight: 700;
}

.incident-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.inc-title {
  font-size: 12px;
  color: #1e293b;
}

.inc-cause,
.inc-action {
  margin: 4px 0;
  font-size: 11px;
  line-height: 1.4;
  color: #334155;
}

.check-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.check-header h5 {
  margin: 0;
  font-size: 12px;
  color: #1e293b;
  font-weight: 700;
}

.progress-badge {
  font-size: 11px;
  color: #2563eb;
  font-weight: bold;
}

.progress-bar-antd {
  margin-bottom: 10px;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #334155;
  cursor: pointer;
  padding: 4px 0;
}

.done-text {
  text-decoration: line-through;
  color: #94a3b8;
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
