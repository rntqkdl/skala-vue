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
  <div class="resend-alert-view">
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

    <div class="guideline-list">
      <div
        v-for="item in alertStore.evaluatedAlerts"
        :key="item.id"
        class="resend-card alert-card-item"
        :class="{
          'card-danger-accent': item.level === 'danger',
          'card-warning-accent': item.level === 'warning'
        }"
      >
        <!-- 산단 명칭 및 상태 뱃지 -->
        <div class="alert-card-header">
          <div class="plant-meta">
            <strong class="plant-name">{{ item.name }}</strong>
            <span class="industry-badge">{{ item.industry }}</span>
          </div>
          <span
            class="resend-badge"
            :class="item.level === 'danger' ? 'badge-coral' : item.level === 'warning' ? 'badge-warning' : 'badge-mint'"
          >
            {{ item.badge }}
          </span>
        </div>

        <!-- 실시간 관측 지표 (가독성 높은 줄바꿈 구조) -->
        <div class="telemetry-info-grid">
          <div class="telemetry-item">
            <span class="item-label">현재 기온 / 체감</span>
            <strong class="item-value">{{ configStore.formatTemp(item.temp) }} (체감 {{ configStore.formatTemp(item.feels_like) }})</strong>
          </div>
          <div class="telemetry-item">
            <span class="item-label">습도 / 풍속</span>
            <strong class="item-value">{{ item.humidity }}% / {{ item.wind }}m/s</strong>
          </div>
          <div class="telemetry-item">
            <span class="item-label">초미세먼지 (PM2.5)</span>
            <strong class="item-value" :class="{ 'text-warn': item.pm25 > 35 }">{{ item.pm25 }} μg/㎥</strong>
          </div>
          <div class="telemetry-item">
            <span class="item-label">{{ item.metricLabel || '공정 위험도' }}</span>
            <strong class="item-value text-risk">{{ item.processRiskText }}</strong>
          </div>
        </div>

        <!-- 과거 재해 분석 백서 -->
        <div class="incident-history-box">
          <div class="inc-box-header">
            <span class="inc-tag">📜 {{ item.incident.title }}</span>
            <span class="resend-badge badge-coral">{{ item.incident.loss }}</span>
          </div>
          <div class="inc-desc-rows">
            <p><strong>발생 시기:</strong> {{ item.incident.year }}</p>
            <p><strong>사고 원인:</strong> {{ item.incident.cause }}</p>
          </div>
        </div>

        <!-- 긴급 권고 조치 절차 (가독성 보장 3단계 타임라인) -->
        <div class="sop-timeline-box">
          <div class="sop-box-title">📋 표준 긴급 대응 작업 절차 (SOP)</div>
          <div class="sop-steps-list">
            <div class="sop-step-row step-1">
              <span class="step-num">1단계 (감지)</span>
              <span class="step-text">설비 센서 온도 및 습도 계측치 이상 유무 확인 후 비상 알람 전파</span>
            </div>
            <div class="sop-step-row step-2">
              <span class="step-num">2단계 (조치)</span>
              <span class="step-text">{{ item.incident.preventAction }}</span>
            </div>
            <div class="sop-step-row step-3">
              <span class="step-num">3단계 (복귀)</span>
              <span class="step-text">현장 체크리스트 전수 확인 및 수율 보존 상태 검증 후 정상 가동</span>
            </div>
          </div>
        </div>

        <!-- 상세 페이지 이동 버튼 -->
        <button class="btn-primary btn-full" @click="goToDetail(item.id)">
          {{ item.name }} 정밀 관측 및 현장 점검표(SOP) 열람 →
        </button>
      </div>
    </div>

    <div class="bottom-action-row">
      <button class="btn-secondary" @click="router.push('/')">← 대시보드로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.resend-alert-view {
  width: 100%;
}

.guideline-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.alert-card-item {
  background-color: var(--colors-surface-card, #f8fafc);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-radius: var(--rounded-lg, 12px);
  padding: 22px 24px;
}

.card-danger-accent {
  border-left: 4px solid var(--colors-accent-red, #dc2626) !important;
}

.card-warning-accent {
  border-left: 4px solid var(--colors-accent-yellow, #d97706) !important;
}

.alert-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.plant-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.plant-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--colors-ink, #0f172a);
}

.industry-badge {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #64748b);
  background: var(--colors-surface-elevated, #ffffff);
  padding: 3px 8px;
  border-radius: var(--rounded-xs, 4px);
  border: 1px solid var(--colors-hairline, #e2e8f0);
}

.telemetry-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  background: var(--colors-surface-elevated, #ffffff);
  border: 1px solid var(--colors-hairline, #e2e8f0);
  border-radius: var(--rounded-md, 8px);
  padding: 14px 16px;
  margin-bottom: 16px;
}

.telemetry-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #64748b);
}

.item-value {
  font-size: 13.5px;
  color: var(--colors-ink, #0f172a);
}

.item-value.text-warn {
  color: var(--colors-accent-orange, #ea580c);
}

.item-value.text-risk {
  color: var(--colors-accent-orange, #ea580c);
  font-weight: 600;
}

.incident-history-box {
  background: var(--colors-surface-elevated, #ffffff);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-radius: var(--rounded-md, 8px);
  padding: 14px 18px;
  margin-bottom: 16px;
}

.inc-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--colors-hairline, #e2e8f0);
  padding-bottom: 8px;
}

.inc-tag {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--colors-ink, #0f172a);
}

.inc-desc-rows p {
  margin: 4px 0;
  font-size: 13px;
  color: var(--colors-body, #334155);
  line-height: 1.5;
}

.sop-timeline-box {
  background: var(--colors-surface-elevated, #ffffff);
  border: 1px solid var(--colors-hairline-strong, #cbd5e1);
  border-radius: var(--rounded-md, 8px);
  padding: 16px 18px;
  margin-bottom: 18px;
}

.sop-box-title {
  font-size: 12px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--colors-link, #2563eb);
  margin-bottom: 12px;
}

.sop-steps-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sop-step-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: var(--rounded-xs, 4px);
  background: var(--colors-surface-card, #f8fafc);
  border: 1px solid var(--colors-hairline, #e2e8f0);
}

.step-num {
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 700;
  white-space: nowrap;
  padding: 2px 6px;
  border-radius: 3px;
}

.step-1 .step-num {
  background: rgba(220, 38, 38, 0.12);
  color: var(--colors-accent-red, #dc2626);
}

.step-2 .step-num {
  background: rgba(217, 119, 6, 0.12);
  color: var(--colors-accent-yellow, #d97706);
}

.step-3 .step-num {
  background: rgba(5, 150, 105, 0.12);
  color: var(--colors-accent-green, #059669);
}

.step-text {
  color: var(--colors-ink, #0f172a);
  line-height: 1.5;
}

.bottom-action-row {
  margin-top: 24px;
}
</style>
