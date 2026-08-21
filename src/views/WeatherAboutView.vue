<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 대시보드 홈 화면으로 이동
const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="about-container">
    <div class="header-section">
      <h3>📖 스마트 팩토리 기상 리스크 관제 시스템 소개</h3>
      <span class="sub-header-text">기계, 제조, 플랜트 공정 설비의 기상 재해 선제 예방 플랫폼</span>
    </div>
    <hr />

    <!-- 1. 시스템 개요 -->
    <div class="info-section">
      <h4>1. 시스템 개요 및 구축 목적</h4>
      <p class="section-desc">
        본 시스템은 폭염, 집중호우, 낙뢰, 혹한 등 급격한 기상 이변이 산업 현장의 공작기계, 유압
        설비, 연속 공정 플랜트에 미치는 물리적 손실을 사전에 감지하고 방어하기 위해 구축되었습니다.
        실시간 OpenWeather 오픈 API와 과거 실제 산업단지 재해 사례 데이터베이스를 실시간으로
        결합하여, 단순 날씨 확인을 넘어선 선제적 공정 제어 및 현장 대응(SOP) 가이드를 제공합니다.
      </p>
    </div>

    <!-- 2. 기상 요인별 실제 재해 이력 및 설비 파손 메커니즘 -->
    <div class="info-section">
      <h4>2. 기상 요인별 실제 산업 재해 및 설비 파손 메커니즘</h4>
      <div class="case-grid">
        <!-- 사례 1: 태풍/침수 -->
        <div class="case-card">
          <div class="case-badge-row">
            <span class="badge badge-danger">태풍 / 침수</span>
            <span class="case-year">2022년 9월</span>
          </div>
          <h5 class="case-title">포항 철강공단 포스코 침수 및 고로 휴풍</h5>
          <p class="case-text">
            <strong>사고 현황:</strong> 태풍 힌남노로 인한 인근 하천 범람으로 여의도 면적 부지와
            압연 공장 18개소가 전면 침수되었습니다.
          </p>
          <p class="case-text">
            <strong>설비 피해:</strong> 170톤급 압연 메인 모터와 지하 전력망 침수로 창사 49년 만에
            고로 3기가 동시 가동 중단(휴풍)되었으며, 완전 정상화까지 135일이 소요되어 1조 원 이상의
            경제적 손실이 발생했습니다.
          </p>
        </div>

        <!-- 사례 2: 혹한/정전 -->
        <div class="case-card">
          <div class="case-badge-row">
            <span class="badge badge-info">혹한 / 정전</span>
            <span class="case-year">2021년 2월</span>
          </div>
          <h5 class="case-title">미국 텍사스 한파 삼성전자 오스틴 반도체 공장 셧다운</h5>
          <p class="case-text">
            <strong>사고 현황:</strong> 기록적인 북극 한파로 텍사스 전력망이 붕괴하며 반도체 공장의
            전력과 용수 공급이 전면 중단되었습니다.
          </p>
          <p class="case-text">
            <strong>설비 피해:</strong> 24시간 가동되어야 하는 반도체 라인이 멈추며 가공 중이던
            웨이퍼 약 7만 1,000장이 전량 폐기되었고, 정상 수율 복구까지 1개월 이상 소요되어 약
            4,000억 원의 손실이 발생했습니다.
          </p>
        </div>

        <!-- 사례 3: 폭염/열변형 -->
        <div class="case-card">
          <div class="case-badge-row">
            <span class="badge badge-warning">폭염 / 열변형</span>
            <span class="case-year">2018년 / 2024년</span>
          </div>
          <h5 class="case-title">창원/울산 정밀 가공라인 CNC 열팽창 및 유압 프레스 열화</h5>
          <p class="case-text">
            <strong>사고 현황:</strong> 35℃ 이상의 극심한 폭염으로 공장 실내온도가 40℃에 육박하며
            정밀 가공 오차가 급증했습니다.
          </p>
          <p class="case-text">
            <strong>설비 피해:</strong> CNC 공작기계 베드 및 스핀들 열팽창으로 가공 불량이 40~70%
            급증하였으며, 대형 프레스는 작동유 온도 60℃ 초과로 고무 씰(Seal) 경화 파손 및 유압 라인
            누유 사고가 발생했습니다.
          </p>
        </div>

        <!-- 사례 4: 낙뢰/전압강하 -->
        <div class="case-card">
          <div class="case-badge-row">
            <span class="badge badge-purple">낙뢰 / 전압강하</span>
            <span class="case-year">2008년 / 2011년</span>
          </div>
          <h5 class="case-title">여수/울산 석유화학단지 순간전압강하 및 플레어스택 방출</h5>
          <p class="case-text">
            <strong>사고 현황:</strong> 여름철 뇌우 낙뢰로 송전선로에 수 초 이하의
            순간전압강하(Voltage Sag)가 발생했습니다.
          </p>
          <p class="case-text">
            <strong>설비 피해:</strong> 고온, 고압 연속 공정의 모터 펌프가 일제히 트립(정지)되며
            파이프라인 내 원료 고착화를 막기 위해 긴급 플레어스택으로 가스를 전량 연소 방출하며
            700억~1,000억 원대의 손실이 발생했습니다.
          </p>
        </div>
      </div>
    </div>

    <!-- 3. 기계 공학적 리스크 연산 모델 -->
    <div class="info-section">
      <h4>3. 기계 공학적 리스크 연산 모델</h4>
      <div class="formula-box">
        <p class="formula-title">📌 CNC 공작기계 열변형 오차 추정 공식</p>
        <p class="formula-code">열변형 오차(μm) = max(0, 현재기온 - 20℃) × 1.5 + 3.0</p>
        <p class="formula-desc">
          탄소강/구조용 강재의 열팽창계수(약 11.7 × 10⁻⁶ / ℃)를 기반으로 공장 실내 기준온도(20℃)
          대비 기온 상승에 따른 가공 공차 변화량을 실시간 추정합니다.
        </p>
      </div>

      <div class="formula-box">
        <p class="formula-title">📌 유압 설비 및 화학 공정 안전 임계치</p>
        <ul class="spec-list">
          <li>
            <strong>유압 프레스 작동유:</strong> 외기온 32℃ 이상 시 유온 60℃ 초과 위험 (오일 칠러
            냉각수 순환량 25% 증설 필요)
          </li>
          <li>
            <strong>석유화학 옥외 배관:</strong> 대기 습도 80% 이상 강우 시 해무 접촉으로 염해 부식
            가속 (배관 밸브 락 점검 필요)
          </li>
          <li>
            <strong>반도체 클린룸:</strong> 초미세먼지(PM2.5) 35μg/㎥ 초과 시 외기 흡입 차압 밸브
            가동 (HEPA 필터 보호)
          </li>
        </ul>
      </div>
    </div>

    <!-- 4. 프론트엔드 시스템 아키텍처 -->
    <div class="info-section">
      <h4>4. 프론트엔드 시스템 아키텍처</h4>
      <div class="architecture-grid">
        <div class="arch-card">
          <div class="arch-title">Vue 3 Composition API</div>
          <div class="arch-body">
            <code>&lt;script setup&gt;</code> 기반 반응형 상태 관리, <code>ref</code>,
            <code>computed</code>, <code>watch</code> 센서 및 슬롯 기반 공통 카드(BaseDashboardCard)
            모듈화
          </div>
        </div>

        <div class="arch-card">
          <div class="arch-title">Vue Router 4</div>
          <div class="arch-body">
            SPA 무중단 클라이언트 라우팅, <code>:cityId</code> 동적 파라미터 수신, 쿼리스트링 실시간
            동기화 및 <code>/:pathMatch(.*)*</code> 404 예외 처리
          </div>
        </div>

        <div class="arch-card">
          <div class="arch-title">Pinia 전역 스토어 체계</div>
          <div class="arch-body">
            - <code>configStore</code>: 섭씨/화씨 단위 변환 및
            <code>localStorage</code> 영속화<br />
            - <code>weatherStore</code>: 실시간 오픈 API 병렬 수신 및 60초 캐싱<br />
            - <code>alertStore</code>: 실시간 기상 vs 과거 재해 임계치 대조 및 현장 SOP 체크리스트
          </div>
        </div>

        <div class="arch-card">
          <div class="arch-title">Axios 통신 계층</div>
          <div class="arch-body">
            공통 인스턴스(<code>axios.create</code>) 기반 <code>/weather</code>(실시간),
            <code>/forecast</code>(24시간 예보), <code>/air_pollution</code>(대기질) 3대 오픈
            엔드포인트 연동
          </div>
        </div>
      </div>
    </div>

    <!-- 5. 하단 액션 버튼 -->
    <button class="home-btn" @click="handleGoHome">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.about-container {
  width: 600px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  color: #2c3e50;
}

