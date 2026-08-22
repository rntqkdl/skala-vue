<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { useAlertStore } from '@/stores/alertStore'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const alertStore = useAlertStore()

const activeComplexId = ref(null)

// 지도 상의 산단 좌표 (SVG 500x600 뷰박스 기준 상대 위치 매핑)
// 경도(126.0 ~ 130.0) -> X(60 ~ 440), 위도(34.0 ~ 38.5) -> Y(520 ~ 60)
const complexLocations = {
  city_01: { x: 310, y: 410, name: '창원' }, // 창원 (경남)
  city_02: { x: 375, y: 380, name: '울산' }, // 울산 (동남권)
  city_03: { x: 145, y: 310, name: '군산' }, // 군산 (전북 서해안)
  city_04: { x: 160, y: 420, name: '광주' }, // 광주 (호남 내륙)
  city_05: { x: 385, y: 300, name: '포항' }, // 포항 (경북 동해안)
  city_06: { x: 215, y: 480, name: '여수' }, // 여수 (남해안)
}

// 맵 상의 핀 목록 데이터 산출
const mapPins = computed(() => {
  return weatherStore.complexes.map((item) => {
    const loc = complexLocations[item.id] || { x: 250, y: 300, name: item.name }
    const alertInfo = alertStore.evaluatedAlerts.find((a) => a.id === item.id) || {}
    const isDanger = alertInfo.level === 'danger' || item.temp >= 33 || item.humidity >= 90
    const isWarning = alertInfo.level === 'warning' || item.temp >= 28 || item.pm25 > 35

    return {
      ...item,
      x: loc.x,
      y: loc.y,
      shortName: loc.name,
      isDanger,
      isWarning,
      statusClass: isDanger ? 'pin-danger' : isWarning ? 'pin-warning' : 'pin-normal',
    }
  })
})

const hoveredComplex = computed(() => {
  if (!activeComplexId.value) return null
  return weatherStore.complexes.find((c) => c.id === activeComplexId.value) || null
})

const handlePinClick = (item) => {
  router.push(`/weather/${item.id}`)
}
</script>

