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
    message: isFav
      ? `'${props.item.name}' 산단이 즐겨찾기에 등록되었습니다.`
      : `'${props.item.name}' 산단이 즐겨찾기에서 해제되었습니다.`,
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
  <el-card
    shadow="hover"
    class="apple-ui-weather-card"
    :body-style="{ padding: '22px 26px' }"
    @click="emit('click-detail', item)"
  >
    <!-- 상단 헤더: 산단명 + 태그 + 즐겨찾기 + 실시간 날씨 -->
    <div class="card-header-flex">
      <div class="header-left-cluster">
        <button
          class="btn-fav-star"
          :class="{ active: weatherStore.favorites.includes(item.id) }"
          @click.stop="handleToggleFavorite"
          title="관제 즐겨찾기 토글"
        >
          {{ weatherStore.favorites.includes(item.id) ? '★' : '☆' }}
        </button>
        <h4 class="complex-title">{{ item.name }}</h4>
        <el-tag size="small" effect="plain" round class="industry-tag">
          {{ item.industry }}
        </el-tag>
      </div>

      <div class="header-right-cluster">
        <el-tag size="small" effect="light" round class="weather-status-tag">
          <img
            v-if="item.icon"
            :src="`https://openweathermap.org/img/wn/${item.icon}.png`"
            alt="날씨 아이콘"
            class="weather-icon-img"
          />
          <span>{{ item.status }}</span>
        </el-tag>
      </div>
    </div>

    <!-- 본문: 4분면 스마트 팩토리 계측 지표 (Element Plus Row/Col Grid) -->
    <div class="metrics-grid-container">
      <el-row :gutter="14">
        <el-col :xs="12" :sm="6">
          <div class="metric-block">
            <span class="m-label">외기 계측온</span>
            <strong class="m-val">{{ configStore.formatTemp(item.temp) }}</strong>
            <span class="m-sub">체감 {{ configStore.formatTemp(item.feels_like) }}</span>
          </div>
        </el-col>

        <el-col :xs="12" :sm="6">
          <div class="metric-block">
            <span class="m-label">플랜트 대기 환경</span>
            <strong class="m-val">{{ item.humidity }}%</strong>
            <span class="m-sub">풍속 {{ item.wind }}m/s</span>
          </div>
        </el-col>

        <el-col :xs="12" :sm="6">
          <div class="metric-block">
            <el-tooltip
              effect="dark"
              :content="`과거 재해 이력: ${item.incident?.cause || '설비 열화 및 이상 기상 부하'}`"
              placement="top"
            >
              <div class="metric-tooltip-wrapper">
                <span class="m-label">{{ item.metricLabel || '설비 열변형/부하' }} ⓘ</span>
                <strong class="m-val val-risk font-mono">{{
                  item.processRiskText || '+7.5μm'
                }}</strong>
                <span class="m-sub">공정 부하율 {{ riskPercentage }}%</span>
              </div>
            </el-tooltip>
          </div>
        </el-col>

        <el-col :xs="12" :sm="6">
          <div class="metric-block">
            <span class="m-label">공정 안전 등급</span>
            <el-progress
              :percentage="riskPercentage"
              :status="riskStatus"
              :stroke-width="6"
              :show-text="false"
              class="risk-progress-bar"
            />
            <span class="m-sub font-mono">
              {{
                riskStatus === 'exception'
                  ? '🚨 비상 점검 (SOP)'
                  : riskStatus === 'warning'
                    ? '⚠️ 주의 상태 (예비)'
                    : '✅ 정상 가동 (안정)'
              }}
            </span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 하단: 공정 상태 뱃지 그룹 + 액션 버튼 그룹 -->
    <div class="card-footer-flex">
      <div class="badge-cluster">
        <el-tag v-if="item.temp >= 30" size="small" type="danger" effect="light" round>
          🔥 폭염 부하
        </el-tag>
        <el-tag v-else-if="item.temp >= 24" size="small" type="warning" effect="light" round>
          🌤️ 외기 적정
        </el-tag>
        <el-tag v-else size="small" type="info" effect="light" round> ❄️ 선선함 </el-tag>

        <el-tag v-if="item.pm25 > 35" size="small" type="danger" effect="light" round>
          😷 분진 필터 점검
        </el-tag>
        <el-tag v-else size="small" type="success" effect="light" round> 🌿 클린룸 양호 </el-tag>

        <el-tag
          v-if="weatherStore.favorites.includes(item.id)"
          size="small"
          type="warning"
          effect="plain"
          round
        >
          ★ 중점 관리
        </el-tag>
      </div>

      <div class="action-button-cluster" @click.stop>
        <!-- Ant Design Popconfirm 안전 삭제 버튼 -->
        <a-popconfirm
          :title="`'${item.name}' 산단을 관제 목록에서 삭제하시겠습니까?`"
          ok-text="삭제"
          cancel-text="취소"
          @confirm="handleDelete"
        >
          <el-button size="small" round class="apple-sub-btn">삭제</el-button>
        </a-popconfirm>

        <!-- 신속 SOP 프리뷰 드로어 트리거 -->
        <el-button
          size="small"
          round
          class="apple-sub-btn"
          @click.stop="emit('quick-inspect', item)"
        >
          점검표
        </el-button>

        <!-- Apple 시그니처 액션 블루 알약 버튼 -->
        <el-button
          size="small"
          type="primary"
          round
          class="apple-primary-btn"
          @click.stop="emit('click-detail', item)"
        >
          상세 관제 →
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.apple-ui-weather-card {
  background-color: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  margin-bottom: 18px;
  cursor: pointer;
  box-shadow: var(--shadow-apple-card);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.apple-ui-weather-card:hover {
  border-color: #b0b0b5;
  box-shadow: var(--shadow-apple-hover);
  transform: translateY(-2px);
}

[data-theme='dark'] .apple-ui-weather-card {
  background-color: #1d1d1f;
  border-color: #333336;
}

[data-theme='dark'] .apple-ui-weather-card:hover {
  border-color: #48484a;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 10px;
}

.header-left-cluster {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-fav-star {
  background: transparent;
  border: none;
  font-size: 19px;
  color: var(--colors-stone, #d2d2d7);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition:
    transform 0.12s ease,
    color 0.15s ease;
}

.btn-fav-star:hover {
  transform: scale(1.15);
  color: var(--colors-primary, #0066cc);
}

.btn-fav-star.active {
  color: var(--colors-primary, #0066cc);
}

[data-theme='dark'] .btn-fav-star.active {
  color: #2997ff !important;
}

.complex-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .complex-title {
  color: #f5f5f7 !important;
}

.industry-tag {
  font-size: 12px;
  font-weight: 500;
}

.header-right-cluster {
  display: flex;
  align-items: center;
}

.weather-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 500;
  padding: 4px 10px;
}

.weather-icon-img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.metrics-grid-container {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  padding: 14px 18px;
  margin-bottom: 16px;
}

[data-theme='dark'] .metrics-grid-container {
  background: #161617;
  border-color: #272729;
}

.metric-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.metric-tooltip-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.m-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--colors-mute, #86868b);
  margin-bottom: 2px;
}

[data-theme='dark'] .m-label {
  color: #d2d2d7 !important;
}

.m-val {
  font-size: 16px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
  line-height: 1.35;
  margin-bottom: 2px;
}

[data-theme='dark'] .m-val {
  color: #f5f5f7 !important;
}

.val-risk {
  color: var(--colors-accent-orange, #f56300);
}

.m-sub {
  font-size: 11.5px;
  color: var(--colors-mute, #86868b);
}

[data-theme='dark'] .m-sub {
  color: #a1a1a6 !important;
}

.risk-progress-bar {
  width: 100%;
  margin: 4px 0;
}

.card-footer-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.badge-cluster {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.action-button-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
}

.apple-sub-btn {
  font-size: 12.5px;
  font-weight: 500;
  transition: transform 0.1s ease;
}

.apple-sub-btn:active {
  transform: scale(0.95);
}

.apple-primary-btn {
  background-color: var(--colors-primary, #0066cc) !important;
  border-color: var(--colors-primary, #0066cc) !important;
  font-size: 12.5px;
  font-weight: 500;
  transition: transform 0.1s ease;
}

.apple-primary-btn:hover {
  background-color: var(--colors-primary-focus, #0071e3) !important;
}

.apple-primary-btn:active {
  transform: scale(0.95);
}

.font-mono {
  font-family: var(--font-mono);
}
</style>
