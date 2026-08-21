<script setup>
import { useRouter } from 'vue-router'
import { useAlertStore } from '@/stores/alertStore'
import { useConfigStore } from '@/stores/configStore'

const router = useRouter()
const alertStore = useAlertStore()
const configStore = useConfigStore()

// 산단 상세 관측 페이지로 이동
const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="alert-container">
    <h3>🚨 국가산단 실시간 기상 특보 및 공정 안전 수칙</h3>
    <hr />

    <div class="guideline-list">
      <a-card
        v-for="item in alertStore.evaluatedAlerts"
        :key="item.id"
        class="custom-alert-card"
        :class="{ 'card-highlight-danger': item.level === 'danger' }"
      >
        <div class="card-header">
          <div class="plant-info">
            <span class="plant-name">{{ item.name }}</span>
            <span class="plant-industry">({{ item.industry }})</span>
          </div>
          <a-tag
            :color="item.level === 'danger' ? 'red' : item.level === 'warning' ? 'orange' : 'green'"
          >
            {{ item.badge }}
          </a-tag>
        </div>

        <p class="issue-text">
          <strong>실시간 현황:</strong> 기온 {{ configStore.formatTemp(item.temp) }} (체감
          {{ configStore.formatTemp(item.feels_like) }}), 습도 {{ item.humidity }}%, 미세먼지 PM2.5
          {{ item.pm25 }}μg/㎥ ({{ item.metricLabel || '위험 지표' }}: {{ item.processRiskText }})
        </p>

        <!-- 과거 재해 연계 분석 요약 -->
        <a-alert
          :message="`과거 재해 이력 (${item.incident.year})`"
          :description="`${item.incident.title} - ${item.incident.loss}`"
          type="info"
          show-icon
          class="alert-box"
        />

        <p class="action-text">
          <strong>긴급 권고 조치:</strong> {{ item.incident.preventAction }}
        </p>

        <a-button type="link" class="detail-link-btn" @click="goToDetail(item.id)">
          해당 산단 상세 관측 및 SOP 체크리스트 보기 →
        </a-button>
      </a-card>
    </div>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 이동</button>
  </div>
</template>

<style scoped>
.alert-container {
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
  font-weight: 700;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin-bottom: 15px;
}

.guideline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.custom-alert-card {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.card-highlight-danger {
  border-color: #ff4d4f;
  background-color: #fff2f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plant-info {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.plant-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 1rem;
}

.plant-industry {
  font-size: 12px;
  color: #64748b;
}

.issue-text {
  margin: 4px 0;
  font-size: 13px;
  color: #334155;
}

.alert-box {
  margin: 8px 0;
  font-size: 12px;
}

.action-text {
  margin: 6px 0 10px 0;
  font-size: 13px;
  color: #1e293b;
}

.detail-link-btn {
  padding: 0;
  font-size: 13px;
  font-weight: 600;
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
