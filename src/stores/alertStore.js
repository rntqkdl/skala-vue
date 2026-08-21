import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useWeatherStore } from './weatherStore'

export const useAlertStore = defineStore('alert', () => {
  const weatherStore = useWeatherStore()

  // 1. State: 각 산단별 현장 SOP 체크리스트 진행 상태 (영속/반응형 관리)
  const checklistState = ref({})

  // 2. Action: 체크리스트 토글
  function toggleChecklist(cityId, checkId) {
    if (!checklistState.value[cityId]) {
      checklistState.value[cityId] = {}
    }
    checklistState.value[cityId][checkId] = !checklistState.value[cityId][checkId]
  }

  // 3. Getter: 특정 산단의 체크리스트 진행률 (완료 개수 / 전체 개수)
  const getChecklistProgress = computed(() => {
    return (complex) => {
      if (!complex || !complex.sopChecklist) return { completed: 0, total: 0, percent: 0 }
      const total = complex.sopChecklist.length
      const cityChecks = checklistState.value[complex.id] || {}
      const completed = complex.sopChecklist.filter((item) => cityChecks[item.id]).length
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0
      return { completed, total, percent }
    }
  })

  // 4. Getter: 실시간 기상 vs 과거 재해 임계치 비교를 통한 산단별 위험도 분석
  const evaluatedAlerts = computed(() => {
    return weatherStore.complexes.map((complex) => {
      let level = 'good'
      let badge = '✅ 정상 관제'
      let badgeClass = 'badge-success'
      let warningReason = '기상 지표가 안전 기준치 이내를 유지하고 있습니다.'

      // 조건 1: 고온 폭염 & 열변형 위험
      if (
        complex.temp >= (complex.threshold.temp || 30) ||
        complex.expansionRate >= (complex.threshold.expansionRate || 15)
      ) {
        level = 'danger'
        badge = '🚨 열변형/폭염 경보'
        badgeClass = 'badge-danger'
        warningReason = `현재 기온 ${complex.temp}℃ / 열변형 +${complex.expansionRate}μm (과거 ${complex.incident.year} 피해 조건 초과)`
      }
      // 조건 2: 고습/집중호우 부식 위험
      else if (
        complex.humidity >= (complex.threshold.humidity || 80) &&
        (complex.status.includes('비') || complex.status.includes('호우') || complex.humidity >= 90)
      ) {
        level = 'danger'
        badge = '🚨 고습/부식 비상 경보'
        badgeClass = 'badge-danger'
        warningReason = `현재 습도 ${complex.humidity}% / 강우 상태 (과거 ${complex.incident.year} 셧다운 조건 초과)`
      }
      // 조건 3: 초미세먼지 대기오염 위험
      else if (complex.pm25 >= (complex.threshold.pm25 || 35) || complex.aqi >= 4) {
        level = 'warning'
        badge = '⚠️ 대기오염 주의보'
        badgeClass = 'badge-warning'
        warningReason = `초미세먼지 PM2.5 ${complex.pm25}μg/㎥ (클린룸 필터 파티클 오염 주의)`
      }
      // 조건 4: 경미한 온도/습도 주의
      else if (complex.temp >= 28 || complex.humidity >= 70) {
        level = 'warning'
        badge = 'ℹ️ 기상 주의'
        badgeClass = 'badge-info'
        warningReason = `기온 또는 습도가 공정 안정 한계선에 근접 중입니다.`
      }

      return {
        ...complex,
        level,
        badge,
        badgeClass,
        warningReason,
      }
    })
  })

  // 5. Getters: 긴급/주의 산단 목록 및 개수 (네비게이션 뱃지 연동)
  const dangerList = computed(() => {
    return evaluatedAlerts.value.filter(
      (item) => item.level === 'danger' || item.level === 'warning',
    )
  })

  const dangerCount = computed(() => {
    return dangerList.value.length
  })

  return {
    checklistState,
    toggleChecklist,
    getChecklistProgress,
    evaluatedAlerts,
    dangerList,
    dangerCount,
  }
})