<template>
  <el-card shadow="never" class="national-map-card" :body-style="{ padding: '18px 22px' }">
    <div class="map-card-header">
      <div class="header-left">
        <div class="title-with-pulse">
          <span class="live-radar-dot"></span>
          <h3 class="map-title">전국 6대 국가산업단지 실시간 기상 관제 맵</h3>
        </div>
        <span class="map-sub font-mono"
          >대한민국 주요 산단 인프라 위치별 실시간 외기온 및 설비 위험도 텔레메트리</span
        >
      </div>

      <div class="map-legend">
        <span class="legend-item"><span class="legend-dot dot-normal"></span>정상</span>
        <span class="legend-item"><span class="legend-dot dot-warn"></span>주의</span>
        <span class="legend-item"><span class="legend-dot dot-danger"></span>특보/비상</span>
      </div>
    </div>

    <div class="map-viewport-container">
      <!-- 대한민국 벡터 SVG 지도 배경 -->
      <svg class="korea-svg-map" viewBox="0 0 500 580" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(0, 102, 204, 0.08)" />
            <stop offset="100%" stop-color="rgba(0, 102, 204, 0)" />
          </radialGradient>
          <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.25" />
          </filter>
        </defs>

        <!-- 배경 글로우 서클 -->
        <rect x="0" y="0" width="500" height="580" fill="url(#mapGlow)" />

        <!-- 한반도 윤곽선 (간략화된 SVG 실루엣 패스) -->
        <path
          class="map-land-path"
          d="M 170,30 
             C 210,35 240,40 280,50
             C 320,60 360,90 380,140
             C 400,190 415,250 420,320
             C 425,370 395,430 350,470
             C 310,500 240,530 180,520
             C 130,510 110,460 120,410
             C 125,370 140,330 130,290
             C 115,240 100,180 125,130
             C 140,90 150,50 170,30 Z"
        />

        <!-- 제주도 -->
        <ellipse cx="140" cy="545" rx="35" ry="16" class="map-island-path" />
        <!-- 울릉도 / 독도 -->
        <circle cx="455" cy="220" r="8" class="map-island-path" />
        <circle cx="480" cy="235" r="4" class="map-island-path" />

        <!-- 산단 간 관제 네트워크 연결 가상 통신선 -->
        <g class="network-lines">
          <line x1="145" y1="310" x2="160" y2="420" class="net-line" />
          <line x1="160" y1="420" x2="215" y2="480" class="net-line" />
          <line x1="215" y1="480" x2="310" y2="410" class="net-line" />
          <line x1="310" y1="410" x2="375" y2="380" class="net-line" />
          <line x1="375" y1="380" x2="385" y2="300" class="net-line" />
          <line x1="145" y1="310" x2="385" y2="300" class="net-line dash-line" />
        </g>

        <!-- 산단 핀 & 레이더 파동 렌더링 -->
        <g
          v-for="pin in mapPins"
          :key="pin.id"
          class="map-pin-group"
          :class="pin.statusClass"
          :transform="`translate(${pin.x}, ${pin.y})`"
          @mouseenter="activeComplexId = pin.id"
          @mouseleave="activeComplexId = null"
          @click="handlePinClick(pin)"
        >
          <!-- 펄스 레이더 파동 (주의/특보 시 지속 회전) -->
          <circle class="radar-pulse-ring ring-1" r="16" />
          <circle class="radar-pulse-ring ring-2" r="26" />

          <!-- 중심 핀 -->
          <circle class="pin-center-circle" r="8" filter="url(#shadowGlow)" />
          <circle class="pin-inner-dot" r="3.5" />

          <!-- 핀 라벨 뱃지 (기온 + 산단명) -->
          <g class="pin-label-badge" transform="translate(14, -12)">
            <rect class="label-bg" rx="6" ry="6" x="0" y="0" width="84" height="24" />
            <text class="label-name" x="8" y="16">{{ pin.shortName }}</text>
            <text class="label-temp" x="48" y="16">{{ configStore.formatTemp(pin.temp) }}</text>
          </g>
        </g>
      </svg>

      <!-- 마우스 호버 시 실시간 정밀 텔레메트리 툴팁 카드 -->
      <div v-if="hoveredComplex" class="map-hover-card">
        <div class="hover-head">
          <strong class="hover-title">{{ hoveredComplex.name }}</strong>
          <el-tag size="small" effect="plain" round>{{
            hoveredComplex.industry.split(' ')[0]
          }}</el-tag>
        </div>
        <div class="hover-grid">
          <div class="hover-item">
            <span class="h-label">현재 기온</span>
            <strong class="h-val">{{ configStore.formatTemp(hoveredComplex.temp) }}</strong>
          </div>
          <div class="hover-item">
            <span class="h-label">체감/습도</span>
            <strong class="h-val"
              >{{ configStore.formatTemp(hoveredComplex.feels_like) }} /
              {{ hoveredComplex.humidity }}%</strong
            >
          </div>
          <div class="hover-item">
            <span class="h-label">풍속/먼지</span>
            <strong class="h-val"
              >{{ hoveredComplex.wind }}m/s / {{ hoveredComplex.pm25 }}μg</strong
            >
          </div>
          <div class="hover-item">
            <span class="h-label">공정 부하</span>
            <strong class="h-val font-risk">{{ hoveredComplex.processRiskText }}</strong>
          </div>
        </div>
        <div class="hover-action-hint">클릭 시 정밀 상세 관제 화면으로 이동 →</div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.national-map-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  margin-bottom: 18px;
  box-shadow: var(--shadow-apple-card);
}

[data-theme='dark'] .national-map-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.map-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.title-with-pulse {
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-radar-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #0066cc;
  box-shadow: 0 0 10px #0066cc;
  animation: pulseDot 2s infinite ease-in-out;
}

[data-theme='dark'] .live-radar-dot {
  background-color: #2997ff;
  box-shadow: 0 0 10px #2997ff;
}

@keyframes pulseDot {
  0% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.7;
  }
}

.map-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .map-title {
  color: #f5f5f7 !important;
}

.map-sub {
  font-size: 12px;
  color: var(--colors-mute, #86868b);
}

.map-legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--colors-mute, #86868b);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-normal {
  background-color: #34c759;
}
.dot-warn {
  background-color: #f5a623;
}
.dot-danger {
  background-color: #ff3b30;
}

