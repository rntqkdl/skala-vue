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
  if (confirm(`'${props.item.name}' 산단을 관제 목록에서 삭제하시겠습니까?`)) {
    weatherStore.deleteComplex(props.item.id)
  }
}
</script>

<template>
  <div
    class="weather-card"
    @click="emit('select-card', `${item.name} 관제 공정이 선택되었습니다.`)"
  >
    <!-- 상단: 산단 명칭 + 즐겨찾기 별 + 실시간 기상 상태 -->
    <div class="card-title-row">
      <div class="title-left">
        <button
          class="btn-fav"
          :class="{ active: weatherStore.favorites.includes(item.id) }"
          @click.stop="handleToggleFavorite"
          title="즐겨찾기 토글"
        >
          {{ weatherStore.favorites.includes(item.id) ? '★' : '☆' }}
        </button>
        <h4>{{ item.name }}</h4>
      </div>

      <div class="title-right">
        <span class="weather-status-tag">
          <img
            v-if="item.icon"
            :src="`https://openweathermap.org/img/wn/${item.icon}.png`"
            alt="날씨 아이콘"
            class="weather-icon-img"
          />
          {{ item.status }}
        </span>
      </div>
    </div>

    <!-- 본문: 실시간 기상 및 공정 특화 위험 지표 -->
    <div class="card-metrics">
      <p>
        현재 기온: <strong>{{ configStore.formatTemp(item.temp) }}</strong>
        <small class="feels-text">(체감 {{ configStore.formatTemp(item.feels_like) }})</small>
      </p>
      <p>대기 습도: {{ item.humidity }}% | 풍속: {{ item.wind }}m/s</p>
      <p class="custom-risk-line">
        {{ item.metricLabel || '공정 위험 지표' }}:
        <strong class="risk-highlight">{{ item.processRiskText || '+7.5 μm' }}</strong>
      </p>
    </div>

    <!-- 하단: 공정 상태 뱃지 그룹 + 액션 버튼 그룹 (삭제 및 상세보기) -->
    <div class="card-footer-row">
      <div class="badge-group">
        <span v-if="item.temp >= 30" class="badge hot">🔥 고온 주의</span>
        <span v-else-if="item.temp >= 24" class="badge warm">🌤️ 온화함</span>
        <span v-else class="badge cool">❄️ 선선함</span>

        <span v-if="item.pm25 > 35" class="badge hot">😷 미세먼지 나쁨</span>
        <span v-else class="badge cool">🌿 대기질 양호</span>

        <span v-if="weatherStore.favorites.includes(item.id)" class="badge fav-tag"
          >⭐ 즐겨찾기</span
        >
      </div>

      <div class="action-btn-group">
        <!-- 가독성 높인 삭제 버튼 -->
        <button class="btn-delete-card" @click.stop="handleDelete" title="산단 관제 삭제">
          🗑️ 삭제
        </button>

        <!-- 상세보기 버튼 -->
        <button class="btn-detail" @click.stop="emit('click-detail', item)">상세보기 →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  background: #ffffff;
  border: 1px solid #dee2e6;
  padding: 14px 16px;
  margin-bottom: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-fav {
  background: transparent;
  border: none;
  font-size: 17px;
  color: #bdc3c7;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.15s ease;
}

.btn-fav:hover,
.btn-fav.active {
  color: #f1c40f;
}

.weather-card h4 {
  margin: 0;
  font-size: 1.05rem;
  color: #2c3e50;
  font-weight: 700;
}

.title-right {
  display: flex;
  align-items: center;
}

.weather-status-tag {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #576574;
  font-weight: 600;
  background: #f8f9fa;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.weather-icon-img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 2px;
}

.card-metrics p {
  margin: 0 0 4px 0;
  color: #495057;
  font-size: 0.9rem;
}

.card-metrics strong {
  color: #2c3e50;
}

.feels-text {
  font-size: 11px;
  color: #8395a7;
  margin-left: 4px;
}

.custom-risk-line {
  font-size: 0.9rem;
  color: #2c3e50;
}

.risk-highlight {
  color: #d35400 !important;
  font-weight: 700;
}

.card-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f2f6;
  flex-wrap: wrap;
  gap: 8px;
}

.badge-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 3px 7px;
  font-size: 11px;
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
}

.hot {
  background-color: #ff7675;
}

.warm {
  background-color: #f39c12;
}

.cool {
  background-color: #54a0ff;
}

.fav-tag {
  background-color: #f1c40f;
  color: #2d3436;
  font-weight: bold;
}

.action-btn-group {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.btn-delete-card {
  background: #fff5f5;
  border: 1px solid #ffc9c9;
  color: #e74c3c;
  border-radius: 4px;
  padding: 6px 9px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-delete-card:hover {
  background: #ffe3e3;
  border-color: #ffa8a8;
  color: #c92a2a;
}

.btn-detail {
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.btn-detail:hover {
  background-color: #1a252f;
}
</style>
