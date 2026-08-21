<script setup>
// 라우터 뷰와 내비게이션 바 링크를 통한 화면 전환
</script>

<template>
  <div class="app-container">
    <h1>⛅ 과제 4: 라우터적용</h1>
    <hr />

    <div class="dashboard-wrapper">
      <!-- 상단 내비게이션 바 -->
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">🌦️ 산단 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/alerts" class="nav-item">🚨 안전 수칙</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
      </nav>

      <!-- 라우트별 뷰 컴포넌트 렌더링 영역 -->
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
/* 실습 공통 스타일시트 로드 */
@import '@/assets/exercise.css';
</style>
