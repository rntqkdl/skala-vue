import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // 1. State: 단위 설정 ('celsius' | 'fahrenheit')
  const unit = ref(localStorage.getItem('weatherUnit') || 'celsius')

  watch(unit, (newUnit) => {
    localStorage.setItem('weatherUnit', newUnit)
  })

  // 2. State: 테마 모드 ('auto' | 'light' | 'dark')
  // 'auto': 평소에는 가독성 높은 라이트 모드 -> 폭염/위험특보 발령 시 긴급 다크모드로 자동 전환
  const themeMode = ref(localStorage.getItem('skala_theme_mode') || 'auto')

  watch(themeMode, (newMode) => {
    localStorage.setItem('skala_theme_mode', newMode)
  })

  // 3. Getters: 현재 단위 기호
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function convertTemp(celsius) {
    if (celsius === null || celsius === undefined) return 0
    if (unit.value === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32)
    }
    return celsius
  }

  const formatTemp = computed(() => {
    return (celsius) => {
      if (celsius === null || celsius === undefined) return '-'
      const converted = convertTemp(celsius)
      return `${converted}${unitSymbol.value}`
    }
  })

  function setThemeMode(mode) {
    themeMode.value = mode
  }

  return {
    unit,
    unitSymbol,
    themeMode,
    toggleUnit,
    convertTemp,
    formatTemp,
    setThemeMode,
  }
})
