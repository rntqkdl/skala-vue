<script setup>
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const handleToggleFavorite = () => {
  weatherStore.toggleFavorite(props.item.id)
}

const handleDelete = () => {
  weatherStore.deleteComplex(props.item.id)
}
</script>

<template>
  <div
    class="cal-weather-card"
    @click="emit('select-card', `${item.name} 관제 공정이 선택되었습니다.`)"
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
        <span class="industry-label">{{ item.industry }}</span>
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

    <!-- 본문: Cal.com 제품 UI 프래그먼트 스타일의 실시간 지표 박스 -->
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
        <span class="cell-label">{{ item.metricLabel || '공정 리스크' }}</span>
        <strong class="cell-value risk-val">{{ item.processRiskText || '+7.5μm' }}</strong>
        <span class="cell-sub">특화 지표</span>
      </div>
    </div>

    <!-- 하단: 파스텔 뱃지 그룹 + 액션 버튼 그룹 -->
    <div class="card-bottom-row">
      <div class="pastel-badge-group">
        <span v-if="item.temp >= 30" class="cal-badge badge-red">🔥 고온 주의</span>
        <span v-else-if="item.temp >= 24" class="cal-badge badge-orange">🌤️ 온화함</span>
        <span v-else class="cal-badge badge-blue">❄️ 선선함</span>

        <span v-if="item.pm25 > 35" class="cal-badge badge-red">😷 미세먼지 나쁨</span>
        <span v-else class="cal-badge badge-emerald">🌿 대기질 양호</span>

        <span v-if="weatherStore.favorites.includes(item.id)" class="cal-badge badge-gold"
          >⭐ 즐겨찾기</span
        >
      </div>

      <div class="action-cluster" @click.stop>
        <!-- Ant Design Popconfirm 안전 삭제 버튼 -->
        <a-popconfirm
          :title="`'${item.name}' 산단을 관제 목록에서 삭제하시겠습니까?`"
          ok-text="삭제"
          cancel-text="취소"
          @confirm="handleDelete"
        >
          <button class="cal-btn-secondary" title="산단 삭제">🗑️ 삭제</button>
        </a-popconfirm>

        <!-- Cal.com 시그니처 블랙 기본 버튼 (#111111) -->
        <button class="cal-btn-primary" @click.stop="emit('click-detail', item)">상세보기 →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cal-weather-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.cal-weather-card:hover {
  transform: translateY(-2px);
  border-color: #d1d5db;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-fav-star {
  background: transparent;
  border: none;
  font-size: 17px;
  color: #d1d5db;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s ease;
}

.btn-fav-star:hover,
.btn-fav-star.active {
  color: #f59e0b;
}

.complex-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #111111;
}

.industry-label {
  font-size: 11px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 7px;
  border-radius: 4px;
}

.weather-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 2px 8px;
  border-radius: 9999px;
}

.weather-icon-img {
  width: 22px;
  height: 22px;
  vertical-align: middle;
}

.embedded-metrics-box {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1.3fr;
  padding: 10px 12px;
  gap: 8px;
  margin-bottom: 12px;
}

.metric-cell {
  display: flex;
  flex-direction: column;
}

.cell-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 2px;
}

.cell-value {
  font-size: 13px;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.3px;
}

.cell-sub {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 1px;
}

.risk-val {
  color: #d97706 !important;
}

.card-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.pastel-badge-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.cal-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}

.badge-red {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fee2e2;
}

.badge-orange {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #ffedd5;
}

.badge-blue {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #dbeafe;
}

.badge-emerald {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #d1fae5;
}

.badge-gold {
  background: #fefce8;
  color: #a16207;
  border: 1px solid #fef08a;
}

.action-cluster {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.cal-btn-secondary {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #dc2626;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cal-btn-secondary:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

.cal-btn-primary {
  background: #111111;
  color: #ffffff;
  border: 1px solid #111111;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cal-btn-primary:hover {
  background: #262626;
  border-color: #262626;
}
</style>
