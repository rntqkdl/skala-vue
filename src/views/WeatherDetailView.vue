<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const cityId = route.params.id

// 산단 상세 데이터 계산
const complex = computed(() => {
  return weatherStore.complexes.find((c) => c.id === cityId)
})

// SOP 체크리스트 상태
const checklist = ref([
  { id: 1, text: '설비 센서 온도 및 습도 계측치 이상 유무 확인', done: true },
  { id: 2, text: '공정별 기상 보정 파라미터 제어기 동기화', done: true },
  { id: 3, text: '위험 수치 도달 시 비상 냉각/제습 시스템 가동', done: false },
  { id: 4, text: '현장 안전 관리자 확인 서명 및 관제 로그 기록', done: false },
])

const progress = computed(() => {
  const completed = checklist.value.filter((i) => i.done).length
  return Math.round((completed / checklist.value.length) * 100)
})

// 대기질 텍스트 뱃지 매핑
const aqiInfo = computed(() => {
  const aqi = complex.value?.aqi || 2
  switch (aqi) {
    case 1: return { text: '매우 좋음 (Good)', type: 'success' }
    case 2: return { text: '보통 (Fair)', type: 'info' }
    case 3: return { text: '주의 (Moderate)', type: 'warning' }
    case 4: return { text: '나쁨 (Poor)', type: 'danger' }
    case 5: return { text: '매우 나쁨 (Very Poor)', type: 'danger' }
    default: return { text: '관측 중', type: 'info' }
  }
})

onMounted(async () => {
  if (complex.value && (!complex.value.forecast || complex.value.forecast.length === 0)) {
    await weatherStore.fetchCityForecast(complex.value)
  }
})
</script>

<template>
  <div class="apple-detail-view">
    <div v-if="complex" class="detail-container">
      <!-- 1. 상단 산단 헤더 카드 (Element Plus <el-card>) -->
      <el-card shadow="never" class="apple-ui-detail-card" :body-style="{ padding: '24px 28px' }">
        <div class="header-content-row">
          <div class="title-left">
            <h1 class="hero-editorial-headline" style="margin-bottom: 4px;">{{ complex.name }} 정밀 관제</h1>
            <span class="sub-coords font-mono">
              위도: {{ complex.lat?.toFixed(2) }}°N · 경도: {{ complex.lon?.toFixed(2) }}°E · 해발고도: {{ complex.altitude || 28 }}m
            </span>
          </div>
          <el-tag size="default" effect="plain" round class="industry-badge">
            {{ complex.industry }}
          </el-tag>
        </div>

        <a-descriptions bordered size="middle" :column="{ xs: 1, sm: 2, md: 4 }" style="margin-top: 18px;">
          <a-descriptions-item label="현재 기온">
            <strong class="desc-ink-text">{{ configStore.formatTemp(complex.temp) }}</strong>
            <small class="desc-sub-text">
              (체감 {{ configStore.formatTemp(complex.feels_like) }})
            </small>
          </a-descriptions-item>
          <a-descriptions-item label="공정 위험도">
            <span class="desc-risk-text font-mono">
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
      </el-card>

      <!-- 2. 24시간 시간대별 기온 예보 타임라인 (Element Plus <el-card>) -->
      <el-card shadow="never" class="apple-ui-detail-card" :body-style="{ padding: '24px 28px' }">
        <div class="section-top-row">
          <div>
            <h4 class="section-heading">향후 24시간 기온 및 날씨 예보 타임라인</h4>
            <span class="sub-caption font-mono">OpenWeatherMap 3시간 간격 정밀 수치 예보</span>
          </div>
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
                <el-tag v-if="fc.pop > 0" size="small" type="info" effect="light" round>
                  강수확률 {{ fc.pop }}%
                </el-tag>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
        <p v-else class="loading-text font-mono">24시간 시간대별 예보 데이터를 동기화하는 중입니다...</p>
      </el-card>

      <!-- 3. 실시간 대기질(AQI) 및 미세먼지 정밀 분석 (Element Plus <el-card>) -->
      <el-card shadow="never" class="apple-ui-detail-card" :body-style="{ padding: '24px 28px' }">
        <div class="section-top-row">
          <h4 class="section-heading">대기질 환경 및 미세먼지 정밀 관측</h4>
          <el-tag :type="aqiInfo.type" effect="light" round>AQI: {{ aqiInfo.text }}</el-tag>
        </div>

        <div class="aqi-grid-2">
          <div class="aqi-card-box">
            <span class="aqi-title">초미세먼지 (PM2.5)</span>
            <strong class="aqi-value" :class="{ 'text-warn': complex.pm25 > 35 }">
              {{ complex.pm25 }} μg/㎥
            </strong>
            <span class="aqi-desc">{{ complex.pm25 > 35 ? '클린룸 차압 주의 (필터 점검 권고)' : '정상 범위 (공조 안정)' }}</span>
          </div>
          <div class="aqi-card-box">
            <span class="aqi-title">미세먼지 (PM10)</span>
            <strong class="aqi-value">{{ complex.pm10 }} μg/㎥</strong>
            <span class="aqi-desc">{{ complex.pm10 > 80 ? '고농도 주의' : '대기 환경 보통' }}</span>
          </div>
        </div>
      </el-card>

      <!-- 4. 과거 재해 이력 분석 (Element Plus <el-card> & Collapse) -->
      <el-card shadow="never" class="apple-ui-detail-card" :body-style="{ padding: '24px 28px' }">
        <div class="incident-header">
          <h4 class="section-heading">과거 기상 재해 분석 백서 및 방어 메커니즘</h4>
          <el-tag type="danger" effect="plain" round>{{ complex.incident?.loss || '예방 관제 대상' }}</el-tag>
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
      </el-card>

      <!-- 5. 현장 안전 표준 작업 절차 (SOP) 체크리스트 -->
      <el-card shadow="never" class="apple-ui-detail-card" :body-style="{ padding: '24px 28px' }">
        <div class="checklist-top-row">
          <h4 class="section-heading">현장 표준 안전 대응 절차 (SOP) 체크리스트</h4>
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
          <label v-for="c in checklist" :key="c.id" class="check-item-row">
            <input type="checkbox" v-model="c.done" class="apple-checkbox" />
            <span :class="{ 'text-done': c.done }">{{ c.text }}</span>
          </label>
        </div>
      </el-card>

      <div class="bottom-action-row">
        <el-button size="default" round @click="router.push('/')">← 대시보드로 돌아가기</el-button>
        <el-button size="default" round @click="router.push('/alerts')">기상 특보 SOP 전체 보기 →</el-button>
      </div>
    </div>

    <!-- 산단 미발견 예외 처리 -->
    <el-card v-else shadow="never" class="not-found-box">
      <h3 style="margin-bottom: 8px;">산단 정보를 찾을 수 없습니다.</h3>
      <p style="color: var(--colors-mute); margin-bottom: 16px;">요청하신 산단 ID가 유효하지 않거나 목록에서 제거되었습니다.</p>
      <el-button type="primary" round @click="router.push('/')">대시보드로 이동</el-button>
    </el-card>
  </div>
