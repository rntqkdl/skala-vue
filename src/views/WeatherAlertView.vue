<script setup>
import { useRouter } from 'vue-router'
import { useAlertStore } from '@/stores/alertStore'
import { useConfigStore } from '@/stores/configStore'

const router = useRouter()
const alertStore = useAlertStore()
const configStore = useConfigStore()

const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="apple-alert-view">
    <!-- 상단 헤더 영역 -->
    <section class="resend-hero-band">
      <div class="hero-editorial-eyebrow">
        <span class="status-dot-live"></span>
        <span>산단 기상 특보 및 긴급 안전 수칙</span>
      </div>
      <h1 class="hero-editorial-headline">기상 특보별 공정 비상 대응 절차</h1>
      <p class="hero-editorial-desc">
        과거 산업 재해 이력과 실시간 기상 관측 데이터를 대조하여 산단별 설비 파손을 사전에 방지하는 표준 작업 절차(SOP)입니다.
      </p>
    </section>

    <!-- 특보 산단 목록 (Element Plus <el-card>) -->
    <div class="guideline-list">
      <el-card
        v-for="item in alertStore.evaluatedAlerts"
        :key="item.id"
        shadow="hover"
        class="apple-ui-sop-card"
        :body-style="{ padding: '24px 26px' }"
      >
        <!-- 상단 헤더: 산단명 + 업종 + 상태 태그 -->
        <div class="alert-card-header">
          <div class="plant-meta">
            <h3 class="plant-name">{{ item.name }}</h3>
            <el-tag size="small" effect="plain" round class="industry-tag">
              {{ item.industry }}
            </el-tag>
          </div>

          <el-tag
            size="default"
            :type="item.level === 'danger' ? 'danger' : item.level === 'warning' ? 'warning' : 'success'"
            effect="light"
            round
          >
            {{ item.badge }}
          </el-tag>
        </div>

        <!-- 실시간 관측 지표 (Element Plus Row/Col Grid) -->
        <div class="telemetry-grid-card">
          <el-row :gutter="14">
            <el-col :xs="12" :sm="6">
              <div class="tele-item">
                <span class="tele-label">현재 기온 / 체감</span>
                <strong class="tele-val">{{ configStore.formatTemp(item.temp) }}</strong>
                <span class="tele-sub">체감 {{ configStore.formatTemp(item.feels_like) }}</span>
              </div>
            </el-col>

            <el-col :xs="12" :sm="6">
              <div class="tele-item">
                <span class="tele-label">습도 / 풍속</span>
                <strong class="tele-val">{{ item.humidity }}%</strong>
                <span class="tele-sub">풍속 {{ item.wind }}m/s</span>
              </div>
            </el-col>

            <el-col :xs="12" :sm="6">
              <div class="tele-item">
                <span class="tele-label">초미세먼지 (PM2.5)</span>
                <strong class="tele-val" :class="{ 'text-warn': item.pm25 > 35 }">{{ item.pm25 }} μg/㎥</strong>
                <span class="tele-sub">{{ item.pm25 > 35 ? '호흡기 주의' : '양호' }}</span>
              </div>
            </el-col>

            <el-col :xs="12" :sm="6">
              <div class="tele-item">
                <span class="tele-label">{{ item.metricLabel || '공정 위험도' }}</span>
                <strong class="tele-val text-risk">{{ item.processRiskText }}</strong>
                <span class="tele-sub">물리 파손 상관치</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 과거 재해 분석 백서 -->
        <el-card shadow="never" class="incident-card" :body-style="{ padding: '16px 18px' }">
          <div class="inc-box-header">
            <span class="inc-tag">과거 재해 이력: {{ item.incident.title }}</span>
            <el-tag size="small" type="danger" effect="plain" round>{{ item.incident.loss }}</el-tag>
          </div>
          <div class="inc-desc-rows">
            <p><strong>발생 시기:</strong> {{ item.incident.year }}</p>
            <p><strong>사고 원인:</strong> {{ item.incident.cause }}</p>
          </div>
        </el-card>

        <!-- 긴급 권고 조치 절차 (Ant Design Vue Timeline) -->
        <div class="sop-timeline-wrapper">
          <h4 class="sop-box-title">표준 긴급 대응 작업 절차 (SOP)</h4>
          <a-timeline class="custom-sop-timeline">
            <a-timeline-item color="red">
              <div class="timeline-step-content">
                <strong>1단계 (감지):</strong> 설비 센서 온도 및 습도 계측치 이상 유무 확인 후 비상 알람 전파
              </div>
            </a-timeline-item>
            <a-timeline-item color="orange">
              <div class="timeline-step-content">
                <strong>2단계 (조치):</strong> {{ item.incident.preventAction }}
              </div>
            </a-timeline-item>
            <a-timeline-item color="green">
              <div class="timeline-step-content">
                <strong>3단계 (복귀):</strong> 현장 체크리스트 전수 확인 및 수율 보존 상태 검증 후 정상 가동
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>

        <!-- 상세 페이지 이동 버튼 -->
        <el-button
          type="primary"
          round
          class="apple-primary-btn btn-full"
          @click="goToDetail(item.id)"
        >
          {{ item.name }} 정밀 관측 및 현장 점검표(SOP) 열람 →
        </el-button>
      </el-card>
    </div>

    <div class="bottom-action-row">
      <el-button size="default" round @click="router.push('/')">← 대시보드로 돌아가기</el-button>
    </div>
  </div>
