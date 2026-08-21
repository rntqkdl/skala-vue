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
  <div class="cal-register-card">
    <div class="card-header-bar" @click="isOpen = !isOpen">
      <div class="header-left">
        <span class="icon-plus">➕</span>
        <strong class="header-title">전국 산업단지 실시간 신규 등록 및 확장 관제</strong>
      </div>
      <button class="toggle-text-btn" type="button">
        {{ isOpen ? '닫기 ▲' : '신규 등록 열기 ▼' }}
      </button>
    </div>

    <!-- 확장 입력 영역 -->
    <div v-if="isOpen" class="card-body-content">
      <p class="guide-text">
        Geocoding API를 통해 전국 도시/산단의 위경도 좌표를 조회하고 실시간 기상 데이터를 동적으로
        바인딩합니다.
      </p>

      <!-- 추천 프리셋 뱃지 -->
      <div class="preset-row">
        <span class="preset-label">추천 프리셋:</span>
        <button
          v-for="item in presetList"
          :key="item.name"
          class="preset-pill"
          @click="handleQuickAdd(item)"
          :disabled="weatherStore.isLoading"
        >
          {{ item.name }} ({{ item.industry.split(' ')[0] }})
        </button>
      </div>

      <div class="form-grid">
        <input
          v-model="cityName"
          placeholder="지역명 입력 (예: 구미, 당진, 청주, 안산)"
          class="cal-input"
          @keyup.enter="handleAdd"
          :disabled="weatherStore.isLoading"
        />
        <input
          v-model="selectedIndustry"
          placeholder="대표 공정 테마"
          class="cal-input"
          @keyup.enter="handleAdd"
          :disabled="weatherStore.isLoading"
        />
        <button class="cal-btn-submit" @click="handleAdd" :disabled="weatherStore.isLoading">
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
.cal-register-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.card-header-bar {
  padding: 12px 16px;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-plus {
  font-size: 13px;
}

.header-title {
  font-size: 12px;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.3px;
}

.toggle-text-btn {
  background: transparent;
  border: none;
  color: #3b82f6;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.card-body-content {
  padding: 14px 16px;
  border-top: 1px solid #f3f4f6;
  background: #ffffff;
}

.guide-text {
  margin: 0 0 10px 0;
  font-size: 11px;
  color: #6b7280;
  line-height: 1.4;
}

.preset-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}

.preset-label {
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
}

.preset-pill {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  padding: 3px 8px;
  font-size: 11px;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;
}

.preset-pill:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.form-grid {
  display: flex;
  gap: 6px;
}

.cal-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  background: #ffffff;
  color: #111111;
  outline: none;
  transition: border-color 0.15s ease;
}

.cal-input:focus {
  border-color: #111111;
}

.cal-btn-submit {
  background: #111111;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.cal-btn-submit:hover {
  background: #262626;
}

.feedback-msg {
  margin: 8px 0 0 0;
  font-size: 11px;
  color: #059669;
  font-weight: 600;
}

.feedback-msg.error {
  color: #dc2626;
}
</style>
