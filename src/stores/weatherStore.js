import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { industrialComplexData } from '@/data/incidentHistory'
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchAirPollution,
  fetchGeocoding,
} from '@/api/weatherApi'

export const useWeatherStore = defineStore('weather', () => {
  // 1. State: 6대 산단 통합 데이터 (기본 메타데이터 + 실시간 API 데이터)
  const complexes = ref(
    industrialComplexData.map((item) => ({
      ...item,
      temp: 25,
      feels_like: 25,
      status: '데이터 대기 중',
      icon: '01d',
      humidity: 50,
      wind: 2.0,
      pressure: 1013,
      expansionRate: 7.5,
      aqi: 2,
      pm25: 15,
      pm10: 30,
      forecast: [],
      rawLoaded: false,
    })),
  )

  // 즐겨찾기 산단 ID 목록 (localStorage 영속화)
  const favorites = ref(
    JSON.parse(localStorage.getItem('skala_favorites') || '["city_01", "city_05"]'),
  )

  watch(
    favorites,
    (newVal) => {
      localStorage.setItem('skala_favorites', JSON.stringify(newVal))
    },
    { deep: true },
  )

  const isLoading = ref(false)
  const isError = ref(false)
  const errorMessage = ref('')
  const lastUpdated = ref('')
  const simulationMode = ref(null)

  // 2. Action: 전 산단 실시간 기상 및 대기질 일괄 병렬 호출 (Promise.all)
  async function fetchLiveWeatherData(force = false) {
    if (!force && lastUpdated.value && !simulationMode.value) {
      return
    }

    isLoading.value = true
    isError.value = false
    errorMessage.value = ''

    try {
      const results = await Promise.all(
        complexes.value.map(async (complex) => {
          try {
            const [weatherData, pollutionData] = await Promise.all([
              fetchCurrentWeather(complex.lat, complex.lon),
              fetchAirPollution(complex.lat, complex.lon).catch(() => null),
            ])

            const temp = Math.round(weatherData.main.temp)
            const feels_like = Math.round(weatherData.main.feels_like)
            const status = weatherData.weather[0]?.description || '맑음'
            const icon = weatherData.weather[0]?.icon || '01d'
            const humidity = weatherData.main.humidity
            const wind = Number(weatherData.wind?.speed || 2.0)
            const pressure = weatherData.main.pressure

            // 실시간 기온 기반 정밀 열변형 오차 계산 (20℃ 기준 1℃당 1.5μm 팽창)
            const expansionRate = Number((Math.max(0, temp - 20) * 1.5 + 3.0).toFixed(1))

            const aqi = pollutionData?.list[0]?.main?.aqi || 2
            const pm25 = Math.round(pollutionData?.list[0]?.components?.pm2_5 || 15)
            const pm10 = Math.round(pollutionData?.list[0]?.components?.pm10 || 30)

            return {
              ...complex,
              temp,
              feels_like,
              status,
              icon,
              humidity,
              wind,
              pressure,
              expansionRate,
              aqi,
              pm25,
              pm10,
              rawLoaded: true,
            }
          } catch (err) {
            console.error(`${complex.name} 날씨 조회 실패:`, err)
            return complex
          }
        }),
      )

      complexes.value = results
      lastUpdated.value = new Date().toLocaleTimeString('ko-KR')
      simulationMode.value = null
    } catch (err) {
      isError.value = true
      errorMessage.value = '실시간 기상 데이터를 불러오지 못했습니다.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  // 3. Action: 특정 산단의 3시간 단위 24시간 예보 상세 수신
  async function fetchComplexForecast(cityId) {
    const complex = complexes.value.find((c) => c.id === cityId)
    if (!complex) return

    try {
      const forecastData = await fetchForecast(complex.lat, complex.lon)
      const next24Hours = (forecastData.list || []).slice(0, 8).map((item) => ({
        time: item.dt_txt.substring(11, 16),
        temp: Math.round(item.main.temp),
        status: item.weather[0]?.description || '맑음',
        icon: item.weather[0]?.icon || '01d',
        humidity: item.main.humidity,
        pop: Math.round((item.pop || 0) * 100),
      }))

      complex.forecast = next24Hours
    } catch (err) {
      console.error(`${complex.name} 24시간 예보 수신 실패:`, err)
    }
  }

  // 4. Action: 6대 산단 전체 24시간 예보 일괄 호출
  async function fetchAllForecasts() {
    await Promise.all(complexes.value.map((c) => fetchComplexForecast(c.id)))
  }

  // 5. Action: Geocoding API를 활용한 신규 전국 산단/도시 동적 등록
  async function searchAndAddComplex(query, customIndustry = '스마트 제조 및 정밀 부품 라인') {
    if (!query || !query.trim()) {
      return { success: false, message: '검색할 지역명을 입력해 주세요.' }
    }

    const trimmed = query.trim()
    try {
      isLoading.value = true
      const geoResults = await fetchGeocoding(trimmed)

      if (!geoResults || geoResults.length === 0) {
        return { success: false, message: `'${trimmed}' 지역의 좌표를 찾을 수 없습니다.` }
      }

      const targetGeo = geoResults[0]
      const koreanName = targetGeo.local_names?.ko || targetGeo.name
      const newId = `city_${Date.now().toString().slice(-4)}`

      // 중복 등록 여부 검증
      const existing = complexes.value.find((c) => c.name.includes(koreanName))
      if (existing) {
        return { success: false, message: `이미 관제 목록에 등록된 산단입니다: ${existing.name}` }
      }

      // 실시간 날씨 및 대기질 동시 수신
      const [weatherData, pollutionData] = await Promise.all([
        fetchCurrentWeather(targetGeo.lat, targetGeo.lon),
        fetchAirPollution(targetGeo.lat, targetGeo.lon).catch(() => null),
      ])

      const temp = Math.round(weatherData.main.temp)
      const feels_like = Math.round(weatherData.main.feels_like)
      const status = weatherData.weather[0]?.description || '맑음'
      const icon = weatherData.weather[0]?.icon || '01d'
      const humidity = weatherData.main.humidity
      const wind = Number(weatherData.wind?.speed || 2.0)
      const pressure = weatherData.main.pressure
      const expansionRate = Number((Math.max(0, temp - 20) * 1.5 + 3.0).toFixed(1))

      const aqi = pollutionData?.list[0]?.main?.aqi || 2
      const pm25 = Math.round(pollutionData?.list[0]?.components?.pm2_5 || 15)
      const pm10 = Math.round(pollutionData?.list[0]?.components?.pm10 || 30)

      const newComplex = {
        id: newId,
        name: `${koreanName} 산단`,
        fullName: `${koreanName} 일반/국가산업단지`,
        lat: targetGeo.lat,
        lon: targetGeo.lon,
        industry: customIndustry,
        threshold: {
          temp: 30,
          humidity: 80,
          expansionRate: 12.0,
        },
        incident: {
          year: '2023년 현장 점검',
          title: '외기 급변에 따른 정밀 가공 및 공조 부하 리스크',
          loss: '상시 관제 대상 (예방 정비 체계 가동)',
          cause: '외기온 급상승 시 공장 내부 칠러 부하 및 열팽창 공차 발생',
          preventAction: '실시간 기상 연동 공조 자동 제어 및 치수 보정 계수 적용',
        },
        sopChecklist: [
          { id: `${newId}_1`, text: '공장 외기 흡입 댐퍼 및 칠러 냉각수 온도 점검', done: false },
          { id: `${newId}_2`, text: '가공 라인 치수 센서 영점 및 공차 보정 확인', done: false },
        ],
        temp,
        feels_like,
        status,
        icon,
        humidity,
        wind,
        pressure,
        expansionRate,
        aqi,
        pm25,
        pm10,
        forecast: [],
        rawLoaded: true,
      }

      complexes.value.unshift(newComplex)
      return {
        success: true,
        message: `새로운 관제 산단이 성공적으로 등록되었습니다: ${koreanName}`,
      }
    } catch (err) {
      console.error('Geocoding 산단 추가 에러:', err)
      return { success: false, message: '지역 정보를 불러오는 도중 통신 에러가 발생했습니다.' }
    } finally {
      isLoading.value = false
    }
  }

  // 6. Action: 산단 즐겨찾기 토글
  function toggleFavorite(complexId) {
    const idx = favorites.value.indexOf(complexId)
    if (idx === -1) {
      favorites.value.push(complexId)
    } else {
      favorites.value.splice(idx, 1)
    }
  }

  // 7. Action: 산단 삭제
  function deleteComplex(complexId) {
    complexes.value = complexes.value.filter((c) => c.id !== complexId)
    const favIdx = favorites.value.indexOf(complexId)
    if (favIdx !== -1) {
      favorites.value.splice(favIdx, 1)
    }
  }

  // 8. Action: 가상 기상 스트레스 테스트 (시뮬레이션 모드)
  function applySimulation(mode) {
    simulationMode.value = mode
    complexes.value = complexes.value.map((complex) => {
      if (mode === 'heatwave') {
        return {
          ...complex,
          temp: 35,
          status: '폭염 특보 (가상)',
          humidity: 45,
          expansionRate: 25.5,
        }
      } else if (mode === 'heavyrain') {
        return {
          ...complex,
          temp: 24,
          status: '집중호우/고습 (가상)',
          humidity: 95,
          expansionRate: 9.0,
        }
      } else if (mode === 'dust') {
        return {
          ...complex,
          status: '미세먼지 매우나쁨 (가상)',
          aqi: 5,
          pm25: 120,
          pm10: 210,
        }
      }
      return complex
    })
    lastUpdated.value = `${new Date().toLocaleTimeString('ko-KR')} (시뮬레이션)`
  }

  // 9. Getters
  const getComplexById = computed(() => {
    return (id) => complexes.value.find((c) => c.id === id) || complexes.value[0]
  })

  const averageTemp = computed(() => {
    if (complexes.value.length === 0) return 0
    const sum = complexes.value.reduce((acc, curr) => acc + curr.temp, 0)
    return Math.round(sum / complexes.value.length)
  })

  const maxExpansionComplex = computed(() => {
    if (complexes.value.length === 0) return null
    return complexes.value.reduce((prev, curr) =>
      curr.expansionRate > prev.expansionRate ? curr : prev,
    )
  })

  // 향후 24시간 최고 기온 발생 피크 산단 및 사전 권고 조치 산출
  const peakWarning = computed(() => {
    let highestItem = null
    let targetComplex = null

    complexes.value.forEach((complex) => {
      ;(complex.forecast || []).forEach((fc) => {
        if (!highestItem || fc.temp > highestItem.temp) {
          highestItem = fc
          targetComplex = complex
        }
      })
    })

    if (!highestItem || !targetComplex) {
      const top = maxExpansionComplex.value
      return {
        complexName: top ? top.name : '창원 국가산단',
        time: '오늘 15:00',
        temp: top ? top.temp : 32,
        expansion: top ? top.expansionRate : 18.0,
        leadTime: '오후 13:30',
      }
    }

    const predictedExpansion = Number((Math.max(0, highestItem.temp - 20) * 1.5 + 3.0).toFixed(1))
    return {
      complexName: targetComplex.name,
      time: highestItem.time,
      temp: highestItem.temp,
      expansion: predictedExpansion,
      leadTime: '도달 1시간 30분 전',
    }
  })

  return {
    complexes,
    favorites,
    isLoading,
    isError,
    errorMessage,
    lastUpdated,
    simulationMode,
    fetchLiveWeatherData,
    fetchComplexForecast,
    fetchAllForecasts,
    searchAndAddComplex,
    toggleFavorite,
    deleteComplex,
    applySimulation,
    getComplexById,
    averageTemp,
    maxExpansionComplex,
    peakWarning,
  }
})
