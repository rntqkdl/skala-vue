import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // 1. State: 단위 설정 (초기값은 localStorage 또는 'celsius')
  const unit = ref(localStorage.getItem('weatherUnit') || 'celsius')

  // 2. State 변경 시 localStorage 자동 동기화 (영속화)
  watch(unit, (newUnit) => {
    localStorage.setItem('weatherUnit', newUnit)
  })

  // 3. Getters: 현재 단위에 맞는 기호 (℃ / ℉)
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // 4. Actions: 단위 토글 ('celsius' <-> 'fahrenheit')
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 5. Actions / Helper: 섭씨 숫자 -> 현재 단위 숫자로 변환
  function convertTemp(celsius) {
    if (celsius === null || celsius === undefined) return 0
    if (unit.value === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32)
    }
    return celsius
  }

  // 6. Parameterized Getter: 섭씨 숫자를 받아 "변환 수치 + 기호" 문자열로 반환
  const formatTemp = computed(() => {
    return (celsius) => {
      if (celsius === null || celsius === undefined) return '-'
      const converted = convertTemp(celsius)
      return `${converted}${unitSymbol.value}`
    }
  })

  return {
    unit,
    unitSymbol,
    toggleUnit,
    convertTemp,
    formatTemp,
  }
})
