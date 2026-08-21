<script setup>
import { useConfigStore } from '@/stores/configStore'
import { storeToRefs } from 'pinia'

// 1. 스토어 인스턴스 연결
const configStore = useConfigStore()

// 2. 반응형 state & getters 구조 분해
const { unit } = storeToRefs(configStore)
const { toggleUnit } = configStore
</script>

<template>
  <div class="unit-toggler-pill">
    <button
      @click="toggleUnit"
      class="toggle-pill-btn"
      :title="'단위 전환 (현재: ' + (unit === 'celsius' ? '℃' : '℉') + ')'"
    >
      <span class="unit-badge">{{ unit === 'celsius' ? '℃' : '℉' }}</span>
      <span class="unit-label">{{ unit === 'celsius' ? '섭씨' : '화씨' }}</span>
    </button>
  </div>
</template>

<style scoped>
.unit-toggler-pill {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
}

.toggle-pill-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #111111;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;
}

.toggle-pill-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.unit-badge {
  background: #111111;
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  border-radius: 9999px;
  padding: 1px 5px;
  line-height: 1.2;
}

.unit-label {
  font-size: 11px;
  color: #4b5563;
}
</style>