.header-section {
  margin-bottom: 12px;
}

h3 {
  margin: 0 0 6px 0;
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 700;
}

.sub-header-text {
  font-size: 13px;
  color: #7f8c8d;
}

hr {
  border: none;
  border-top: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.info-section {
  margin-bottom: 24px;
}

h4 {
  margin: 0 0 10px 0;
  font-size: 1.05rem;
  color: #2c3e50;
  font-weight: 700;
  border-left: 4px solid #3498db;
  padding-left: 8px;
}

.section-desc {
  font-size: 13px;
  line-height: 1.65;
  color: #495057;
  margin: 0;
}

.case-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.case-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px 14px;
}

.case-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 4px;
  color: white;
  font-weight: 600;
}

.badge-danger {
  background-color: #ff7675;
}

.badge-warning {
  background-color: #f39c12;
}

.badge-info {
  background-color: #0984e3;
}

.badge-purple {
  background-color: #6c5ce7;
}

.case-year {
  font-size: 11px;
  color: #8395a7;
  font-weight: 600;
}

.case-title {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #2c3e50;
  font-weight: 700;
}

.case-text {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #495057;
  line-height: 1.5;
}

.formula-box {
  background: #fdfefe;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
}

.formula-title {
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: 700;
  color: #2c3e50;
}

.formula-code {
  background: #2c3e50;
  color: #54a0ff;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  margin: 6px 0;
}

.formula-desc {
  margin: 6px 0 0 0;
  font-size: 12px;
  color: #636e72;
  line-height: 1.5;
}

.spec-list {
  padding-left: 18px;
  margin: 0;
  font-size: 12px;
  color: #495057;
  line-height: 1.7;
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.arch-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
}

.arch-title {
  font-size: 13px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6px;
}

.arch-body {
  font-size: 12px;
  color: #576574;
  line-height: 1.5;
}

code {
  background-color: #eef2f7;
  padding: 2px 4px;
  border-radius: 3px;
  color: #e74c3c;
  font-size: 11px;
}

.home-btn {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.home-btn:hover {
  background-color: #1a252f;
}
</style>
