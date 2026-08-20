<script setup>
import { ref } from 'vue'
import LifecycleChild from './LifecycleChild.vue'

const isShow = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>Lifecycle Hook</h2>
    <button class="toggle-btn" @click="isShow = !isShow">
      {{
        isShow
          ? '🔴 실습 컴포넌트 파괴하기 (v-if="false")'
          : '🟢 실습 컴포넌트 다시 생성하기 (v-if="true")'
      }}
    </button>
    <hr class="divider" />

    <!-- isShow가 false가 되면 자식 컴포넌트가 DOM에서 파괴되어 onUnmounted가 동작합니다 -->
    <LifecycleChild v-if="isShow" />
  </div>
</template>

<style scoped>
.practice-section {
  padding: 20px;
}

.toggle-btn {
  width: 100%;
  padding: 10px 15px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  margin-bottom: 15px;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #e9ecef;
}

.divider {
  border: none;
  border-top: 2px solid #20c997;
  margin: 15px 0;
}
</style>
