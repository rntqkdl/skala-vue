<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { ElMessage } from 'element-plus'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'quick-inspect'])

const handleToggleFavorite = () => {
  weatherStore.toggleFavorite(props.item.id)
  const isFav = weatherStore.favorites.includes(props.item.id)
  ElMessage.success({
    message: isFav ? `⭐ '${props.item.name}' 산단이 즐겨찾기에 등록되었습니다.` : `'${props.item.name}' 산단이 즐겨찾기에서 해제되었습니다.`,
    duration: 2000,
  })
}

const handleDelete = () => {
  weatherStore.deleteComplex(props.item.id)
  ElMessage.info({
    message: `'${props.item.name}' 산단 관제가 목록에서 삭제되었습니다.`,
    duration: 2000,
  })
}

// 공정 리스크 점수 (0 ~ 100%)
const riskPercentage = computed(() => {
  if (props.item.temp >= 35 || props.item.humidity >= 90) return 90
  if (props.item.temp >= 30 || props.item.humidity >= 80) return 70
  if (props.item.temp >= 24) return 40
  return 15
})

const riskStatus = computed(() => {
  if (riskPercentage.value >= 80) return 'exception'
  if (riskPercentage.value >= 60) return 'warning'
  return 'success'
})
</script>

<template>
  <div
    class="resend-weather-card"
    @click="emit('click-detail', item)"
  >
    <!-- 상단: 산단 명칭 + 즐겨찾기 별 + 실시간 기상 상태 -->
    <div class="card-top-row">
      <div class="title-cluster">
        <button
          class="btn-fav-star"
          :class="{ active: weatherStore.favorites.includes(item.id) }"
          @click.stop="handleToggleFavorite"
          title="즐겨찾기 토글"
        >
          {{ weatherStore.favorites.includes(item.id) ? '★' : '☆' }}
        </button>
        <h4 class="complex-title">{{ item.name }}</h4>
        <span class="industry-chip">{{ item.industry }}</span>
      </div>

      <div class="weather-pill">
        <img
          v-if="item.icon"
          :src="`https://openweathermap.org/img/wn/${item.icon}.png`"
          alt="날씨 아이콘"
          class="weather-icon-img"
        />
        <span>{{ item.status }}</span>
      </div>
    </div>

    <!-- 본문: 내장 지표 박스 -->
    <div class="embedded-metrics-box">
      <div class="metric-cell">
        <span class="cell-label">현재 기온</span>
        <strong class="cell-value">{{ configStore.formatTemp(item.temp) }}</strong>
        <span class="cell-sub">체감 {{ configStore.formatTemp(item.feels_like) }}</span>
      </div>

      <div class="metric-cell">
        <span class="cell-label">대기 환경</span>
        <strong class="cell-value">{{ item.humidity }}%</strong>
        <span class="cell-sub">풍속 {{ item.wind }}m/s</span>
      </div>

      <div class="metric-cell highlight-cell">
        <el-tooltip
          effect="dark"
          :content="`과거 재해 원인: ${item.incident?.cause || '설비 열화 및 이상 기상'}`"
          placement="top"
        >
          <div class="metric-stack">
            <span class="cell-label">{{ item.metricLabel || '공정 위험도' }} ℹ️</span>
            <strong class="cell-value risk-val">{{ item.processRiskText || '+7.5μm' }}</strong>
            <span class="cell-sub">위험 부하 {{ riskPercentage }}%</span>
          </div>
        </el-tooltip>
      </div>

      <div class="metric-cell progress-gauge-cell">
        <span class="cell-label">위험도 게이지</span>
        <el-progress
          :percentage="riskPercentage"
          :status="riskStatus"
          :stroke-width="5"
          :show-text="false"
          class="custom-risk-progress"
        />
        <span class="cell-sub font-mono">
          {{ riskStatus === 'exception' ? '🚨 위험' : riskStatus === 'warning' ? '⚠️ 주의' : '✅ 정상' }}
        </span>
      </div>
    </div>

    <!-- 하단: Resend 다크 뱃지 그룹 + 액션 버튼 그룹 -->
    <div class="card-bottom-row">
      <div class="resend-badge-group">
        <span v-if="item.temp >= 30" class="resend-badge badge-coral">🔥 폭염 주의</span>
        <span v-else-if="item.temp >= 24" class="resend-badge badge-warning">🌤️ 온화함</span>
        <span v-else class="resend-badge badge-info">❄️ 선선함</span>

        <span v-if="item.pm25 > 35" class="resend-badge badge-coral">😷 미세먼지 나쁨</span>
        <span v-else class="resend-badge badge-mint">🌿 대기질 양호</span>

        <span v-if="weatherStore.favorites.includes(item.id)" class="resend-badge badge-yellow">⭐ 즐겨찾기</span>
      </div>

      <div class="action-cluster" @click.stop>
        <!-- Ant Design Popconfirm 안전 삭제 버튼 -->
        <a-popconfirm
          :title="`'${item.name}' 산단을 관제 목록에서 삭제하시겠습니까?`"
          ok-text="삭제"
          cancel-text="취소"
          @confirm="handleDelete"
        >
          <button class="btn-secondary btn-sm" title="산단 삭제">🗑️ 삭제</button>
        </a-popconfirm>

        <!-- 신속 SOP 프리뷰 드로어 트리거 -->
        <button class="btn-secondary btn-sm" @click.stop="emit('quick-inspect', item)">⚡ 점검표</button>

        <!-- Resend 시그니처 화이트 기본 버튼 (#fcfdff) -->
        <button class="btn-primary btn-sm" @click.stop="emit('click-detail', item)">상세보기 →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resend-weather-card {
  background: var(--colors-surface-card, #0a0a0c);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.08));
  border-radius: var(--rounded-lg, 12px);
  padding: 18px 22px;
  margin-bottom: 14px;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.resend-weather-card:hover {
  border-color: var(--colors-hairline-strong, rgba(255, 255, 255, 0.22));
  background: #0e0e11;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.title-cluster {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-fav-star {
  background: transparent;
  border: none;
  font-size: 18px;
  color: var(--colors-stone, #464a4d);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s ease;
}

.btn-fav-star:hover,
.btn-fav-star.active {
  color: var(--colors-accent-yellow, #ffc53d);
}

.complex-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: var(--colors-ink, #fcfdff);
}

.industry-chip {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #a1a4a5);
  background: var(--colors-surface-elevated, #101012);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.08));
  padding: 2px 6px;
  border-radius: var(--rounded-xs, 4px);
}

.weather-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--colors-charcoal, rgba(252, 253, 255, 0.70));
  background: var(--colors-surface-elevated, #101012);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.08));
  padding: 3px 10px;
  border-radius: var(--rounded-full, 9999px);
}

.weather-icon-img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.embedded-metrics-box {
  background: var(--colors-surface-deep, #06060a);
  border: 1px solid var(--colors-hairline, rgba(255, 255, 255, 0.06));
  border-radius: var(--rounded-md, 8px);
  display: grid;
  grid-template-columns: 1fr 1fr 1.35fr 1fr;
  padding: 12px 14px;
  gap: 10px;
  margin-bottom: 14px;
}

.metric-cell {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 0;
}

.metric-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.cell-label {
  display: block;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--colors-mute, #a1a4a5);
  margin-bottom: 3px;
  white-space: nowrap;
}

.cell-value {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--colors-ink, #fcfdff);
  line-height: 1.35;
  margin-bottom: 2px;
  word-break: keep-all;
}

.cell-sub {
  display: block;
  font-size: 11px;
  color: var(--colors-ash, #888e90);
  line-height: 1.3;
  margin-top: 1px;
}

.font-mono {
  font-family: var(--font-mono);
}

.highlight-cell .risk-val {
  color: var(--colors-accent-orange, #ff801f);
}

.progress-gauge-cell {
  justify-content: center;
}

.custom-risk-progress {
  margin: 4px 0;
}

.card-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.resend-badge-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.action-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
