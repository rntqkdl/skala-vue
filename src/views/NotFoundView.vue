<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="cal-not-found-container">
    <div class="not-found-card">
      <div class="error-emoji">⚠️</div>
      <h2 class="error-title">404 - 페이지를 찾을 수 없습니다</h2>
      <p class="error-desc">
        요청하신 경로가 존재하지 않거나 주소가 변경되었습니다.<br />
        스마트 팩토리 메인 대시보드로 돌아가세요.
      </p>
      <button class="cal-btn-home" @click="goHome">메인 대시보드로 복귀</button>
    </div>
  </div>
</template>

<style scoped>
.cal-not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.not-found-card {
  text-align: center;
  background: #ffffff;
  padding: 36px 30px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  max-width: 440px;
  width: 100%;
}

.error-emoji {
  font-size: 3rem;
  margin-bottom: 12px;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #111111;
  margin-bottom: 8px;
}

.error-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 20px;
}

.cal-btn-home {
  background: #111111;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cal-btn-home:hover {
  background: #262626;
}
</style>
