<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAlertStore } from '@/stores/alertStore'
import UnitToggler from '@/components/handson/UnitToggler.vue'

// 상단 네비게이션 바에 실시간 경보 뱃지 연동
const alertStore = useAlertStore()
</script>

<template>
  <div class="app-container">
    <!-- 상단 브랜드 헤더 -->
    <header class="app-header">
      <h1>스마트 팩토리 기상 재해 관제 시스템</h1>
      <span class="header-sub">Industrial Weather & Process Risk Management Platform</span>
    </header>

    <!-- Cal.com Signature Nav-Pill-Group 내비게이션 바 -->
    <nav class="nav-pill-wrapper">
      <div class="nav-pill-group">
        <RouterLink to="/" class="nav-pill-item">
          <span>🌦️ 산단 대시보드</span>
        </RouterLink>
        <RouterLink to="/radar" class="nav-pill-item">
          <span>🗺️ 전국 레이더</span>
        </RouterLink>
        <RouterLink to="/alerts" class="nav-pill-item">
          <span>🚨 안전 수칙</span>
          <span v-if="alertStore.dangerCount > 0" class="nav-badge-pill">
            {{ alertStore.dangerCount }}
          </span>
        </RouterLink>
        <RouterLink to="/archive" class="nav-pill-item">
          <span>📚 기술 아카이브</span>
        </RouterLink>
        <RouterLink to="/about" class="nav-pill-item">
          <span>ℹ️ 서비스 소개</span>
        </RouterLink>
      </div>

      <!-- 단위 변환 스토어 토글러 -->
      <UnitToggler />
    </nav>

    <!-- 라우트별 뷰 컴포넌트 렌더링 영역 -->
    <main>
      <RouterView />
    </main>

    <!-- Cal.com Dark Footer (#101010) -->
    <footer class="cal-footer">
      <div class="footer-logo">SKALA SMART FACTORY CONSOLE</div>
      <p class="footer-desc">
        OpenWeatherMap 실시간 기상 API 연동 및 6대 국가산업단지 공정별 위험 예측 관제 시스템
      </p>
      <div class="footer-links">
        <RouterLink to="/">대시보드</RouterLink>
        <RouterLink to="/radar">기상레이더</RouterLink>
        <RouterLink to="/alerts">안전수칙</RouterLink>
        <RouterLink to="/archive">기술아카이브</RouterLink>
        <RouterLink to="/about">서비스소개</RouterLink>
      </div>
    </footer>
  </div>
</template>

<style>
/* Cal.com 전역 스타일시트 로드 */
@import '@/assets/exercise.css';
</style>
