<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'threshold-changed'])

// 사용자 커스텀 임계값 기본 상태
const defaultThresholds = {
  heatwaveTemp: 33, // 폭염 경보 기준 기온 (℃)
  humidityMax: 85, // 고습/부식 위험 기준 습도 (%)
  pm25Limit: 35, // 초미세먼지 경보 기준 (μg/㎥)
  maxExpansion: 12, // 최대 허용 설비 열변형 (μm)
  autoDarkOnDanger: true, // 위험 발령 시 긴급 다크모드 자동 전환 여부
}

const saved = JSON.parse(localStorage.getItem('skala_custom_thresholds') || 'null')
const form = ref(saved ? { ...defaultThresholds, ...saved } : { ...defaultThresholds })

const handleSave = () => {
  localStorage.setItem('skala_custom_thresholds', JSON.stringify(form.value))
  emit('threshold-changed', form.value)
  emit('update:modelValue', false)
  ElMessage.success({
    message: '공정별 안전 임계값 설정이 실시간 관제 시스템에 반영되었습니다.',
    duration: 2500,
  })
}

const handleReset = () => {
  form.value = { ...defaultThresholds }
  localStorage.removeItem('skala_custom_thresholds')
  emit('threshold-changed', form.value)
  ElMessage.info('표준 산업단지 물리 임계값 규격으로 초기화되었습니다.')
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="공정별 맞춤 기상 안전 임계값 설정"
    width="520px"
    destroy-on-close
    append-to-body
    class="apple-threshold-dialog"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <div class="dialog-body-container">
      <p class="dialog-desc">
        국가산업단지 설비 가동 환경 및 현장 표준 공차에 맞춰 실시간 경보 발령 기준치를 직접
        조정합니다.
      </p>

      <div class="threshold-slider-group">
        <!-- 1. 폭염 기준 기온 -->
        <div class="slider-item">
          <div class="slider-label-row">
            <span class="label-title">🔥 폭염/열변형 경보 발령 기온</span>
            <strong class="label-val font-mono">{{ form.heatwaveTemp }} ℃</strong>
          </div>
          <el-slider v-model="form.heatwaveTemp" :min="26" :max="40" :step="1" show-stops />
        </div>

        <!-- 2. 고습 기준 -->
        <div class="slider-item">
          <div class="slider-label-row">
            <span class="label-title">🌧️ 고습/배관 부식 비상 습도</span>
            <strong class="label-val font-mono">{{ form.humidityMax }} %</strong>
          </div>
          <el-slider v-model="form.humidityMax" :min="60" :max="98" :step="2" show-stops />
        </div>

        <!-- 3. 초미세먼지 PM2.5 기준 -->
        <div class="slider-item">
          <div class="slider-label-row">
            <span class="label-title">😷 클린룸 초미세먼지(PM2.5) 경보</span>
            <strong class="label-val font-mono">{{ form.pm25Limit }} μg/㎥</strong>
          </div>
          <el-slider v-model="form.pm25Limit" :min="15" :max="100" :step="5" show-stops />
        </div>

        <!-- 4. 설비 최대 허용 열변형 -->
        <div class="slider-item">
          <div class="slider-label-row">
            <span class="label-title">⚙️ 최대 허용 열변형 공차 한계</span>
            <strong class="label-val font-mono">+{{ form.maxExpansion }} μm</strong>
          </div>
          <el-slider v-model="form.maxExpansion" :min="5" :max="25" :step="1" show-stops />
        </div>

        <!-- 5. 위험 시 다크모드 자동 전환 -->
        <div class="switch-item-row">
          <div class="switch-text-group">
            <span class="switch-title">비상 특보 발령 시 긴급 다크 관제 테마 자동 전환</span>
            <span class="switch-sub"
              >임계치 초과 시 상황실 긴급 인지를 위해 다크 화면으로 즉시 전환합니다.</span
            >
          </div>
          <el-switch v-model="form.autoDarkOnDanger" />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer-row">
        <el-button round @click="handleReset">기본값 복원</el-button>
        <div class="dialog-right-btns">
          <el-button round @click="emit('update:modelValue', false)">취소</el-button>
          <el-button type="primary" round class="apple-primary-btn" @click="handleSave">
            설정 저장 및 적용
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-body-container {
  padding: 4px 6px;
}

.dialog-desc {
  font-size: 13px;
  color: var(--colors-mute, #86868b);
  margin-bottom: 20px;
  line-height: 1.45;
}

.threshold-slider-group {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.slider-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label-title {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .label-title {
  color: #f5f5f7;
}

.label-val {
  font-size: 14px;
  font-weight: 600;
  color: var(--colors-primary, #0066cc);
}

[data-theme='dark'] .label-val {
  color: #2997ff;
}

.switch-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--colors-hairline-soft, #e5e5ea);
  gap: 16px;
}

[data-theme='dark'] .switch-item-row {
  border-color: #2c2c2e;
}

.switch-text-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.switch-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .switch-title {
  color: #f5f5f7;
}

.switch-sub {
  font-size: 11.5px;
  color: var(--colors-mute, #86868b);
}

.dialog-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.dialog-right-btns {
  display: flex;
  gap: 8px;
}

.apple-primary-btn {
  background-color: var(--colors-primary, #0066cc) !important;
  border-color: var(--colors-primary, #0066cc) !important;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
