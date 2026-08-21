import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', () => {
  // 1. State: 산단별 안전 특보 및 조치 가이드 데이터
  const alertGuidelines = ref([
    {
      id: 'city_03',
      name: '군산 국가산단',
      temp: 32,
      humidity: 75,
      expansionRate: 14.8,
      level: 'danger',
      badge: '🚨 열변형 경보',
      badgeClass: 'badge-danger',
      action: '정밀 프레스 공정 냉각수 순환량 20% 증설 및 치수 오차 재측정 실시',
    },
    {
      id: 'city_02',
      name: '울산 석유화학단지',
      temp: 24,
      humidity: 85,
      expansionRate: 4.5,
      level: 'warning',
      badge: '⚠️ 습도 주의보',
      badgeClass: 'badge-warning',
      action: '원유 저장 탱크 수분 유입 방지 밸브 점검 및 외부 배관 부식 방지 조치',
    },
    {
      id: 'city_01',
      name: '창원 국가산단',
      temp: 29,
      humidity: 45,
      expansionRate: 11.2,
      level: 'warning',
      badge: 'ℹ️ 온도 주의',
      badgeClass: 'badge-info',
      action: '방위산업 가공라인 공조 시스템 정상 가동 확인 및 모니터링 유지',
    },
    {
      id: 'city_04',
      name: '광주 첨단산단',
      temp: 22,
      humidity: 55,
      expansionRate: 3.0,
      level: 'good',
      badge: '✅ 정상 상태',
      badgeClass: 'badge-success',
      action: '클린룸 항온·항습 표준 스펙 충족, 일반 공정 가동 지속',
    },
  ])

  // 2. Getters: 긴급/주의 상태 산단 목록
  const dangerList = computed(() => {
    return alertGuidelines.value.filter(
      (item) => item.level === 'danger' || item.level === 'warning',
    )
  })

  // 3. Getters: 긴급/주의 산단 개수 (네비게이션 뱃지 연동용)
  const dangerCount = computed(() => {
    return dangerList.value.length
  })

  // 4. Getters: 특정 산단 ID의 경보 데이터 조회
  const getAlertByCityId = computed(() => {
    return (cityId) => alertGuidelines.value.find((item) => item.id === cityId)
  })

  return {
    alertGuidelines,
    dangerList,
    dangerCount,
    getAlertByCityId,
  }
})
