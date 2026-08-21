<script setup>
import { useConfigStore } from '@/stores/configStore'

// 1. 설정 스토어 연결
const configStore = useConfigStore()

// 2. 상위로부터 산업단지 객체 데이터를 수신
defineProps({
  item: {
    type: Object,
    required: true,
  },
})

// 3. 상위로 송신할 두 가지 커스텀 이벤트 등록
const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div class="weather-card" @click="emit('select-card', `${item.name} 공정이 선택되었습니다.`)">
    <h4>{{ item.name }} ({{ item.status }})</h4>
    <p>현재 기온: {{ configStore.formatTemp(item.temp) }}</p>
    <p>공정 습도: {{ item.humidity }}%</p>
    <p>열변형 오차: +{{ item.expansionRate }}μm</p>

    <!-- 기온별 3단계 뱃지  -->
    <span v-if="item.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else-if="item.temp >= 20" class="badge warm">🌤️ 따뜻함</span>
    <span v-else class="badge cool">❄️ 선선함</span>

    <!-- 상세보기 버튼 -->
    <button class="btn-detail" @click.stop="emit('click-detail', item)">상세보기</button>
  </div>
</template>

<style scoped>
/* 카드 컴포넌트 레이아웃 */
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}

.weather-card h4 {
  margin: 0 0 6px 0;
  font-size: 1.05rem;
  color: #2c3e50;
}

.weather-card p {
  margin: 0 0 4px 0;
  color: #495057;
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
  margin-right: 6px;
  margin-top: 4px;
}

.hot {
  background-color: #ff7675;
}

.warm {
  background-color: #f39c12;
}

.cool {
  background-color: #74b9ff;
}

.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 12px;
}

.btn-detail:hover {
  background-color: #f1f3f5;
}
</style>
