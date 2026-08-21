<script setup>
import { ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'

const weatherStore = useWeatherStore()

const cityName = ref('')
const selectedIndustry = ref('스마트 제조 및 부품 가공 라인')
const isOpen = ref(false)
const feedbackMessage = ref('')
const isSuccess = ref(true)

// 추천 산단 프리셋 목록
const presetList = [
  { name: '구미', industry: '반도체 웨이퍼 및 모바일 전자부품' },
  { name: '당진', industry: '제철소 및 대형 강판 압연 공정' },
  { name: '성남', industry: '판교 테크노밸리 및 정밀 제어기' },
  { name: '청주', industry: '이차전지 배터리 및 바이오 의약품' },
  { name: '대산', industry: '대산 석유화학 플랜트 및 정제' },
]

const handleQuickAdd = async (preset) => {
  cityName.value = preset.name
  selectedIndustry.value = preset.industry
  await handleAdd()
}

const handleAdd = async () => {
  if (!cityName.value.trim()) return

  const result = await weatherStore.searchAndAddComplex(cityName.value, selectedIndustry.value)
  isSuccess.value = result.success
  feedbackMessage.value = result.message

  if (result.success) {
    cityName.value = ''
  }

  setTimeout(() => {
    feedbackMessage.value = ''
  }, 4000)
}
</script>

<template>
  <div class="register-card">
    <div class="card-header" @click="isOpen = !isOpen">
      <div class="header-title">
        <span class="icon">➕</span>
        <strong>전국 산단 실시간 신규 등록 및 확장 관제</strong>
      </div>
      <button class="toggle-btn" type="button">
        {{ isOpen ? '접기 ▲' : '산단 등록 열기 ▼' }}
      </button>
    </div>

    <!-- 확장 입력 영역 -->
    <div v-if="isOpen" class="card-body">
      <p class="guide-text">
        Geocoding API를 통해 전국 모든 도시/산업단지의 위경도 좌표와 실시간 기상 데이터를 동적으로
        추가합니다.
      </p>

      <!-- 추천 프리셋 뱃지 -->
      <div class="preset-row">
        <span class="preset-label">추천 산단:</span>
        <button
          v-for="item in presetList"
          :key="item.name"
          class="preset-badge"
          @click="handleQuickAdd(item)"
          :disabled="weatherStore.isLoading"
        >
          {{ item.name }} ({{ item.industry.split(' ')[0] }})
        </button>
      </div>

      <div class="form-row">
        <input
          v-model="cityName"
          placeholder="도시 또는 지역명 입력 (예: 구미, 당진, 안산, 청주)"
          class="input-city"
          @keyup.enter="handleAdd"
          :disabled="weatherStore.isLoading"
        />
        <input
          v-model="selectedIndustry"
          placeholder="대표 공정 및 테마"
          class="input-industry"
          @keyup.enter="handleAdd"
          :disabled="weatherStore.isLoading"
        />
        <button class="btn-submit" @click="handleAdd" :disabled="weatherStore.isLoading">
          {{ weatherStore.isLoading ? '조회 중...' : '등록하기' }}
        </button>
      </div>

      <!-- 피드백 메시지 -->
      <p v-if="feedbackMessage" class="feedback-msg" :class="{ error: !isSuccess }">
        {{ feedbackMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-card {
  background: #ffffff;
  border: 1px solid #dfe4ea;
  border-radius: 6px;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.card-header {
  padding: 12px 14px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #2c3e50;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #3498db;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.card-body {
  padding: 14px;
  border-top: 1px solid #e9ecef;
  background: #ffffff;
}

.guide-text {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #636e72;
}

.preset-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
}

.preset-label {
  font-size: 11px;
  font-weight: bold;
  color: #475569;
}

.preset-badge {
  background: #f1f2f6;
  border: 1px solid #dfe4ea;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 11px;
  color: #2f3542;
  cursor: pointer;
  transition: all 0.15s ease;
}

.preset-badge:hover {
  background: #e4e7eb;
  border-color: #cbd5e1;
}

.form-row {
  display: flex;
  gap: 6px;
}

.input-city {
  flex: 1.2;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 12px;
}

.input-industry {
  flex: 1.8;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 12px;
}

.btn-submit {
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.btn-submit:hover {
  background: #1a252f;
}

.feedback-msg {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #27ae60;
  font-weight: 600;
}

.feedback-msg.error {
  color: #e74c3c;
}
</style>
