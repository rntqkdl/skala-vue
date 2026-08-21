<script setup>
import { ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { ElMessage, ElNotification } from 'element-plus'

const weatherStore = useWeatherStore()

const cityName = ref('')
const selectedIndustry = ref('스마트 제조 및 부품 가공 라인')
const isOpen = ref(false)

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
  if (!cityName.value.trim()) {
    ElMessage.warning('지역명(도시명)을 입력해 주세요.')
    return
  }

  const result = await weatherStore.searchAndAddComplex(cityName.value, selectedIndustry.value)

  if (result.success) {
    ElNotification.success({
      title: '산단 등록 성공',
      message: `${cityName.value} 산업단지가 실시간 기상 관제 목록에 추가되었습니다.`,
      duration: 3000,
    })
    cityName.value = ''
    isOpen.value = false
  } else {
    ElMessage.error(result.message)
  }
}
</script>

<template>
  <div class="resend-register-card">
    <div class="card-header-bar" @click="isOpen = !isOpen">
      <div class="header-left">
        <!-- 🚦 Traffic light indicator -->
        <div class="traffic-mini-dots">
          <span class="traffic-dot dot-red"></span>
          <span class="traffic-dot dot-yellow"></span>
          <span class="traffic-dot dot-green"></span>
        </div>
        <strong class="header-title">전국 산업단지 실시간 Geocoding 신규 등록 & 관제 확장</strong>
      </div>
      <button class="btn-secondary btn-sm">
        {{ isOpen ? '닫기 ▲' : '신규 등록 열기 ▼' }}
      </button>
    </div>

    <!-- 확장 입력 영역 -->
    <div v-if="isOpen" class="card-body-content">
      <p class="guide-text">
        OpenWeather Geocoding API를 통해 전국 도시/산단의 위경도 좌표를 실시간 조회하고 관제 인프라에 동적 바인딩합니다.
      </p>

      <!-- 추천 프리셋 뱃지 -->
      <div class="preset-row">
        <span class="preset-label">QUICK PRESETS:</span>
        <button
          v-for="item in presetList"
          :key="item.name"
          class="preset-chip"
          @click="handleQuickAdd(item)"
        >
          {{ item.name }} ({{ item.industry.split(' ')[0] }})
        </button>
      </div>

      <div class="form-grid">
        <el-input
          v-model="cityName"
          placeholder="지역명 입력 (예: 구미, 당진, 청주, 안산)"
          clearable
          @keyup.enter="handleAdd"
          :disabled="weatherStore.isLoading"
          style="flex: 1;"
        />
        <el-input
          v-model="selectedIndustry"
          placeholder="대표 공정 테마"
          clearable
          @keyup.enter="handleAdd"
          :disabled="weatherStore.isLoading"
          style="flex: 1;"
        />
        <button
          class="btn-primary"
          @click="handleAdd"
          :disabled="weatherStore.isLoading"
        >
          {{ weatherStore.isLoading ? '조회 중...' : '등록하기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resend-register-card {
  background: var(--colors-surface-card, #0a0a0c);
  border: 1px solid var(--colors-hairline-strong, rgba(255, 255, 255, 0.14));
  border-radius: var(--rounded-lg, 12px);
  margin-bottom: 16px;
  overflow: hidden;
  box-sizing: border-box;
}

.card-header-bar {
  padding: 12px 18px;
  background: var(--colors-surface-deep, #06060a);
  border-bottom: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.06));
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.traffic-mini-dots {
  display: flex;
  align-items: center;
  gap: 5px;
}

.header-title {
  font-size: 13px;
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
  letter-spacing: -0.2px;
}

.card-body-content {
  padding: 18px 20px;
  background: var(--colors-surface-card, #0a0a0c);
}

.guide-text {
  margin: 0 0 14px 0;
  font-size: 13px;
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
  line-height: 1.45;
}

.preset-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 14px;
}

.preset-label {
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--colors-mute, #a1a4a5);
}

.preset-chip {
  background: var(--colors-surface-elevated, #101012);
  border: 1px solid var(--colors-hairline-strong, rgba(255, 255, 255, 0.14));
  color: var(--colors-ink, #fcfdff);
  font-size: 11px;
  font-family: var(--font-mono);
  padding: 4px 10px;
  border-radius: var(--rounded-full, 9999px);
  cursor: pointer;
  transition: all 0.15s ease;
}

.preset-chip:hover {
  background: #1c1c20;
  border-color: rgba(255, 255, 255, 0.3);
}

.form-grid {
  display: flex;
  gap: 10px;
}
</style>