</template>

<style scoped>
.apple-alert-view {
  width: 100%;
}

.guideline-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.apple-ui-sop-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  box-shadow: var(--shadow-apple-card);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.apple-ui-sop-card:hover {
  border-color: #b0b0b5;
  box-shadow: var(--shadow-apple-hover);
}

[data-theme="dark"] .apple-ui-sop-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.alert-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.plant-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.plant-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .plant-name {
  color: #f5f5f7 !important;
}

.industry-tag {
  font-size: 12px;
}

.telemetry-grid-card {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  padding: 14px 18px;
  margin-bottom: 16px;
}

[data-theme="dark"] .telemetry-grid-card {
  background: #161617;
  border-color: #272729;
}

.tele-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tele-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--colors-mute, #86868b);
  margin-bottom: 2px;
}

[data-theme="dark"] .tele-label {
  color: #a1a1a6 !important;
}

.tele-val {
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
  line-height: 1.35;
}

[data-theme="dark"] .tele-val {
  color: #f5f5f7 !important;
}

.tele-sub {
  font-size: 11.5px;
  color: var(--colors-mute, #86868b);
  margin-top: 1px;
}

.text-warn {
  color: var(--colors-accent-orange, #f56300);
}

.text-risk {
  color: var(--colors-accent-red, #ff3b30);
}

.incident-card {
  background-color: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  margin-bottom: 18px;
}

[data-theme="dark"] .incident-card {
  background-color: #161617;
  border-color: #272729;
}

.inc-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.inc-tag {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .inc-tag {
  color: #f5f5f7 !important;
}

.inc-desc-rows p {
  margin: 4px 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--colors-charcoal, #515154);
}

[data-theme="dark"] .inc-desc-rows p {
  color: #d2d2d7 !important;
}

.sop-timeline-wrapper {
  margin-bottom: 18px;
}

.sop-box-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
  margin: 0 0 12px 0;
  letter-spacing: -0.2px;
}

[data-theme="dark"] .sop-box-title {
  color: #f5f5f7 !important;
}

.timeline-step-content {
  font-size: 13px;
  line-height: 1.45;
  color: var(--colors-body, #1d1d1f);
}

[data-theme="dark"] .timeline-step-content {
  color: #d2d2d7 !important;
}

.bottom-action-row {
  margin-top: 24px;
}

.apple-primary-btn {
  background-color: var(--colors-primary, #0066cc) !important;
  border-color: var(--colors-primary, #0066cc) !important;
  font-size: 13.5px;
  height: 38px;
}

.apple-primary-btn:hover {
  background-color: var(--colors-primary-focus, #0071e3) !important;
}

.apple-primary-btn:active {
  transform: scale(0.98);
}
</style>
