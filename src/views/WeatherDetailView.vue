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
      return { text: '매우 좋음', class: 'pill-success' }
    case 2:
      return { text: '좋음', class: 'pill-success' }
    case 3:
      return { text: '보통', class: 'pill-info' }
    case 4:
      return { text: '나쁨 (주의)', class: 'pill-warning' }
    case 5:
      return { text: '매우 나쁨 (경보)', class: 'pill-danger' }
    default:
      return { text: '보통', class: 'pill-info' }
  }
})
</script>

<template>
  <div class="cal-detail-container">
    <div v-if="complex" class="detail-content">
      <!-- 1. 기본 관제 정보 카드 (Cal.com Surface-Card) -->
      <div class="cal-card-box">
        <div class="card-header-row">
          <div class="header-titles">
            <span class="eyebrow-tag">PLANT PRECISION MONITOR</span>
            <h3 class="plant-title">{{ complex.fullName }}</h3>
          </div>
          <span class="industry-badge">{{ complex.industry }}</span>
        </div>

        <div class="metric-grid-4">
          <div class="grid-cell">
            <span class="cell-label">현재 기온</span>
            <strong class="cell-val">{{ configStore.formatTemp(complex.temp) }}</strong>
            <span class="cell-sub">체감 {{ configStore.formatTemp(complex.feels_like) }}</span>
          </div>
          <div class="grid-cell highlight-cell">
            <span class="cell-label">{{ complex.metricLabel || '공정 위험 지표' }}</span>
            <strong class="cell-val risk-color">{{ complex.processRiskText }}</strong>
            <span class="cell-sub">특화 지표</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">대기 습도</span>
            <strong class="cell-val">{{ complex.humidity }}%</strong>
            <span class="cell-sub">기압 {{ complex.pressure }}hPa</span>
          </div>
          <div class="grid-cell">
            <span class="cell-label">풍속 / 풍향</span>
            <strong class="cell-val">{{ complex.wind }}m/s</strong>
            <span class="cell-sub">실시간 풍향</span>
          </div>
        </div>
      </div>

      <!-- 2. 24시간 시간대별 기온 예보 타임라인 (OpenWeatherMap /forecast) -->
      <div class="cal-card-box">
        <div class="section-top-row">
          <h4 class="section-heading">🕒 향후 24시간 기온 및 날씨 예보 타임라인</h4>
          <span class="sub-caption">3시간 단위 예보</span>
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
        <p v-else class="loading-text">24시간 예보 데이터를 불러오는 중입니다...</p>
      </div>

      <!-- 3. 실시간 대기질(AQI) 및 미세먼지 정밀 분석 (OpenWeatherMap /air_pollution) -->
      <div class="cal-card-box">
        <div class="section-top-row">
          <h4 class="section-heading">🌿 대기질 환경 및 미세먼지 정밀 관측</h4>
          <span class="cal-level-pill" :class="aqiInfo.class">{{ aqiInfo.text }}</span>
        </div>

        <div class="aqi-grid-2">
          <div class="aqi-card">
            <span class="aqi-title">초미세먼지 (PM2.5)</span>
            <strong class="aqi-value" :class="{ 'text-warn': complex.pm25 > 35 }">
              {{ complex.pm25 }} μg/㎥
            </strong>
            <span class="aqi-desc">{{ complex.pm25 > 35 ? '클린룸 차압 주의' : '정상 범위' }}</span>
          </div>
          <div class="aqi-card">
            <span class="aqi-title">미세먼지 (PM10)</span>
            <strong class="aqi-value">{{ complex.pm10 }} μg/㎥</strong>
            <span class="aqi-desc">{{ complex.pm10 > 80 ? '고농도 주의' : '보통' }}</span>
          </div>
        </div>
      </div>

      <!-- 4. 과거 재해 이력 분석 (Mock-up) -->
      <div class="cal-card-box incident-box">
        <div class="incident-header">
          <h4 class="incident-heading">🚨 과거 기상 재해 분석 백서 (교육 및 실습용 목업)</h4>
          <span class="loss-tag">{{ complex.incident.loss }}</span>
        </div>
        <p class="inc-main-title">
          <strong>{{ complex.incident.title }}</strong> ({{ complex.incident.year }}년)
        </p>
        <p class="inc-line"><strong>사고 원인:</strong> {{ complex.incident.cause }}</p>
        <p class="inc-line">
          <strong>표준 방어 대책:</strong> {{ complex.incident.preventAction }}
        </p>
      </div>

      <!-- 5. 현장 안전 표준 작업 절차 (SOP) 체크리스트 -->
      <div class="cal-card-box">
        <div class="checklist-top-row">
          <h4 class="section-heading">📋 현장 표준 안전 대응 절차 (SOP) 체크리스트</h4>
          <span class="progress-pill">완료율 {{ progress }}%</span>
        </div>

        <!-- 커스텀 프로그레스 바 -->
        <div class="progress-rail">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>

        <div class="checklist-body">
          <label v-for="chk in complex.sopChecklist" :key="chk.id" class="check-item-row">
            <input
              type="checkbox"
              :checked="alertStore.isChecklistDone(chk.id)"
              @change="alertStore.toggleChecklistItem(chk.id)"
              class="cal-checkbox"
            />
            <span :class="{ 'text-done': alertStore.isChecklistDone(chk.id) }">{{ chk.text }}</span>
          </label>
        </div>
      </div>

      <button class="cal-btn-back" @click="router.push('/')">← 대시보드로 복귀</button>
    </div>

    <div v-else class="not-found-box">
      <p>⚠️ 해당 산업단지 정보를 찾을 수 없습니다.</p>
      <button class="cal-btn-back" @click="router.push('/')">대시보드로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.cal-detail-container {
  width: 100%;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cal-card-box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.plant-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #111111;
}

