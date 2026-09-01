import axios from 'axios'

// 1. URL 형식(http:// 또는 https://) 검증 및 안전한 Fallback 매핑
function resolveValidUrl(envValue, fallbackUrl) {
  if (typeof envValue === 'string' && /^https?:\/\//i.test(envValue.trim())) {
    return envValue.trim().replace(/\/+$/, '')
  }
  return fallbackUrl
}

// 2. OpenWeatherMap API 환경변수 설정 (Vite .env 바인딩 + Fallback 안전 장치)
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'd2b5a5dafabfd6672625a209f2f74423'
const BASE_URL = resolveValidUrl(
  import.meta.env.VITE_OPENWEATHER_BASE_URL,
  'https://api.openweathermap.org/data/2.5',
)
const GEO_URL = resolveValidUrl(
  import.meta.env.VITE_OPENWEATHER_GEO_URL,
  'https://api.openweathermap.org/geo/1.0',
)

const weatherClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
})

// 2. 실시간 현재 날씨 호출 (기온, 습도, 기압, 풍속 등)
export async function fetchCurrentWeather(lat, lon) {
  const response = await weatherClient.get('/weather', {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return response.data
}

// 3. 5일 / 3시간 단위 예보 호출 (24시간 시간대별 예측)
export async function fetchForecast(lat, lon) {
  const response = await weatherClient.get('/forecast', {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return response.data
}

// 4. 실시간 대기오염 및 미세먼지(AQI) 지수 호출
export async function fetchAirPollution(lat, lon) {
  const response = await weatherClient.get('/air_pollution', {
    params: {
      lat,
      lon,
      appid: API_KEY,
    },
  })
  return response.data
}

// 5. 지오코딩(Geocoding): 도시명으로 위경도 좌표 검색
export async function fetchGeocoding(cityName) {
  const response = await axios.get(`${GEO_URL}/direct`, {
    params: {
      q: `${cityName},KR`,
      limit: 1,
      appid: API_KEY,
    },
    timeout: 5000,
  })
  return response.data
}
