<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 산단별 경보 현황 및 대응 가이드 데이터
const alertGuidelines = [
  {
    id: 'city_03',
    name: '군산 국가산단',
    badge: '🚨 열변형 경보',
    badgeClass: 'badge-danger',
    issue: '현재 기온 32°C (열변형 +14.8μm)',
    action: '정밀 프레스 공정 냉각수 순환량 20% 증설 및 치수 오차 재측정 실시',
  },
  {
    id: 'city_02',
    name: '울산 석유화학단지',
    badge: '⚠️ 습도 주의보',
    badgeClass: 'badge-warning',
    issue: '현재 습도 85% (강우 진행 중)',
    action: '원유 저장 탱크 수분 유입 방지 밸브 점검 및 외부 배관 부식 방지 조치',
  },
  {
    id: 'city_01',
    name: '창원 국가산단',
    badge: 'ℹ️ 온도 주의',
    badgeClass: 'badge-info',
    issue: '현재 기온 29°C (열변형 +11.2μm)',
    action: '방위산업 가공라인 공조 시스템 정상 가동 확인 및 모니터링 유지',
  },
  {
    id: 'city_04',
    name: '광주 첨단산단',
    badge: '✅ 정상 상태',
    badgeClass: 'badge-success',
    issue: '현재 기온 22°C, 습도 55%',
    action: '클린룸 항온·항습 표준 스펙 충족, 일반 공정 가동 지속',
  },
]

// 산단 상세 관측 페이지로 이동
const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="alert-container">
    <h3>🚨 산단 기상 특보 및 공정 안전 수칙</h3>
    <hr />

    <div class="guideline-list">
      <div v-for="item in alertGuidelines" :key="item.id" class="guideline-card">
        <div class="card-header">
          <span class="plant-name">{{ item.name }}</span>
          <span class="badge" :class="item.badgeClass">{{ item.badge }}</span>
        </div>
        <p class="issue-text">현황: {{ item.issue }}</p>
        <p class="action-text">조치 사항: {{ item.action }}</p>
        <button class="detail-link-btn" @click="goToDetail(item.id)">
          해당 산단 상세 관측 보기 →
        </button>
      </div>
    </div>

    <button class="back-btn" @click="router.push('/')">← 대시보드 홈으로 이동</button>
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plant-name {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1rem;
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
  background-color: #74b9ff;
  color: white;
}

.badge-success {
  background-color: #2ecc71;
  color: white;
}

.issue-text {
  margin: 4px 0;
  font-size: 13px;
  color: #636e72;
}

.action-text {
  margin: 4px 0 10px 0;
  font-size: 14px;
  color: #2d3436;
  font-weight: 500;
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