.map-viewport-container {
  position: relative;
  width: 100%;
  max-height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--colors-canvas, #f5f5f7);
  border-radius: var(--rounded-md, 12px);
  padding: 12px;
  overflow: hidden;
}

[data-theme='dark'] .map-viewport-container {
  background: #141416;
}

.korea-svg-map {
  width: 100%;
  max-width: 540px;
  height: 420px;
}

.map-land-path {
  fill: rgba(0, 102, 204, 0.05);
  stroke: rgba(0, 102, 204, 0.25);
  stroke-width: 1.8;
  stroke-linejoin: round;
}

[data-theme='dark'] .map-land-path {
  fill: rgba(41, 151, 255, 0.08);
  stroke: rgba(41, 151, 255, 0.35);
}

.map-island-path {
  fill: rgba(0, 102, 204, 0.08);
  stroke: rgba(0, 102, 204, 0.25);
  stroke-width: 1.5;
}

[data-theme='dark'] .map-island-path {
  fill: rgba(41, 151, 255, 0.1);
  stroke: rgba(41, 151, 255, 0.35);
}

.net-line {
  stroke: rgba(0, 102, 204, 0.18);
  stroke-width: 1.2;
}

[data-theme='dark'] .net-line {
  stroke: rgba(41, 151, 255, 0.22);
}

.dash-line {
  stroke-dasharray: 4 4;
}

.map-pin-group {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.map-pin-group:hover {
  transform: scale(1.12);
}

.pin-center-circle {
  fill: #34c759;
  stroke: #ffffff;
  stroke-width: 2;
  transition: fill 0.2s ease;
}

.pin-inner-dot {
  fill: #ffffff;
}

.pin-danger .pin-center-circle {
  fill: #ff3b30;
}

.pin-warning .pin-center-circle {
  fill: #f5a623;
}

.radar-pulse-ring {
  fill: none;
  stroke-width: 1.5;
  opacity: 0;
  transform-origin: 0 0;
}

.pin-danger .radar-pulse-ring {
  stroke: #ff3b30;
  animation: radarWave 2.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}

.pin-warning .radar-pulse-ring {
  stroke: #f5a623;
  animation: radarWave 3s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}

.pin-normal .radar-pulse-ring {
  stroke: #34c759;
}

.ring-2 {
  animation-delay: 0.8s !important;
}

@keyframes radarWave {
  0% {
    transform: scale(0.4);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.pin-label-badge {
  pointer-events: none;
}

.label-bg {
  fill: rgba(255, 255, 255, 0.92);
  stroke: var(--colors-hairline, #d2d2d7);
  stroke-width: 1;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.08));
}

[data-theme='dark'] .label-bg {
  fill: rgba(30, 30, 32, 0.92);
  stroke: #3a3a3c;
}

.label-name {
  font-size: 11px;
  font-weight: 600;
  fill: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .label-name {
  fill: #f5f5f7;
}

.label-temp {
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-mono);
  fill: var(--colors-primary, #0066cc);
}

[data-theme='dark'] .label-temp {
  fill: #2997ff;
}

.map-hover-card {
  position: absolute;
  bottom: 14px;
  right: 14px;
  width: 260px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-md, 12px);
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 10;
  animation: fadeIn 0.15s ease-in-out;
}

[data-theme='dark'] .map-hover-card {
  background: rgba(26, 26, 28, 0.95);
  border-color: #38383a;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.hover-title {
  font-size: 14px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .hover-title {
  color: #f5f5f7;
}

.hover-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 10px;
  margin-bottom: 8px;
}

.hover-item {
  display: flex;
  flex-direction: column;
}

.h-label {
  font-size: 10.5px;
  color: var(--colors-mute, #86868b);
}

.h-val {
  font-size: 12px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .h-val {
  color: #f5f5f7;
}

.font-risk {
  color: var(--colors-accent-orange, #f56300);
}

.hover-action-hint {
  font-size: 11px;
  color: var(--colors-primary, #0066cc);
  text-align: right;
  font-weight: 500;
}

[data-theme='dark'] .hover-action-hint {
  color: #2997ff;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
