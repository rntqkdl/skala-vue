<script setup>
import { useCounterStore } from '@/stores/counter.js'
import { storeToRefs } from 'pinia'

// 1. 스토어 인스턴스 확보
const counterStore = useCounterStore()

// 2. 반응형 상태 및 연산 속성 구조분해
const { count, doubleCount } = storeToRefs(counterStore)

// 3. 클릭 핸들러
function handleClick() {
  counterStore.increment()
}
</script>

<template>
  <div
    class="practice-section"
    style="padding: 20px; border: 1px solid #ccc; border-radius: 8px; margin: 20px 0"
  >
    <h2>Counter Store 활용실습</h2>
    <p>
      원본 카운트 데이터(state): <strong>{{ count }}</strong>
    </p>
    <p>
      2배 연산 데이터(getters): <span>{{ doubleCount }}</span>
    </p>
    <button @click="handleClick" style="padding: 8px 16px; cursor: pointer">
      숫자 1 증가(actions)
    </button>
  </div>
</template>
