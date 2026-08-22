import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import WeatherHomeView from '@/views/WeatherHomeView.vue'

// 라우트 경로 및 매핑 컴포넌트 정의
const routes = [
  {
    path: '/',
    name: 'Landing',
    // 메인 서비스 소개 및 대시보드 진입 랜딩 뷰
    component: LandingView,
  },
  {
    path: '/dashboard',
    name: 'WeatherHome',
    // 스마트 산업단지 기상 관제 종합 대시보드
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
    path: '/archive',
    name: 'TechArchive',
    // 지연 로딩: 기술 아카이브 및 트러블슈팅 전수 기록 뷰
    component: () => import('@/views/TechArchiveView.vue'),
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
    // 동적 라우트 매칭 (:cityId) - 정밀 상세 관제 화면
    component: () => import('@/views/WeatherDetailView.vue'),
  },
  {
    path: '/practices',
    name: 'Practices',
    // 지연 로딩: 교재 1~15단원 전체 실습장 뷰
    component: () => import('@/views/PracticeView.vue'),
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
  // 🚀 화면 전환 시 항상 최상단(Y=0)으로 자동 스크롤하여 빈 화면 착시 방지
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0 }
  },
})

export default router
