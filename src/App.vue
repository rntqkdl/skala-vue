<script setup>
import { computed, watchEffect } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useAlertStore } from '@/stores/alertStore'
import { useWeatherStore } from '@/stores/weatherStore'
import UnitToggler from '@/components/handson/UnitToggler.vue'

const route = useRoute()
const configStore = useConfigStore()
const alertStore = useAlertStore()
const weatherStore = useWeatherStore()

// 폭염(33℃↑), 호우(90%↑), 위험 특보 발령 여부 감지
const isDangerActive = computed(() => {
  return (
    alertStore.dangerCount > 0 ||
    weatherStore.complexes.some((c) => c.temp >= 33 || c.humidity >= 90)
  )
})

// 스마트 테마 모드 산출
const activeTheme = computed(() => {
  if (configStore.themeMode === 'light') return 'light'
  if (configStore.themeMode === 'dark') return 'dark'
  // 'auto' (기본): 평소 가독성 높은 라이트 에디토리얼 -> 위험 특보 발생 시 다크 관제 모드 자동 전환
  return isDangerActive.value ? 'dark' : 'light'
})

// DOM root에 data-theme 속성 동기화
watchEffect(() => {
  document.documentElement.setAttribute('data-theme', activeTheme.value)
})

// 라우트 및 위험 상태에 따른 동적 Atmospheric Glow 색상 바인딩
const activeGlowClass = computed(() => {
  if (route.path === '/alerts' || alertStore.dangerCount > 0) return 'glow-red'
  if (route.path === '/radar') return 'glow-blue'
  if (route.path === '/about') return 'glow-green'
  return activeTheme.value === 'dark' ? 'glow-orange' : 'glow-blue'
})
</script>

<template>
  <div class="resend-app-container" :data-theme="activeTheme">
    <!-- 🌌 Dynamic Atmospheric Radial Glow Backdrop Layer -->
    <div class="atmospheric-glow-wrapper" :class="activeGlowClass"></div>

    <!-- 🧭 64px Editorial Top Navigation Bar -->
    <header class="resend-top-nav">
      <div class="top-nav-inner">
        <!-- 브랜드 로고 및 타이틀 -->
        <RouterLink to="/" class="nav-brand-group">
          <div class="brand-icon-box">⚡</div>
          <span class="brand-title">SKALA 산단 관제</span>
        </RouterLink>

        <!-- 메인 내비게이션 메뉴 (줄바꿈 방지 및 선명한 가독성 보장) -->
        <nav class="nav-links-menu">
          <RouterLink to="/" class="nav-link-item">
            <span>🌦️ 산단 대시보드</span>
          </RouterLink>
          <RouterLink to="/radar" class="nav-link-item">
            <span>🗺️ 전국 레이더</span>
          </RouterLink>
          <RouterLink to="/alerts" class="nav-link-item">
            <span>🚨 안전 수칙</span>
            <span v-if="alertStore.dangerCount > 0" class="nav-danger-pill font-mono">
              {{ alertStore.dangerCount }}
            </span>
          </RouterLink>
          <RouterLink to="/archive" class="nav-link-item">
            <span>📚 기술 아카이브</span>
          </RouterLink>
          <RouterLink to="/practices" class="nav-link-item">
            <span>🧪 교재 실습장</span>
          </RouterLink>
          <RouterLink to="/about" class="nav-link-item">
            <span>ℹ️ 서비스 소개</span>
          </RouterLink>
        </nav>

        <!-- 우측 단위 변환기 및 테마 제어 -->
        <div class="nav-actions-right">
          <UnitToggler />
        </div>
      </div>
    </header>

    <!-- 🖥️ 메인 뷰포트 컨테이너 -->
    <main class="resend-main-content">
      <RouterView />
    </main>

    <!-- 🏁 Clean Footer -->
    <footer class="resend-footer">
      <div class="footer-inner">
        <div class="footer-top-row">
          <div class="footer-brand-summary">
            <div class="footer-brand-title">SKALA INDUSTRIAL WEATHER CONSOLE</div>
            <p class="footer-brand-desc">
              OpenWeatherMap 실시간 기상 관측 데이터와 6대 국가산업단지 물리 위험 예측 모델을 결합한 B2B 엔터프라이즈 스마트 공정 안전 관리 플랫폼입니다.
            </p>
          </div>
          <div class="footer-nav-grid">
            <div class="footer-nav-col">
              <span class="footer-col-head">관제 서비스</span>
              <RouterLink to="/" class="footer-link">산단 대시보드</RouterLink>
              <RouterLink to="/radar" class="footer-link">전국 기상 레이더</RouterLink>
              <RouterLink to="/alerts" class="footer-link">실시간 안전 수칙</RouterLink>
            </div>
            <div class="footer-nav-col">
              <span class="footer-col-head">엔지니어링 백서</span>
              <RouterLink to="/archive" class="footer-link">기술 백서 & ADR</RouterLink>
              <RouterLink to="/practices" class="footer-link">1~15단원 교재 실습장</RouterLink>
              <RouterLink to="/about" class="footer-link">재해 물리 메커니즘</RouterLink>
              <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer" class="footer-link">OpenWeatherMap API ↗</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom-row">
          <span>© 2026 SKALA Engineering. Vue.js 3 Production System.</span>
          <span>Reactive Smart Theme Switcher & Element Plus / Ant Design Dual UI</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* 전역 스타일시트는 main.js에서 통합 로드 */
</style>
