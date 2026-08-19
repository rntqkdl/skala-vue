<script setup>
import { ref, computed } from 'vue'

// 1. 날씨 데이터 배열
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 29, status: '흐림' },
  { id: 'city_05', name: '대전', temp: 25, status: '맑음' },
  { id: 'city_06', name: '광주', temp: 21, status: '비' },
  { id: 'city_07', name: '대관령', temp: 18, status: '안개' }, // 20도 미만 테스트용 추가
])

// 2. 검색어 및 상태바 반응형 변수
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 3. 검색창 입력 시 실시간으로 카드 목록을 걸러주는 계산된 속성 (선택 사항)
const filteredWeatherList = computed(() => {
  if (!searchQuery.value) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(searchQuery.value.trim()))
})

// 4. 상세보기 알림창 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 1) 도시 검색 섹션 (:value + @input 한글 실시간 처리) -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <!-- 2) 날씨 카드 리스트 섹션 -->
    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이(가) 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <!-- 기온별 3단계 뱃지 (25도 이상 / 20~24도 / 20도 미만) -->
        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else-if="item.temp >= 20" class="badge warm">🌤️ 따뜻함 (20~24도)</span>
        <span v-else class="badge cool">❄️ 선선함 (20도 미만)</span>

        <!-- 상세보기 버튼 (이벤트 버블링 차단) -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <!-- 3) 하단 상태바 -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style>
/* 🎨 강의 전용 스타일 불러오기 */
@import '@/assets/exercise.css';
</style>
