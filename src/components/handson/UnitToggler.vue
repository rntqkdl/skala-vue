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
  background-color: var(--colors-surface-card, #f8fafc) !important;
  border: 1px solid var(--colors-hairline-strong, #cbd5e1) !important;
  border-radius: var(--rounded-md, 8px) !important;
  padding: 2px !important;
}

:deep(.custom-theme-segmented .el-segmented__item),
:deep(.custom-unit-segmented .el-segmented__item) {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--colors-charcoal, #475569) !important;
  border-radius: var(--rounded-xs, 4px) !important;
}

:deep(.custom-theme-segmented .el-segmented__item.is-selected),
:deep(.custom-unit-segmented .el-segmented__item.is-selected) {
  background-color: var(--colors-primary, #0f172a) !important;
  color: var(--colors-primary-on, #ffffff) !important;
}
</style>
