<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const selectedCityId = ref('city_01')
const activeMetric = ref('temp') // 'temp' | 'humidity' | 'expansion'
const hoveredIndex = ref(null)

const currentComplex = computed(() => {
  return (
    weatherStore.complexes.find((c) => c.id === selectedCityId.value) ||
    weatherStore.complexes[0] ||
    null
  )
})

// 24시간 시간대별 데이터 포인트 생성 (실제 API 예보 데이터 또는 정밀 시뮬레이션 포인트)
const chartDataPoints = computed(() => {
  if (!currentComplex.value) return []
  const fc = currentComplex.value.forecast || []

  if (fc.length >= 6) {
    return fc.slice(0, 8).map((item, idx) => {
      const temp = item.temp || 25
      const humidity = item.humidity || 55
      const expansion = Number((Math.max(0, temp - 20) * 1.5 + 3.0).toFixed(1))
      return {
        label: item.time || `${idx * 3}:00`,
        temp,
        humidity,
        expansion,
        pop: item.pop || 0,
      }
    })
  }

  // 기본 8개 시간대 (3시간 간격) 목업 시뮬레이션 생성
  const baseTemp = currentComplex.value.temp || 25
  const baseHum = currentComplex.value.humidity || 60
  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
  const tempDeltas = [-2.5, -3.2, -1.8, 1.2, 4.5, 5.2, 2.8, 0.5]

  return hours.map((h, i) => {
    const temp = Number((baseTemp + tempDeltas[i]).toFixed(1))
    const humidity = Math.max(20, Math.min(98, Math.round(baseHum - tempDeltas[i] * 4.5)))
    const expansion = Number((Math.max(0, temp - 20) * 1.5 + 3.0).toFixed(1))
    return {
      label: h,
      temp,
      humidity,
      expansion,
      pop: humidity > 75 ? 60 : 10,
    }
  })
})

// 차트 SVG 계산 (너비 600, 높이 220, 여백: 상20, 하30, 좌40, 우20)
const svgW = 600
const svgH = 220
const padLeft = 45
const padRight = 25
const padTop = 25
const padBottom = 35

const plotW = svgW - padLeft - padRight
const plotH = svgH - padTop - padBottom

const metricConfig = computed(() => {
  switch (activeMetric.value) {
    case 'temp':
      return {
        key: 'temp',
        label: '기온 추이',
        unit: configStore.unitSymbol,
        color: '#0066cc',
        gradientStart: 'rgba(0, 102, 204, 0.35)',
        gradientEnd: 'rgba(0, 102, 204, 0.02)',
        minVal: 10,
        maxVal: 40,
      }
    case 'humidity':
      return {
        key: 'humidity',
        label: '습도 추이',
        unit: '%',
        color: '#34c759',
        gradientStart: 'rgba(52, 199, 89, 0.35)',
        gradientEnd: 'rgba(52, 199, 89, 0.02)',
        minVal: 0,
        maxVal: 100,
      }
    case 'expansion':
      return {
        key: 'expansion',
        label: '설비 열변형',
        unit: 'μm',
        color: '#f56300',
        gradientStart: 'rgba(245, 99, 0, 0.35)',
        gradientEnd: 'rgba(245, 99, 0, 0.02)',
        minVal: 0,
        maxVal: 30,
      }
    default:
      return {}
  }
})

// 각 점의 X, Y 좌표 계산
const computedPoints = computed(() => {
  const pts = chartDataPoints.value
  if (!pts || pts.length === 0) return []
  const { key, minVal, maxVal } = metricConfig.value
  const count = pts.length

  return pts.map((p, idx) => {
    const x = padLeft + (idx / (count - 1)) * plotW
    const val = p[key]
    const clampedVal = Math.max(minVal, Math.min(maxVal, val))
    const y = padTop + plotH - ((clampedVal - minVal) / (maxVal - minVal)) * plotH
    return {
      x,
      y,
      val,
      data: p,
    }
  })
})

