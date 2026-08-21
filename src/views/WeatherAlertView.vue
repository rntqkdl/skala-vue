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
      <div
        v-for="item in alertStore.evaluatedAlerts"
        :key="item.id"
        class="guideline-card"
        :class="{ 'card-highlight-danger': item.level === 'danger' }"
      >
        <div class="card-header">
          <div class="plant-info">
            <span class="plant-name">{{ item.name }}</span>
            <span class="plant-industry">({{ item.industry }})</span>
          </div>
          <span class="badge" :class="item.badgeClass">{{ item.badge }}</span>
        </div>

        <p class="issue-text">
          <strong>실시간 현황:</strong> 기온 {{ configStore.formatTemp(item.temp) }} (체감
          {{ configStore.formatTemp(item.feels_like) }}), 습도 {{ item.humidity }}%, 미세먼지 PM2.5
          {{ item.pm25 }}μg/㎥ (열변형 +{{ item.expansionRate }}μm)
        </p>

        <!-- 과거 재해 연계 분석 요약 -->
        <div class="history-context-box">
          <span class="history-label">과거 재해 이력 ({{ item.incident.year }}):</span>
          <span class="history-desc"
            >{{ item.incident.title }} — <em>{{ item.incident.loss }}</em></span
          >
        </div>

        <p class="action-text">
          <strong>긴급 권고 조치:</strong> {{ item.incident.preventAction }}
        </p>

        <button class="detail-link-btn" @click="goToDetail(item.id)">
          해당 산단 상세 관측 및 SOP 체크리스트 보기 →
        </button>
      </div>
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

.guideline-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 14px;
}

.card-highlight-danger {
  border-color: #ff7675;
  background-color: #fff9f9;
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
  color: #2c3e50;
  font-size: 1rem;
}

.plant-industry {
  font-size: 12px;
  color: #7f8c8d;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge-danger {
  background-color: #ff7675;
  color: white;
}

.badge-warning {
  background-color: #f39c12;
  color: white;
}

.badge-info {
  background-color: #54a0ff;
  color: white;
}

.badge-success {
  background-color: #2ecc71;
  color: white;
}

.issue-text {
  margin: 4px 0;
  font-size: 13px;
  color: #495057;
}

.history-context-box {
  margin: 8px 0;
  padding: 6px 10px;
  background: #edf2f7;
  border-radius: 4px;
  font-size: 12px;
  color: #4a5568;
}

.history-label {
  font-weight: bold;
  color: #2d3748;
  margin-right: 4px;
}

.history-desc em {
  font-style: normal;
  color: #e53e3e;
  font-weight: 600;
}

.action-text {
  margin: 6px 0 10px 0;
  font-size: 13px;
  color: #2d3436;
}

.detail-link-btn {
  background: transparent;
  border: none;
  color: #0984e3;
  font-size: 13px;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
}

.detail-link-btn:hover {
  color: #0652dd;
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
