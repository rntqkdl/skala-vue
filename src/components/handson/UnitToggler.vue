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
        { label: '🌙 다크', value: 'dark' }
      ]"
      size="small"
      class="custom-theme-segmented"
    />

    <!-- 온도 단위 전환 세그먼트 (섭씨 / 화씨) -->
    <el-segmented
      v-model="unit"
      :options="[
        { label: '℃', value: 'celsius' },
        { label: '℉', value: 'fahrenheit' }
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
  background-color: var(--colors-surface-deep, #e8e8ed) !important;
  border: 1px solid var(--colors-hairline, #d2d2d7) !important;
  border-radius: var(--rounded-pill, 9999px) !important;
  padding: 2px !important;
}

[data-theme="dark"] :deep(.custom-theme-segmented),
[data-theme="dark"] :deep(.custom-unit-segmented) {
  background-color: #161617 !important;
  border-color: #333336 !important;
}

:deep(.custom-theme-segmented .el-segmented__item),
:deep(.custom-unit-segmented .el-segmented__item) {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--colors-charcoal, #515154) !important;
  border-radius: var(--rounded-pill, 9999px) !important;
  padding: 3px 10px !important;
  transition: all 0.15s ease;
}

[data-theme="dark"] :deep(.custom-theme-segmented .el-segmented__item),
[data-theme="dark"] :deep(.custom-unit-segmented .el-segmented__item) {
  color: #a1a1a6 !important;
}

:deep(.custom-theme-segmented .el-segmented__item.is-selected),
:deep(.custom-unit-segmented .el-segmented__item.is-selected) {
  background-color: var(--colors-surface-card, #ffffff) !important;
  color: var(--colors-primary, #0066cc) !important;
  font-weight: 600 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

[data-theme="dark"] :deep(.custom-theme-segmented .el-segmented__item.is-selected),
[data-theme="dark"] :deep(.custom-unit-segmented .el-segmented__item.is-selected) {
  background-color: #272729 !important;
  color: #2997ff !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5) !important;
}
</style>
