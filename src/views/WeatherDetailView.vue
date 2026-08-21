<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { useAlertStore } from '@/stores/alertStore'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const alertStore = useAlertStore()

// 동적 파라미터 (:cityId)
const cityId = computed(() => route.params.cityId || 'city_01')
const complex = computed(() => weatherStore.getComplexById(cityId.value))

// 산단별 체크리스트 진행률
const progress = computed(() => {
  if (!complex.value) return 0
  return alertStore.getChecklistProgress(complex.value)
})

onMounted(async () => {
  if (weatherStore.complexes.length === 0) {
    await weatherStore.fetchLiveWeatherData()
  }
  if (complex.value) {
    await weatherStore.fetchComplexForecast(complex.value.id)
  }
})

// 파라미터 변경 시 예보 동기화
watch(
  () => route.params.cityId,
  async (newId) => {
    if (newId && complex.value) {
      await weatherStore.fetchComplexForecast(complex.value.id)
    }
  },
)

const handleCheckToggle = (id) => {
  alertStore.toggleChecklistItem(id)
  if (alertStore.isChecklistDone(id)) {
    ElMessage.success({ message: '점검 항목이 완료 처리되었습니다.', duration: 1500 })
  }
}

// 대기질 AQI 등급 텍스트 및 클래스
const aqiInfo = computed(() => {
  const aqi = complex.value?.aqi || 2
  switch (aqi) {
    case 1:
      return { text: '매우 좋음', class: 'badge-mint' }
    case 2:
      return { text: '좋음', class: 'badge-mint' }
    case 3:
      return { text: '보통', class: 'badge-yellow' }
    case 4:
      return { text: '나쁨', class: 'badge-warning' }
    case 5:
      return { text: '매우 나쁨', class: 'badge-coral' }
    default:
      return { text: '보통', class: 'badge-blue' }
  }
})
</script>

