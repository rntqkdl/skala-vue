<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 대시보드 홈(/)으로 이동
const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="about-container">
    <h3>ℹ️ 시스템 소개</h3>
    <hr />

    <div class="description-box">
      <p>
        본 시스템은 <strong>Vue 3</strong> 및 <strong>Vue Router</strong>를 바탕으로 제작된 산업단지 기상·공정 모니터링 대시보드입니다.
      </p>
      <ul>
        <li><code>components/handson/</code> 하위 모듈형 컴포넌트 연동</li>
        <li>클라이언트 사이드 라우팅(SPA)으로 새로고침 없는 화면 전환</li>
        <li>URL 쿼리스트링 동기화를 통한 실시간 검색 상태 유지</li>
        <li>동적 라우트 매칭(<code>/weather/:cityId</code>)을 활용한 산단별 상세 관측</li>
      </ul>
    </div>

    <button class="home-btn" @click="handleGoHome">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
.about-container {
  width: 600px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.15rem;
  color: #2c3e50;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin-bottom: 15px;
}

.description-box {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  line-height: 1.6;
  font-size: 14px;
}

ul {
  padding-left: 20px;
  margin: 10px 0 0 0;
}

li {
  margin-bottom: 6px;
  color: #555;
}

code {
  background-color: #ffeaa7;
  padding: 2px 5px;
  border-radius: 4px;
  color: #d63031;
  font-size: 13px;
}

.home-btn {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.home-btn:hover {
  background-color: #2980b9;
}
</style>