.industry-badge {
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
  background: #f3f4f6;
  padding: 3px 8px;
  border-radius: 6px;
}

.metric-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.grid-cell {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
}

.grid-cell .cell-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 2px;
}

.grid-cell .cell-val {
  font-size: 13px;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.3px;
}

.grid-cell .cell-sub {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
}

.risk-color {
  color: #d97706 !important;
}

.section-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-heading {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.3px;
}

.sub-caption {
  font-size: 11px;
  color: #9ca3af;
}

.forecast-rail {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.forecast-item {
  min-width: 60px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.fc-time {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
}

.fc-icon {
  width: 26px;
  height: 26px;
}

.fc-temp {
  font-size: 11px;
  color: #111111;
  font-weight: 600;
}

.fc-pop {
  font-size: 9px;
  color: #2563eb;
  font-weight: 700;
}

.loading-text {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.aqi-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.aqi-card {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}

.aqi-title {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 2px;
}

.aqi-value {
  font-size: 15px;
  font-weight: 700;
  color: #111111;
}

.aqi-value.text-warn {
  color: #dc2626;
}

.aqi-desc {
  font-size: 10px;
  color: #059669;
  font-weight: 600;
  margin-top: 2px;
}

.cal-level-pill {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}

.pill-success {
  background: #d1fae5;
  color: #059669;
}

.pill-info {
  background: #eff6ff;
  color: #2563eb;
}

.pill-warning {
  background: #fef3c7;
  color: #d97706;
}

.pill-danger {
  background: #fee2e2;
  color: #dc2626;
}

.incident-box {
  background: #fffafa;
  border-color: #fecaca;
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.incident-heading {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #dc2626;
}

.loss-tag {
  background: #fee2e2;
  color: #b91c1c;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
}

.inc-main-title {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #111111;
}

.inc-line {
  margin: 0 0 4px 0;
  font-size: 11px;
  color: #4b5563;
  line-height: 1.4;
}

.checklist-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-pill {
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 9999px;
}

.progress-rail {
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: #111111;
  transition: width 0.3s ease;
}

.checklist-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
}

.cal-checkbox {
  accent-color: #111111;
  cursor: pointer;
}

.text-done {
  text-decoration: line-through;
  color: #9ca3af;
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

.not-found-box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}
</style>
