<script setup>
// Element Plus 기반 공통 대시보드 카드 컨테이너
</script>

<template>
  <el-card shadow="never" class="apple-ui-base-card" :body-style="{ padding: '16px 20px' }">
    <slot></slot>
  </el-card>
</template>

<style scoped>
.apple-ui-base-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  margin-bottom: 18px;
  transition: all 0.2s ease;
}

[data-theme="dark"] .apple-ui-base-card {
  background-color: #1d1d1f;
  border-color: #333336;
}
</style>