</template>

<style scoped>
.apple-detail-view {
  width: 100%;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.apple-ui-detail-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  box-shadow: var(--shadow-apple-card);
}

[data-theme="dark"] .apple-ui-detail-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.header-content-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
}

.sub-coords {
  font-size: 12.5px;
  color: var(--colors-mute, #86868b);
}

[data-theme="dark"] .sub-coords {
  color: #a1a1a6 !important;
}

.desc-ink-text {
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .desc-ink-text {
  color: #f5f5f7 !important;
}

.desc-sub-text {
  color: var(--colors-mute, #86868b);
  margin-left: 4px;
}

.desc-risk-text {
  color: var(--colors-accent-orange, #f56300);
  font-weight: 600;
}

.section-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.section-heading {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .section-heading {
  color: #f5f5f7 !important;
}

.sub-caption {
  font-size: 12px;
  color: var(--colors-mute, #86868b);
}

[data-theme="dark"] .sub-caption {
  color: #a1a1a6 !important;
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
  font-size: 13px;
  color: var(--colors-ink, #1d1d1f);
  min-width: 50px;
}

[data-theme="dark"] .fc-time-label {
  color: #f5f5f7 !important;
}

.fc-small-icon {
  width: 24px;
  height: 24px;
}

.fc-temp-text {
  font-size: 15px;
  color: var(--colors-ink, #1d1d1f);
  min-width: 60px;
}

[data-theme="dark"] .fc-temp-text {
  color: #f5f5f7 !important;
}

.loading-text {
  font-size: 13px;
  color: var(--colors-mute, #86868b);
  padding: 12px 0;
}

.aqi-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 640px) {
  .aqi-grid-2 {
    grid-template-columns: 1fr;
  }
}

.aqi-card-box {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
}

[data-theme="dark"] .aqi-card-box {
  background: #161617;
  border-color: #272729;
}

.aqi-title {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #86868b);
}

[data-theme="dark"] .aqi-title {
  color: #a1a1a6 !important;
}

.aqi-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
  margin: 4px 0;
}

[data-theme="dark"] .aqi-value {
  color: #f5f5f7 !important;
}

.aqi-value.text-warn {
  color: var(--colors-accent-orange, #f56300);
}

.aqi-desc {
  font-size: 12px;
  color: var(--colors-charcoal, #515154);
}

[data-theme="dark"] .aqi-desc {
  color: #d2d2d7 !important;
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.collapse-content {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--colors-charcoal, #515154);
}

[data-theme="dark"] .collapse-content {
  color: #d2d2d7 !important;
}

.checklist-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
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
  font-size: 13.5px;
  color: var(--colors-body, #1d1d1f);
  cursor: pointer;
}

[data-theme="dark"] .check-item-row {
  color: #f5f5f7 !important;
}

.apple-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #0066cc;
  cursor: pointer;
}

.text-done {
  text-decoration: line-through;
  color: var(--colors-mute, #86868b);
}

.bottom-action-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.not-found-box {
  text-align: center;
  padding: 48px;
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
}
</style>
