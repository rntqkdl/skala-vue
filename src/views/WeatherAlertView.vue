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
  <div class="cal-alert-container">
    <div class="header-cluster">
      <span class="eyebrow-tag">EARLY WARNING & SOP</span>
      <h3 class="main-title">국가산단 실시간 기상 특보 및 공정 안전 수칙</h3>
    </div>

    <div class="guideline-list">
      <div
        v-for="item in alertStore.evaluatedAlerts"
        :key="item.id"
        class="cal-alert-card"
        :class="{ 'card-danger': item.level === 'danger' }"
      >
        <div class="alert-card-header">
          <div class="plant-meta">
            <strong class="plant-name">{{ item.name }}</strong>
            <span class="plant-industry">({{ item.industry }})</span>
          </div>
          <span
            class="cal-level-pill"
            :class="
              item.level === 'danger'
                ? 'pill-danger'
                : item.level === 'warning'
                  ? 'pill-warning'
                  : 'pill-success'
            "
          >
            {{ item.badge }}
          </span>
        </div>

        <p class="current-state-text">
          <strong>실시간 현황:</strong> 기온 {{ configStore.formatTemp(item.temp) }} (체감
          {{ configStore.formatTemp(item.feels_like) }}), 습도 {{ item.humidity }}%, 미세먼지 PM2.5
          {{ item.pm25 }}μg/㎥ ({{ item.metricLabel || '위험 지표' }}:
          <strong>{{ item.processRiskText }}</strong
          >)
        </p>

        <!-- 과거 재해 연계 분석 요약 (Cal.com Embedded Card Box) -->
        <div class="incident-history-box">
          <div class="inc-box-header">
            <span class="inc-tag">과거 재해 이력 ({{ item.incident.year }})</span>
            <span class="inc-loss-badge">{{ item.incident.loss }}</span>
          </div>
          <p class="inc-desc">
            <strong>{{ item.incident.title }}</strong> - {{ item.incident.cause }}
          </p>
        </div>

        <p class="action-recommendation">
          <strong>긴급 권고 조치:</strong> {{ item.incident.preventAction }}
        </p>

        <button class="cal-btn-sop-link" @click="goToDetail(item.id)">
          해당 산단 정밀 관측 및 현장 SOP 체크리스트 열람 →
        </button>
      </div>
    </div>

    <button class="cal-btn-back" @click="router.push('/')">← 메인 대시보드로 이동</button>
  </div>
</template>

<style scoped>
.cal-alert-container {
  width: 100%;
}

.header-cluster {
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

.guideline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.cal-alert-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.cal-alert-card.card-danger {
  border-color: #fecaca;
  background: #fffafa;
}

.alert-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.plant-meta {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.plant-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.4px;
}

.plant-industry {
  font-size: 11px;
  color: #6b7280;
}

.cal-level-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.pill-danger {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.pill-warning {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
}

.pill-success {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.current-state-text {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #374151;
  line-height: 1.4;
}

.incident-history-box {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
}

.inc-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.inc-tag {
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
}

.inc-loss-badge {
  font-size: 10px;
  font-weight: 700;
  color: #dc2626;
  background: #fee2e2;
  padding: 1px 6px;
  border-radius: 4px;
}

.inc-desc {
  margin: 0;
  font-size: 11px;
  color: #4b5563;
  line-height: 1.4;
}

.action-recommendation {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #111111;
  line-height: 1.4;
}

.cal-btn-sop-link {
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.cal-btn-sop-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
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