// SVG Polyline / Path 문자열
const linePathString = computed(() => {
  const pts = computedPoints.value
  if (pts.length === 0) return ''
  return pts.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`
  }, '')
})

const areaPathString = computed(() => {
  const pts = computedPoints.value
  if (pts.length === 0) return ''
  const bottomY = padTop + plotH
  const linePart = linePathString.value
  const firstX = pts[0].x
  const lastX = pts[pts.length - 1].x
  return `${linePart} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`
})

onMounted(async () => {
  if (
    currentComplex.value &&
    (!currentComplex.value.forecast || currentComplex.value.forecast.length === 0)
  ) {
    await weatherStore.fetchCityForecast(currentComplex.value)
  }
})

watch(selectedCityId, async (newId) => {
  const target = weatherStore.complexes.find((c) => c.id === newId)
  if (target && (!target.forecast || target.forecast.length === 0)) {
    await weatherStore.fetchCityForecast(target)
  }
})
</script>

<template>
  <el-card shadow="never" class="trend-chart-card" :body-style="{ padding: '18px 22px' }">
    <div class="chart-header-row">
      <div class="chart-title-left">
        <h4 class="chart-main-title">24시간 공정 리스크 및 기상 정밀 예측 곡선</h4>
        <span class="chart-caption font-mono">OpenWeatherMap 3시간 단위 수치 예측 모델 시각화</span>
      </div>

      <div class="chart-controls-right">
        <!-- 산단 선택 -->
        <el-select v-model="selectedCityId" size="small" style="width: 140px">
          <el-option
            v-for="c in weatherStore.complexes"
            :key="c.id"
            :label="c.name"
            :value="c.id"
          />
        </el-select>

        <!-- 지표 전환 세그먼트 -->
        <el-segmented
          v-model="activeMetric"
          :options="[
            { label: '🌡️ 기온', value: 'temp' },
            { label: '💧 습도', value: 'humidity' },
            { label: '⚙️ 열변형', value: 'expansion' },
          ]"
          size="small"
        />
      </div>
    </div>

    <!-- 차트 렌더링 뷰포트 (Pure Vue 3 Responsive SVG) -->
    <div class="chart-svg-container">
      <svg class="trend-svg" :viewBox="`0 0 ${svgW} ${svgH}`" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="metricConfig.gradientStart" />
            <stop offset="100%" :stop-color="metricConfig.gradientEnd" />
          </linearGradient>
        </defs>

        <!-- 그리드 가로선 (4개 분할) -->
        <g class="chart-grid-lines">
          <line
            v-for="i in 4"
            :key="i"
            :x1="padLeft"
            :y1="padTop + (plotH / 3) * (i - 1)"
            :x2="svgW - padRight"
            :y2="padTop + (plotH / 3) * (i - 1)"
            class="grid-line"
          />
        </g>

        <!-- Y축 눈금 텍스트 -->
        <g class="y-axis-labels font-mono">
          <text :x="padLeft - 8" :y="padTop + 4" text-anchor="end">
            {{ metricConfig.maxVal }}{{ metricConfig.unit }}
          </text>
          <text :x="padLeft - 8" :y="padTop + plotH / 2 + 4" text-anchor="end">
            {{ Math.round((metricConfig.maxVal + metricConfig.minVal) / 2) }}{{ metricConfig.unit }}
          </text>
          <text :x="padLeft - 8" :y="padTop + plotH + 2" text-anchor="end">
            {{ metricConfig.minVal }}{{ metricConfig.unit }}
          </text>
        </g>

        <!-- 영역 채우기 Gradient Area -->
        <path :d="areaPathString" fill="url(#areaGradient)" />

        <!-- 추이 선 (Curve Line) -->
        <path
          :d="linePathString"
          fill="none"
          :stroke="metricConfig.color"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- 데이터 포인트 & 호버 인터랙션 -->
        <g
          v-for="(pt, idx) in computedPoints"
          :key="idx"
          class="point-group"
          @mouseenter="hoveredIndex = idx"
          @mouseleave="hoveredIndex = null"
        >
          <!-- X축 시간 라벨 -->
          <text
            :x="pt.x"
            :y="padTop + plotH + 18"
            text-anchor="middle"
            class="x-axis-text font-mono"
          >
            {{ pt.data.label }}
          </text>

          <!-- 호버 시 수직 가이드 라인 -->
          <line
            v-if="hoveredIndex === idx"
            :x1="pt.x"
            :y1="padTop"
            :x2="pt.x"
            :y2="padTop + plotH"
            stroke="var(--colors-mute)"
            stroke-dasharray="3 3"
            stroke-width="1.2"
          />

          <!-- 점 외곽 링 -->
          <circle
            :cx="pt.x"
            :cy="pt.y"
            :r="hoveredIndex === idx ? 6 : 4"
            :fill="metricConfig.color"
            stroke="#ffffff"
            stroke-width="2"
            class="data-circle"
          />
        </g>
      </svg>

      <!-- 호버 툴팁 (선택된 시점 세부 데이터 오버레이) -->
      <div v-if="hoveredIndex !== null && computedPoints[hoveredIndex]" class="chart-tooltip-box">
        <div class="tooltip-time font-mono">{{ computedPoints[hoveredIndex].data.label }} 예보</div>
        <div class="tooltip-value">
          {{ metricConfig.label }}:
          <strong>{{ computedPoints[hoveredIndex].val }}{{ metricConfig.unit }}</strong>
        </div>
        <div class="tooltip-sub">
          기온 {{ configStore.formatTemp(computedPoints[hoveredIndex].data.temp) }} · 습도
          {{ computedPoints[hoveredIndex].data.humidity }}%
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.trend-chart-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  margin-bottom: 18px;
  box-shadow: var(--shadow-apple-card);
}

[data-theme='dark'] .trend-chart-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

.chart-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-main-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .chart-main-title {
  color: #f5f5f7 !important;
}

.chart-caption {
  font-size: 12px;
  color: var(--colors-mute, #86868b);
}

.chart-controls-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.chart-svg-container {
  position: relative;
  width: 100%;
  height: 200px;
  background: var(--colors-canvas, #f5f5f7);
  border-radius: var(--rounded-md, 12px);
  padding: 8px 12px 14px 12px;
}

[data-theme='dark'] .chart-svg-container {
  background: #141416;
}

.trend-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.grid-line {
  stroke: var(--colors-hairline-soft, #e5e5ea);
  stroke-dasharray: 4 4;
}

[data-theme='dark'] .grid-line {
  stroke: #2c2c2e;
}

.y-axis-labels text {
  font-size: 10px;
  fill: var(--colors-mute, #86868b);
}

[data-theme='dark'] .y-axis-labels text {
  fill: #8e8e93;
}

.x-axis-text {
  font-size: 10.5px;
  fill: var(--colors-mute, #86868b);
  cursor: pointer;
}

[data-theme='dark'] .x-axis-text {
  fill: #a1a1a6;
}

.point-group {
  cursor: pointer;
}

.data-circle {
  transition: r 0.15s ease;
}

.chart-tooltip-box {
  position: absolute;
  top: 10px;
  left: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-sm, 8px);
  padding: 8px 12px;
  font-size: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  z-index: 10;
}

[data-theme='dark'] .chart-tooltip-box {
  background: rgba(26, 26, 28, 0.95);
  border-color: #38383a;
  color: #f5f5f7;
}

.tooltip-time {
  font-size: 11px;
  color: var(--colors-mute, #86868b);
  margin-bottom: 2px;
}

.tooltip-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--colors-primary, #0066cc);
}

[data-theme='dark'] .tooltip-value {
  color: #2997ff;
}

.tooltip-sub {
  font-size: 11px;
  color: var(--colors-charcoal, #515154);
  margin-top: 2px;
}

[data-theme='dark'] .tooltip-sub {
  color: #d2d2d7;
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
