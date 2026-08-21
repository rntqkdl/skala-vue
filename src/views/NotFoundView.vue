<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="resend-not-found-view">
    <div class="code-window not-found-card">
      <div class="traffic-light-bar">
        <span class="traffic-dot dot-red"></span>
        <span class="traffic-dot dot-yellow"></span>
        <span class="traffic-dot dot-green"></span>
        <span class="code-window-title">ERROR_404_PAGE_NOT_FOUND.SH</span>
      </div>
      <div class="error-emoji">⚠️</div>
      <h2 class="error-title">404 — PAGE NOT FOUND</h2>
      <p class="error-desc">
        요청하신 관제 경로가 존재하지 않거나 주소가 변경되었습니다.<br />
        스마트 팩토리 메인 대시보드로 돌아가세요.
      </p>
      <button class="btn-primary" @click="goHome">메인 대시보드로 복귀 →</button>
    </div>
  </div>
</template>

<style scoped>
.resend-not-found-view {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}

.not-found-card {
  text-align: center;
  max-width: 480px;
  width: 100%;
  padding: 36px 32px;
}

.error-emoji {
  font-size: 2.8rem;
  margin-bottom: 12px;
}

.error-title {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 500;
  color: var(--colors-ink, #fcfdff);
  margin-bottom: 10px;
}

.error-desc {
  font-size: 13px;
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
  line-height: 1.5;
  margin-bottom: 24px;
}
</style>
