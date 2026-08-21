<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// 산단별 상세 기상 및 공정 데이터
const mockDetails = {
  city_01: {
    name: '경상남도 창원 국가산업단지',
    process: '정밀기계 및 방위산업 가공라인',
    temp: 29,
    status: '맑음',
    humidity: '45%',
    wind: '2.1m/s',
    expansionRate: '11.2μm',
    statusNote: '공정 안정권 유지 중',
    statusClass: 'status-good',
  },
  city_02: {
    name: '울산광역시 석유화학단지',
    process: '원유 정제 및 나프타 분해 공정',
    temp: 24,
    status: '비',
    humidity: '85%',
    wind: '4.5m/s',
    expansionRate: '4.5μm',
    statusNote: '고습도 주의 (설비 제습 가동)',
    statusClass: 'status-warning',
  },
  city_03: {
    name: '전북특별자치도 군산 국가산단',
    process: '대형 프레스 및 특수강 열처리 공정',
    temp: 32,
    status: '맑음',
    humidity: '75%',
    wind: '3.2m/s',
    expansionRate: '14.8μm',
    statusNote: '열변형 한계치 접근 (공정 냉각 요망)',
    statusClass: 'status-danger',
  },
  city_04: {
    name: '광주광역시 첨단과학국가산단',
    process: '반도체 패키징 및 광통신 부품 라인',
    temp: 22,
    status: '흐림',
    humidity: '55%',
    wind: '1.8m/s',
    expansionRate: '3.0μm',
    statusNote: '항온·항습 최적 상태',
    statusClass: 'status-good',
  },
}

const cityData = ref(null)

// 마운트 시 URL 동적 파라미터(:cityId)로 산단 데이터 선택
onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보</h3>
    <hr />

    <div v-if="cityData" class="info-card">
      <h4>📍 지정 지역: {{ cityData.name }}</h4>
      <p>주요 공정: {{ cityData.process }}</p>
      <p>
        실시간 기온: <strong>{{ configStore.formatTemp(cityData.temp) }}</strong>
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
      <p>
        열변형 오차: <strong>+{{ cityData.expansionRate }}</strong>
      </p>
      <div class="alert-box" :class="cityData.statusClass">
        공정 상태 진단: {{ cityData.statusNote }}
      </div>
    </div>
    <div v-else class="empty-card">
      <p>해당 지역의 상세 데이터가 존재하지 않습니다.</p>
    </div>

    <button class="back-btn" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
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

.info-card {
  background: #f1f2f6;
  padding: 18px;
  border-radius: 6px;
  margin: 15px 0;
}

.info-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.05rem;
}

.info-card p {
  margin: 6px 0;
  color: #495057;
  font-size: 14px;
}

.alert-box {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.status-good {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.status-warning {
  background-color: #fff3e0;
  color: #e65100;
  border: 1px solid #ffe0b2;
}

.status-danger {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.empty-card {
  padding: 20px;
  text-align: center;
  color: #7f8c8d;
}

.back-btn {
  padding: 10px 16px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #1a252f;
}
</style>
