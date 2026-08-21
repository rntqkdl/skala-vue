import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '@/views/WeatherHomeView.vue'

// 라우트 경로 및 매핑 컴포넌트 정의
const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: WeatherHomeView,
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    // 지연 로딩: 해당 라우트 방문 시점에 청크 파일을 불러옵니다
    component: () => import('@/views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    // 동적 라우트 매칭 (:cityId)
    component: () => import('@/views/WeatherDetailView.vue'),
  },
  {
    path: '/alerts',
    name: 'WeatherAlert',
    // 추가 뷰: 산단 기상 특보 및 공정 안전 수칙
    component: () => import('@/views/WeatherAlertView.vue'),
  },
  {
    // Catch-all 라우트: 정의되지 않은 모든 비정상 경로를 404 뷰로 연결
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
