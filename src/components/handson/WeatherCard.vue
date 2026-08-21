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
  <a-card
    class="custom-weather-card"
    :hoverable="true"
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
        <a-tag color="blue" class="weather-tag">
          <img
            v-if="item.icon"
            :src="`https://openweathermap.org/img/wn/${item.icon}.png`"
            alt="날씨 아이콘"
            class="weather-icon-img"
          />
          {{ item.status }}
        </a-tag>
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

    <!-- 하단: Ant Design 상태 태그 그룹 + 액션 버튼 그룹 (삭제 팝컨펌 및 상세보기) -->
    <div class="card-footer-row">
      <div class="tag-group">
        <a-tag v-if="item.temp >= 30" color="red">🔥 고온 주의</a-tag>
        <a-tag v-else-if="item.temp >= 24" color="orange">🌤️ 온화함</a-tag>
        <a-tag v-else color="cyan">❄️ 선선함</a-tag>

        <a-tag v-if="item.pm25 > 35" color="volcano">😷 미세먼지 나쁨</a-tag>
        <a-tag v-else color="green">🌿 대기질 양호</a-tag>

        <a-tag v-if="weatherStore.favorites.includes(item.id)" color="gold">⭐ 즐겨찾기</a-tag>
      </div>

      <div class="action-btn-group" @click.stop>
        <!-- Ant Design Popconfirm 적용된 안전 삭제 버튼 -->
        <a-popconfirm
          :title="`'${item.name}' 산단을 관제 목록에서 삭제하시겠습니까?`"
          ok-text="삭제"
          cancel-text="취소"
          @confirm="handleDelete"
        >
          <a-button danger size="small" class="btn-delete-antd"> 🗑️ 삭제 </a-button>
        </a-popconfirm>

        <!-- 상세보기 버튼 -->
        <a-button
          type="primary"
          size="small"
          class="btn-detail-antd"
          @click.stop="emit('click-detail', item)"
        >
          상세보기 →
        </a-button>
      </div>
    </div>
  </a-card>
</template>

<style scoped>
.custom-weather-card {
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  background: #ffffff;
}

.custom-weather-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
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
  color: #cbd5e1;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.15s ease;
}

.btn-fav:hover,
.btn-fav.active {
  color: #faad14;
}

h4 {
  margin: 0;
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 700;
}

.title-right {
  display: flex;
  align-items: center;
}

.weather-tag {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 4px;
}

.weather-icon-img {
  width: 22px;
  height: 22px;
  vertical-align: middle;
  margin-right: 2px;
}

.card-metrics p {
  margin: 0 0 4px 0;
  color: #475569;
  font-size: 0.9rem;
}

.card-metrics strong {
  color: #1e293b;
}

.feels-text {
  font-size: 11px;
  color: #94a3b8;
  margin-left: 4px;
}

.custom-risk-line {
  font-size: 0.9rem;
  color: #1e293b;
}

.risk-highlight {
  color: #d97706 !important;
  font-weight: 700;
}

.card-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
}

.action-btn-group {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.btn-delete-antd {
  font-size: 11px;
  border-radius: 4px;
}

.btn-detail-antd {
  font-size: 11px;
  border-radius: 4px;
  background: #1e293b;
  border-color: #1e293b;
}

.btn-detail-antd:hover {
  background: #0f172a !important;
  border-color: #0f172a !important;
}
</style>
