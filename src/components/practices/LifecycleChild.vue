<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerId = null

// 1. 생성 (Creation)
console.log('1. [setup] 컴포넌트가 메모리에 생성되었습니다. (DOM 접근 불가)')

// 2. 부착 (Mounting)
onMounted(() => {
  console.log('2. [onMounted] 화면에 부착되었습니다. (API 호출 및 DOM 조작 작성)')
  // 3초마다 숫자가 자동으로 올라가는 타이머 가동
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

// 3. 갱신 (Updating)
onUpdated(() => {
  console.log(
    `3. [onUpdated] 데이터가 변경되어 화면을 새로 그렸습니다. (현재 count: ${count.value})`,
  )
})

// 4. 소멸 (Unmounting)
onUnmounted(() => {
  clearInterval(timerId) // 타이머 정리 (메모리 누수 방지)
  console.log('4. [onUnmounted] 컴포넌트 소멸 및 타이머 정리 완료.')
})
</script>

<template>
  <div class="child-container">
    <h3>⏱️ 라이프사이클 훅 흐름 탐색기</h3>
    <div class="counter-display">
      <p>실시간 타이머 카운트: {{ count }}</p>
      <button class="count-btn" @click="count++">수동으로 숫자 올리기</button>
    </div>
  </div>
</template>

<style scoped>
.child-container {
  margin-top: 10px;
}

.child-container h3 {
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.counter-display {
  background-color: #e3fafc;
  border: 1px solid #99e9f2;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.counter-display p {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  color: #2b8a3e;
  font-weight: 500;
}

.count-btn {
  padding: 6px 14px;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.count-btn:hover {
  background-color: #f1f3f5;
}
</style>
