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
  <div class="cal-search-box">
    <input
      type="text"
      :value="query"
      @input="$emit('update-query', $event.target.value)"
      placeholder="🔍 산단명 또는 대표 공정 검색 (예: 창원, 기계, 배터리)"
      class="cal-search-input"
    />
  </div>
</template>

<style scoped>
.cal-search-box {
  width: 100%;
}

.cal-search-input {
  width: 100%;
  padding: 9px 14px;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #111111;
  box-sizing: border-box;
  outline: none;
  transition: all 0.15s ease;
}

.cal-search-input:focus {
  border-color: #111111;
  box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.05);
}
</style>
