<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAlertStore } from '@/stores/alertStore'
import UnitToggler from '@/components/handson/UnitToggler.vue'

// 상단 네비게이션 바에 실시간 경보 뱃지 연동
const alertStore = useAlertStore()
</script>

<template>
  <div class="app-container">
    <h1>⛅ 과제 6: Axios 실시간 날씨 데이터 연동</h1>
    <hr />

    <div class="dashboard-wrapper">
      <!-- 상단 내비게이션 바 -->
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">🌦️ 산단 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/radar" class="nav-item">🗺️ 전국 레이더</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/alerts" class="nav-item">
          🚨 안전 수칙
          <span v-if="alertStore.dangerCount > 0" class="nav-badge">
            {{ alertStore.dangerCount }}
          </span>
        </RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/archive" class="nav-item">📚 기술 아카이브</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>

        <!-- 단위 변환 스토어 토글러 -->
        <UnitToggler />
      </nav>

      <!-- 라우트별 뷰 컴포넌트 렌더링 영역 -->
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
/* 실습 공통 스타일시트 로드 */
@import '@/assets/exercise.css';

/* 네비게이션 실시간 위험 뱃지 스타일 */
.nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #e74c3c;
  color: white;
  font-size: 11px;
  font-weight: bold;
  border-radius: 10px;
  padding: 1px 6px;
  margin-left: 4px;
  vertical-align: middle;
}
</style>