<template>
  <div class="resend-detail-view">
    <div v-if="complex" class="detail-content">
      <!-- 1. 기본 관제 정보 카드 (Ant Design Descriptions in Resend Card) -->
      <div class="resend-card">
        <div class="card-header-row">
          <div>
            <span class="eyebrow-tag">산단 기상 관측 모니터 // {{ (complex.id || 'CITY').toUpperCase() }}</span>
            <h2 class="plant-title">{{ complex.fullName || complex.name }}</h2>
          </div>
          <span class="industry-chip">{{ complex.industry }}</span>
        </div>

        <a-descriptions bordered size="middle" :column="{ xs: 1, sm: 2, md: 4 }" style="margin-top: 16px;">
          <a-descriptions-item label="현재 기온">
            <strong style="color: var(--colors-ink);">{{ configStore.formatTemp(complex.temp) }}</strong>
            <small style="color: var(--colors-ash); margin-left: 4px;">
              (체감 {{ configStore.formatTemp(complex.feels_like) }})
            </small>
          </a-descriptions-item>
          <a-descriptions-item label="공정 위험도">
            <span style="color: var(--colors-accent-orange); font-weight: 600; font-family: var(--font-mono);">
              {{ complex.processRiskText || '+7.5μm' }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="습도 / 기압">
            {{ complex.humidity }}% ({{ complex.pressure || 1013 }}hPa)
          </a-descriptions-item>
          <a-descriptions-item label="풍속 / 초미세먼지">
            {{ complex.wind }}m/s / {{ complex.pm25 }}μg
          </a-descriptions-item>
        </a-descriptions>
      </div>

      <!-- 2. 24시간 시간대별 기온 예보 타임라인 (Code-Window Style) -->
      <div class="code-window">
        <div class="traffic-light-bar">
          <span class="traffic-dot dot-red"></span>
          <span class="traffic-dot dot-yellow"></span>
          <span class="traffic-dot dot-green"></span>
          <span class="code-window-title">향후 24시간 3시간 간격 기상 예보</span>
        </div>

        <div class="section-top-row">
          <h4 class="section-heading">🕒 향후 24시간 기온 및 날씨 예보 타임라인</h4>
          <span class="sub-caption">3시간 간격 정밀 수치 예보</span>
        </div>

        <div v-if="complex.forecast && complex.forecast.length > 0" class="timeline-container">
          <a-timeline mode="left">
            <a-timeline-item
              v-for="(fc, idx) in complex.forecast"
              :key="idx"
              :color="fc.temp >= 30 ? 'red' : fc.temp >= 24 ? 'orange' : 'blue'"
            >
              <div class="forecast-timeline-entry">
                <span class="fc-time-label font-mono">{{ fc.time }}</span>
                <img
                  :src="`https://openweathermap.org/img/wn/${fc.icon}.png`"
                  alt="예보"
                  class="fc-small-icon"
                />
                <strong class="fc-temp-text">{{ configStore.formatTemp(fc.temp) }}</strong>
                <span v-if="fc.pop > 0" class="resend-badge badge-blue">💧 강수확률 {{ fc.pop }}%</span>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
        <p v-else class="loading-text font-mono">📡 24시간 시간대별 예보 데이터를 동기화하는 중입니다...</p>
      </div>

      <!-- 3. 실시간 대기질(AQI) 및 미세먼지 정밀 분석 -->
      <div class="resend-card">
        <div class="section-top-row">
          <h4 class="section-heading">🌿 대기질 환경 및 미세먼지 정밀 관측</h4>
          <span class="resend-badge" :class="aqiInfo.class">AQI: {{ aqiInfo.text }}</span>
        </div>

        <div class="aqi-grid-2">
          <div class="aqi-card">
            <span class="aqi-title">초미세먼지 (PM2.5)</span>
            <strong class="aqi-value" :class="{ 'text-warn': complex.pm25 > 35 }">
              {{ complex.pm25 }} μg/㎥
            </strong>
            <span class="aqi-desc">{{ complex.pm25 > 35 ? '클린룸 차압 주의 (필터 점검 권고)' : '정상 범위 (공조 안정)' }}</span>
          </div>
          <div class="aqi-card">
            <span class="aqi-title">미세먼지 (PM10)</span>
            <strong class="aqi-value">{{ complex.pm10 }} μg/㎥</strong>
            <span class="aqi-desc">{{ complex.pm10 > 80 ? '고농도 주의' : '대기 환경 보통' }}</span>
          </div>
        </div>
      </div>

      <!-- 4. 과거 재해 이력 분석 (Element Plus Collapse) -->
      <div class="resend-card">
        <div class="incident-header">
          <h4 class="section-heading">🚨 과거 기상 재해 분석 백서 및 방어 메커니즘</h4>
          <span class="resend-badge badge-coral">{{ complex.incident?.loss || '예방 관제 대상' }}</span>
        </div>

        <el-collapse class="custom-el-collapse">
          <el-collapse-item name="1">
            <template #title>
              <strong>{{ complex.incident?.title || '기상 연동 표준 공정 관리' }} ({{ complex.incident?.year || '2024년 사례' }})</strong>
            </template>
            <div class="collapse-content">
              <p><strong>사고 원인:</strong> {{ complex.incident?.cause || '외기온 상승에 따른 설비 열화 및 이상 기상 부하' }}</p>
              <p><strong>표준 방어 대책:</strong> {{ complex.incident?.preventAction || '실시간 기상 연동 공조 자동 제어 및 보정 계수 적용' }}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 5. 현장 안전 표준 작업 절차 (SOP) 체크리스트 -->
      <div class="resend-card">
        <div class="checklist-top-row">
          <h4 class="section-heading">📋 현장 표준 안전 대응 절차 (SOP) 체크리스트</h4>
          <div class="progress-wrapper-small">
            <el-progress
              type="circle"
              :percentage="progress"
              :width="54"
              :stroke-width="5"
              :status="progress === 100 ? 'success' : undefined"
            />
          </div>
        </div>

        <div class="checklist-body">
          <label v-for="chk in (complex.sopChecklist || [])" :key="chk.id" class="check-item-row">
            <input
              type="checkbox"
              :checked="alertStore.isChecklistDone(chk.id)"
              @change="handleCheckToggle(chk.id)"
              class="resend-checkbox"
            />
            <span :class="{ 'text-done': alertStore.isChecklistDone(chk.id) }">{{ chk.text }}</span>
          </label>
        </div>
      </div>

      <div class="bottom-action-row">
        <button class="btn-secondary" @click="router.push('/')">← 대시보드로 복귀</button>
      </div>
    </div>

    <div v-else class="not-found-box resend-card">
      <el-empty description="해당 산업단지 정보를 찾을 수 없습니다." />
      <button class="btn-primary" @click="router.push('/')">대시보드로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.resend-detail-view {
  width: 100%;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.eyebrow-tag {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #a1a4a5);
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 4px;
}

.plant-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 400;
  color: var(--colors-ink, #fcfdff);
}

.industry-chip {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #a1a4a5);
  background: var(--colors-surface-elevated, #101012);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.08));
  padding: 3px 8px;
  border-radius: var(--rounded-xs, 4px);
}

.section-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-heading {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
}

.sub-caption {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #a1a4a5);
}

.timeline-container {
  padding: 10px 0;
}

.forecast-timeline-entry {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fc-time-label {
  font-size: 12px;
  color: var(--colors-ink, #fcfdff);
  min-width: 50px;
}

.fc-small-icon {
  width: 24px;
  height: 24px;
}

.fc-temp-text {
  font-size: 14px;
  color: var(--colors-ink, #fcfdff);
  min-width: 60px;
}

.loading-text {
  font-size: 12px;
  color: var(--colors-mute, #a1a4a5);
  padding: 12px 0;
}

.aqi-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.aqi-card {
  background: var(--colors-surface-deep, #06060a);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.06));
  border-radius: var(--rounded-md, 8px);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
}

.aqi-title {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #a1a4a5);
}

.aqi-value {
  font-size: 18px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
  margin: 4px 0;
}

.aqi-value.text-warn {
  color: var(--colors-accent-orange, #ff801f);
}

.aqi-desc {
  font-size: 11px;
  color: var(--colors-ash, #888e90);
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.collapse-content {
  font-size: 13px;
  line-height: 1.5;
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
}

.checklist-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.checklist-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.check-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--colors-body, rgba(252, 253, 255, 0.86));
  cursor: pointer;
}

.resend-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #ffffff;
  cursor: pointer;
}

.text-done {
  text-decoration: line-through;
  color: var(--colors-stone, #464a4d);
}

.bottom-action-row {
  margin-top: 16px;
}

.not-found-box {
  text-align: center;
  padding: 48px;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
