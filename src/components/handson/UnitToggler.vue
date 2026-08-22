<script setup>
import { useConfigStore } from '@/stores/configStore'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { unit, themeMode } = storeToRefs(configStore)
</script>

<template>
  <div class="header-controls-cluster">
    <!-- 테마 제어 세그먼트 (라이트 / 다크 / 자동) -->
    <el-segmented
      v-model="themeMode"
      :options="[
        { label: '☀️ 라이트', value: 'light' },
        { label: '⚡ 자동', value: 'auto' },
        { label: '🌙 다크', value: 'dark' },
      ]"
      size="small"
      class="custom-theme-segmented"
    />

    <!-- 온도 단위 전환 세그먼트 (섭씨 / 화씨) -->
    <el-segmented
      v-model="unit"
      :options="[
        { label: '℃', value: 'celsius' },
        { label: '℉', value: 'fahrenheit' },
      ]"
      size="small"
      class="custom-unit-segmented"
    />
  </div>
</template>

<style scoped>
.header-controls-cluster {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

:deep(.custom-theme-segmented),
:deep(.custom-unit-segmented) {
  --el-border-radius-base: 9999px !important;
  --el-segmented-bg-color: var(--colors-surface-deep, #e8e8ed);
  --el-segmented-item-selected-bg-color: var(--colors-surface-card, #ffffff);
  --el-segmented-item-selected-color: var(--colors-primary, #0066cc);
  background-color: var(--colors-surface-deep, #e8e8ed) !important;
  border: 1px solid var(--colors-hairline, #d2d2d7) !important;
  border-radius: var(--rounded-pill, 9999px) !important;
  padding: 2px !important;
  overflow: hidden;
}

[data-theme='dark'] :deep(.custom-theme-segmented),
[data-theme='dark'] :deep(.custom-unit-segmented) {
  --el-segmented-bg-color: #161617;
  --el-segmented-item-selected-bg-color: #272729;
  --el-segmented-item-selected-color: #2997ff;
  background-color: #161617 !important;
  border-color: #333336 !important;
}

:deep(.el-segmented__item) {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--colors-charcoal, #515154) !important;
  border-radius: var(--rounded-pill, 9999px) !important;
  padding: 3px 10px !important;
  outline: none !important;
  user-select: none;
  transition: all 0.15s ease;
}

/* 포커스 및 클릭 시 사각 파란색 테두리/아웃라인 완벽 제거 */
:deep(.el-segmented__item:focus),
:deep(.el-segmented__item:focus-visible),
:deep(.el-segmented__item.is-focus),
:deep(.el-segmented__item-input),
:deep(.el-segmented__item-input:focus),
:deep(.el-segmented__item-input:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* 슬라이딩 백그라운드 필터 알약 모서리 라운딩 */
:deep(.el-segmented__item-selected) {
  border-radius: var(--rounded-pill, 9999px) !important;
  background-color: var(--colors-surface-card, #ffffff) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12) !important;
}

[data-theme='dark'] :deep(.el-segmented__item) {
  color: #a1a1a6 !important;
}

[data-theme='dark'] :deep(.el-segmented__item-selected) {
  background-color: #272729 !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5) !important;
}

:deep(.el-segmented__item.is-selected) {
  color: var(--colors-primary, #0066cc) !important;
  font-weight: 600 !important;
}

[data-theme='dark'] :deep(.el-segmented__item.is-selected) {
  color: #2997ff !important;
}
</style>
