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
  <el-card shadow="never" class="apple-ui-register-card" :body-style="{ padding: '18px 22px' }">
    <div class="card-header-bar" @click="isOpen = !isOpen">
      <div class="header-left">
        <span class="header-icon">📍</span>
        <strong class="header-title">전국 산업단지 실시간 Geocoding 신규 등록 & 관제 확장</strong>
      </div>
      <el-button size="small" round class="toggle-expand-btn">
        {{ isOpen ? '접기 ▲' : '신규 등록 열기 ▼' }}
      </el-button>
    </div>

    <!-- 확장 입력 영역 -->
    <div v-if="isOpen" class="card-body-content">
      <p class="guide-text">
        OpenWeather Geocoding API를 통해 전국 도시/산단의 위경도 좌표를 실시간 조회하고 관제
        인프라에 동적 바인딩합니다.
      </p>

      <!-- 추천 프리셋 뱃지 -->
      <div class="preset-row">
        <span class="preset-label">추천 산단 프리셋:</span>
        <div class="preset-tag-cluster">
          <el-tag
            v-for="item in presetList"
            :key="item.name"
            size="small"
            effect="plain"
            round
            class="preset-tag-btn"
            @click="handleQuickAdd(item)"
          >
            + {{ item.name }} ({{ item.industry.split(' ')[0] }})
          </el-tag>
        </div>
      </div>

      <div class="form-grid-row">
        <el-input
          v-model="cityName"
          placeholder="지역명 입력 (예: 구미, 당진, 청주, 안산)"
          clearable
          @keyup.enter="handleAdd"
          :disabled="weatherStore.isLoading"
          style="flex: 1; min-width: 200px"
        />
        <el-input
          v-model="selectedIndustry"
          placeholder="대표 공정 테마 (예: 스마트 모빌리티 조립 라인)"
          clearable
          @keyup.enter="handleAdd"
          :disabled="weatherStore.isLoading"
          style="flex: 1.5; min-width: 240px"
        />
        <el-button
          type="primary"
          round
          :loading="weatherStore.isLoading"
          @click="handleAdd"
          class="btn-register-action"
        >
          동적 관제 추가
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.apple-ui-register-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  margin-bottom: 18px;
  transition: all 0.2s ease;
}

[data-theme='dark'] .apple-ui-register-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.card-header-bar {
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

.header-icon {
  font-size: 16px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .header-title {
  color: #f5f5f7 !important;
}

.toggle-expand-btn {
  font-size: 12px;
  font-weight: 500;
}

.card-body-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--colors-hairline-soft, #e5e5ea);
}

[data-theme='dark'] .card-body-content {
  border-top-color: #272729;
}

.guide-text {
  font-size: 13.5px;
  color: var(--colors-mute, #86868b);
  margin: 0 0 12px 0;
  line-height: 1.45;
}

.preset-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.preset-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--colors-charcoal, #515154);
}

[data-theme='dark'] .preset-label {
  color: #a1a1a6 !important;
}

.preset-tag-cluster {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.preset-tag-btn {
  cursor: pointer;
  transition: transform 0.1s ease;
}

.preset-tag-btn:hover {
  transform: scale(1.04);
}

.form-grid-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-register-action {
  background-color: var(--colors-primary, #0066cc) !important;
  border-color: var(--colors-primary, #0066cc) !important;
  font-weight: 500;
  padding: 8px 18px;
}
</style>
