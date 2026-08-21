<script setup>
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록
defineEmits(['update-query'])

// 2. 상위로부터 현재 검색 상태 값을 수신
defineProps({
  query: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <h3>🔍 산업단지 검색</h3>
    <input
      type="text"
      :value="query"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 산업단지 이름 입력"
    />
    <p>
      검색 중인 지역: <strong>{{ query }}</strong>
    </p>
  </div>
</template>

<style scoped>
/* 검색 컴포넌트 레이아웃 */
.search-inner h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #2c3e50;
}

input {
  padding: 8px 12px;
  width: 90%;
  font-size: 14px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 8px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

p {
  margin: 0;
  font-size: 14px;
  color: #495057;
}
</style>
