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
    path: '/radar',
    name: 'WeatherRadar',
    // 지연 로딩: 전국 기상 레이더 및 24시간 예측 관제 뷰
    component: () => import('@/views/WeatherRadarView.vue'),
  },
  {
    path: '/alerts',
    name: 'WeatherAlert',
    // 지연 로딩: 산단 기상 특보 및 공정 안전 수칙
    component: () => import('@/views/WeatherAlertView.vue'),
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    // 지연 로딩: 시스템 아키텍처 및 재해 메커니즘 소개
    component: () => import('@/views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    // 동적 라우트 매칭 (:cityId)
    component: () => import('@/views/WeatherDetailView.vue'),
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
