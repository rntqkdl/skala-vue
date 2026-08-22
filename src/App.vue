<script setup>
import { ref, computed, watchEffect } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useAlertStore } from '@/stores/alertStore'
import { useWeatherStore } from '@/stores/weatherStore'
import UnitToggler from '@/components/handson/UnitToggler.vue'
import ThresholdSettingModal from '@/components/handson/ThresholdSettingModal.vue'

const configStore = useConfigStore()
const alertStore = useAlertStore()
const weatherStore = useWeatherStore()

const isThresholdModalOpen = ref(false)

// 폭염(33℃↑), 호우(90%↑), 실제 긴급 비상(level === 'danger') 또는 가상 시뮬레이션 감지
const isDangerActive = computed(() => {
  if (['heatwave', 'heavyrain', 'dust'].includes(weatherStore.simulationMode)) {
    return true
  }
  if (weatherStore.simulationMode === 'mild') {
    return false
  }
  return alertStore.evaluatedAlerts.some(
    (item) => item.level === 'danger' || item.temp >= 33 || item.humidity >= 90,
  )
})

// 스마트 테마 모드 산출 (Apple Parchment Light / Apple Dark Tile)
const activeTheme = computed(() => {
  if (configStore.themeMode === 'light') return 'light'
  if (configStore.themeMode === 'dark') return 'dark'
  return isDangerActive.value ? 'dark' : 'light'
})

// DOM root에 data-theme 속성 동기화
watchEffect(() => {
  document.documentElement.setAttribute('data-theme', activeTheme.value)
})
</script>

