<script setup>
// 공통 대시보드 카드 컨테이너
</script>

<template>
  <div class="resend-base-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.resend-base-card {
  background-color: var(--colors-surface-card, #0a0a0c);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.08));
  border-radius: var(--rounded-lg, 12px);
  padding: 16px 20px;
  margin-bottom: 16px;
  box-sizing: border-box;
}
</style>
