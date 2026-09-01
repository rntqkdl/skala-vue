<script setup>
import { ref } from 'vue'

const currentMode = import.meta.env.MODE
const isDev = import.meta.env.DEV
const apiKeyPrefix = ref(
  (import.meta.env.VITE_OPENWEATHER_API_KEY || 'd2b5a5dafabfd6672625a209f2f74423').slice(0, 8) +
    '...',
)
const rawBaseUrl = import.meta.env.VITE_OPENWEATHER_BASE_URL
const baseUrl =
  typeof rawBaseUrl === 'string' && /^https?:\/\//i.test(rawBaseUrl.trim())
    ? rawBaseUrl.trim().replace(/\/+$/, '')
    : 'https://api.openweathermap.org/data/2.5'
</script>

<template>
  <div class="practice-section">
    <h2>18단원: Vite 빌드 환경 및 환경 변수(.env) 주입 실습</h2>
    <p class="section-desc">
      교재 250p~274p: Vite 환경 변수(VITE_*), 빌드 모드, 번들링 및 정적 자산 배포 검증
    </p>

    <div class="env-info-grid">
      <div class="env-card">
        <span class="env-title">현재 실행 모드 (MODE)</span>
        <strong class="env-val font-mono">{{ currentMode }}</strong>
        <span class="env-sub">{{
          isDev ? '로컬 개발 서버 (HMR 활성)' : '프로덕션 빌드 번들'
        }}</span>
      </div>

      <div class="env-card">
        <span class="env-title">VITE_OPENWEATHER_API_KEY</span>
        <strong class="env-val font-mono">{{ apiKeyPrefix }}</strong>
        <span class="env-sub">환경 변수 격리 보관 (.env)</span>
      </div>

      <div class="env-card">
        <span class="env-title">VITE_OPENWEATHER_BASE_URL</span>
        <strong class="env-val font-mono">{{ baseUrl }}</strong>
        <span class="env-sub">OpenWeatherMap REST API 엔드포인트</span>
      </div>

      <div class="env-card">
        <span class="env-title">코드 품질 검사 기준</span>
        <strong class="env-val font-mono">ESLint + Oxlint</strong>
        <span class="env-sub">Prettier 일괄 포맷팅 준수</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
}

.env-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.env-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
}

[data-theme='dark'] .env-card {
  background: #1e1e20;
  border-color: #2e2e32;
}

.env-title {
  font-size: 11.5px;
  color: #64748b;
  margin-bottom: 4px;
}

.env-val {
  font-size: 14px;
  font-weight: 600;
  color: #0066cc;
  margin-bottom: 4px;
  word-break: break-all;
}

[data-theme='dark'] .env-val {
  color: #2997ff;
}

.env-sub {
  font-size: 11.5px;
  color: #94a3b8;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