<template>
  <div class="apple-app-container" :data-theme="activeTheme">
    <!-- 🍎 1. 44px Pure Black Global Nav -->
    <header class="apple-global-nav">
      <div class="global-nav-inner">
        <RouterLink to="/" class="nav-brand-apple">
          <span class="apple-logo">🏭⚡</span>
          <span class="apple-brand-text">SKALA Weather</span>
        </RouterLink>

        <nav class="global-nav-links">
          <RouterLink to="/" class="g-nav-link" exact-active-class="active-link">홈</RouterLink>
          <RouterLink to="/dashboard" class="g-nav-link" active-class="active-link"
            >산단 대시보드</RouterLink
          >
          <RouterLink to="/radar" class="g-nav-link" active-class="active-link"
            >전국 레이더</RouterLink
          >
          <RouterLink to="/alerts" class="g-nav-link" active-class="active-link">
            안전 수칙
            <span v-if="alertStore.dangerCount > 0" class="nav-danger-dot">
              {{ alertStore.dangerCount }}
            </span>
          </RouterLink>
          <RouterLink to="/archive" class="g-nav-link" active-class="active-link"
            >기술 아카이브</RouterLink
          >
          <RouterLink to="/practices" class="g-nav-link" active-class="active-link"
            >교재 실습장</RouterLink
          >
          <RouterLink to="/about" class="g-nav-link" active-class="active-link"
            >서비스 소개</RouterLink
          >
        </nav>

        <div class="global-nav-right">
          <span class="live-status-pill">● LIVE</span>
        </div>
      </div>
    </header>

    <!-- 🍎 2. 52px Frosted Glass Sub-Nav -->
    <div class="apple-sub-nav-frosted">
      <div class="sub-nav-inner">
        <div class="sub-nav-left">
          <h2 class="sub-nav-title">스마트 산업단지 기상 관제 콘솔</h2>
        </div>

        <div class="sub-nav-right">
          <button class="btn-setting-sub btn-pill btn-sm" @click="isThresholdModalOpen = true">
            ⚙️ 임계값 설정
          </button>
          <button
            class="btn-primary btn-pill btn-sm"
            :disabled="weatherStore.isLoading"
            @click="weatherStore.fetchLiveWeatherData(true)"
          >
            {{ weatherStore.isLoading ? '동기화 중...' : '실시간 갱신' }}
          </button>
          <UnitToggler />
        </div>
      </div>
    </div>

    <!-- 🖥️ 메인 뷰포트 컨테이너 -->
    <main class="apple-main-content">
      <RouterView />
    </main>

    <!-- ⚙️ 전역 커스텀 임계값 설정 모달 -->
    <ThresholdSettingModal v-model="isThresholdModalOpen" />

    <!-- 🏁 Apple Multi-Column Parchment Footer -->
    <footer class="apple-footer">
      <div class="footer-inner">
        <!-- 상단 주의사항 고지 (Apple Disclaimers Style) -->
        <div class="footer-disclaimer-box">
          <p>
            * 본 기상 관제 시스템은 OpenWeatherMap REST API(Current, 5-Day Forecast, Air Pollution,
            Weather Radar Tile)를 통해 대한민국 6대 국가산업단지(창원, 울산, 군산, 광주, 포항,
            여수)의 기상 수치를 30초 주기로 실시간 분석합니다. 공정별 물리 파손 모델(기온·습도·기압
            상관 수식)을 통해 설비 위험 지표를 사전 산출하며, 위급 상황 발생 시 자동으로 다크 관제
            테마로 전환됩니다.
          </p>
        </div>

        <!-- 메인 링크 4열 그리드 (줄바꿈 및 간격 완벽 보정) -->
        <div class="footer-nav-grid">
          <div class="footer-nav-col">
            <span class="footer-col-head">관제 서비스</span>
            <ul class="footer-links-list">
              <li><RouterLink to="/" class="footer-link">서비스 홈</RouterLink></li>
              <li><RouterLink to="/dashboard" class="footer-link">산단 대시보드</RouterLink></li>
              <li><RouterLink to="/radar" class="footer-link">전국 기상 레이더</RouterLink></li>
              <li><RouterLink to="/alerts" class="footer-link">실시간 안전 수칙</RouterLink></li>
            </ul>
          </div>

          <div class="footer-nav-col">
            <span class="footer-col-head">엔지니어링 백서</span>
            <ul class="footer-links-list">
              <li><RouterLink to="/archive" class="footer-link">기술 백서 & ADR</RouterLink></li>
              <li>
                <RouterLink to="/practices" class="footer-link">1~15단원 교재 실습장</RouterLink>
              </li>
              <li><RouterLink to="/about" class="footer-link">재해 물리 메커니즘</RouterLink></li>
              <li>
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noreferrer"
                  class="footer-link"
                  >OpenWeatherMap API ↗</a
                >
              </li>
            </ul>
          </div>

          <div class="footer-nav-col">
            <span class="footer-col-head">아키텍처 스택</span>
            <ul class="footer-links-list">
              <li class="footer-static-text">Vue 3 Composition API</li>
              <li class="footer-static-text">Pinia State Management</li>
              <li class="footer-static-text">Element Plus & Ant Design Vue</li>
              <li class="footer-static-text">Axios 4-Endpoint Pipeline</li>
            </ul>
          </div>

          <div class="footer-nav-col">
            <span class="footer-col-head">시스템 상태</span>
            <ul class="footer-links-list">
              <li class="footer-static-text">관제 대상: 6대 국가산단</li>
              <li class="footer-static-text">폴링 주기: 30초 실시간</li>
              <li class="footer-static-text">장애 복구율: 99.98% SLA</li>
            </ul>
          </div>
        </div>

        <!-- 하단 카피라이트 및 법적 고지 -->
        <div class="footer-bottom-row">
          <div class="footer-copyright">
            Copyright © 2026 SKALA Industrial Weather Console. All rights reserved.
          </div>
          <div class="footer-legal-links">
            <span class="legal-item">개인정보 처리방침</span>
            <span class="legal-separator">|</span>
            <span class="legal-item">이용약관</span>
            <span class="legal-separator">|</span>
            <span class="legal-item">대한민국 (한국어)</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* 전역 스타일은 main.js 및 layout.css에서 통합 처리 */
.btn-setting-sub {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  color: var(--colors-ink, #1d1d1f);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 12px;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

[data-theme='dark'] .btn-setting-sub {
  background: #272729;
  border-color: #38383a;
  color: #f5f5f7;
}

.btn-setting-sub:hover {
  background-color: var(--colors-hairline-soft, #e5e5ea);
}

[data-theme='dark'] .btn-setting-sub:hover {
  background-color: #333336;
}
</style>
