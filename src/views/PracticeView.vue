<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. 기본 컴포넌트 구조
import SampleOne from '@/components/practices/SampleOne.vue'
import SampleTwo from '@/components/practices/SampleTwo.vue'

// 2. 텍스트 렌더링 및 보안
import SampleVtext from '@/components/practices/SampleVtext.vue'
import SampleVhtml from '@/components/practices/SampleVhtml.vue'
import SampleXss from '@/components/practices/SampleXss.vue'

// 3. 속성 바인딩
import SampleVbind from '@/components/practices/SampleVbind.vue'
import SampleVbindhigh from '@/components/practices/SampleVbindhigh.vue'
import SampleVbindhigh2 from '@/components/practices/SampleVbindhigh2.vue'

// 4. 조건부 및 리스트 렌더링
import SampleVif from '@/components/practices/SampleVif.vue'
import SampleVshow from '@/components/practices/SampleVshow.vue'
import SampleVfor from '@/components/practices/SampleVfor.vue'

// 5. 렌더링 제어 및 최적화 디렉티브
import SampleVpre from '@/components/practices/SampleVpre.vue'
import SampleVonce from '@/components/practices/SampleVonce.vue'
import SampleVmemo from '@/components/practices/SampleVmemo.vue'
import SampleVcloak from '@/components/practices/SampleVcloak.vue'

// 6. 이벤트 핸들링 및 폼 처리
import VueonEventHandler from '@/components/practices/VueonEventHandler.vue'
import VueEventObject from '@/components/practices/VueEventObject.vue'
import VueEventModifier from '@/components/practices/VueEventModifier.vue'
import VueForm from '@/components/practices/VueForm.vue'
import VuevModel from '@/components/practices/VuevModel.vue'
import VueFormDataBinding from '@/components/practices/VueFormDataBinding.vue'

// 7. 스타일링
import VueStyle from '@/components/practices/VueStyle.vue'

// 8. Composition API: 반응형 상태 (Reactivity)
import VueRef from '@/components/practices/VueRef.vue'
import VueReactive from '@/components/practices/VueReactive.vue'

// 9. Composition API: Computed & Watchers
import VueComputed from '@/components/practices/VueComputed.vue'
import VueWatch from '@/components/practices/VueWatch.vue'
import VueMultiWatch from '@/components/practices/VueMultiWatch.vue'
import DeepWatch from '@/components/practices/DeepWatch.vue'
import WatchEffect from '@/components/practices/WatchEffect.vue'

// 10. Hands-on 2 실습
import WeatherComposition from '@/components/handson/WeatherComposition.vue'

// 11. Component Lifecycle
import VueLifecycle from '@/components/practices/VueLifecycle.vue'

// 12. Props & Emits 실습
import PropsEmitsParent from '@/components/practices/PropsEmitsParent.vue'

// 13. Slot 실습
import SlotDefaultParent from '@/components/practices/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/SlotScopedParent.vue'

// 14. Hands-on Weather Component 분리 완성본
import WeatherParent from '@/components/handson/WeatherParent.vue'

// 15. Pinia Store 실습
import StoreCounter from '@/components/practices/library/StoreCounter.vue'

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="practice-lab-view">
    <!-- 상단 헤더 배너 -->
    <section class="resend-hero-band">
      <div class="hero-editorial-eyebrow">
        <span class="status-dot-live"></span>
        <span>Vue.js 1~15단원 기초 실습 아카이브</span>
      </div>
      <h1 class="hero-editorial-headline">기초 실습 코드 아카이브</h1>
      <p class="hero-editorial-desc">
        Vue.js 1단원부터 15단원까지 단계별로 구현된 실습 컴포넌트들을 실행하고 동작을 검증할 수 있는 통합 실습장입니다.
      </p>
    </section>

    <!-- 1~15단원 퀵 점프 앵커 바 -->
    <div class="quick-anchor-nav-card">
      <div class="anchor-title-row">
        <span class="anchor-title">📌 단원별 실습 컴포넌트 바로가기</span>
        <button class="btn-secondary btn-sm" @click="router.push('/archive')">
          📖 비전공자 이론 가이드로 이동 →
        </button>
      </div>
      <div class="anchor-btn-rail">
        <button class="anchor-chip" @click="scrollToSection('ch01')">1. 기본구조</button>
        <button class="anchor-chip" @click="scrollToSection('ch02')">2. 텍스트/XSS</button>
        <button class="anchor-chip" @click="scrollToSection('ch03')">3. 속성 바인딩</button>
        <button class="anchor-chip" @click="scrollToSection('ch04')">4. 조건/리스트</button>
        <button class="anchor-chip" @click="scrollToSection('ch05')">5. 렌더링 최적화</button>
        <button class="anchor-chip" @click="scrollToSection('ch06')">6. 이벤트/폼</button>
        <button class="anchor-chip" @click="scrollToSection('ch07')">7. 스타일링</button>
        <button class="anchor-chip" @click="scrollToSection('ch08')">8. 반응형 ref/reactive</button>
        <button class="anchor-chip" @click="scrollToSection('ch09')">9. Computed/Watch</button>
        <button class="anchor-chip" @click="scrollToSection('ch10')">10. 날씨 실습 1</button>
        <button class="anchor-chip" @click="scrollToSection('ch11')">11. 생명주기</button>
        <button class="anchor-chip" @click="scrollToSection('ch12')">12. Props/Emits</button>
        <button class="anchor-chip" @click="scrollToSection('ch13')">13. Slot</button>
        <button class="anchor-chip" @click="scrollToSection('ch14')">14. 컴포넌트 분리</button>
        <button class="anchor-chip" @click="scrollToSection('ch15')">15. Pinia 스토어</button>
      </div>
    </div>

    <!-- 실습 컴포넌트 렌더링 영역 -->
    <div class="practice-sections-list">
      <!-- 1. 기본 컴포넌트 -->
      <section id="ch01" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">1단원: 기본 컴포넌트 구조</h3>
          <span class="chap-badge">SampleOne, SampleTwo</span>
        </div>
        <div class="practice-body-box">
          <SampleOne />
          <SampleTwo />
        </div>
      </section>

      <!-- 2. 텍스트 렌더링 및 보안 -->
      <section id="ch02" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">2단원: 텍스트 렌더링 및 XSS 보안</h3>
          <span class="chap-badge">v-text, v-html, XSS 방어</span>
        </div>
        <div class="practice-body-box">
          <SampleVtext />
          <SampleVhtml />
          <SampleXss />
        </div>
      </section>

      <!-- 3. 속성 바인딩 -->
      <section id="ch03" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">3단원: 속성 바인딩 (v-bind)</h3>
          <span class="chap-badge">v-bind, 다중 바인딩</span>
        </div>
        <div class="practice-body-box">
          <SampleVbind />
          <SampleVbindhigh />
          <SampleVbindhigh2 />
        </div>
      </section>

      <!-- 4. 조건부 및 리스트 렌더링 -->
      <section id="ch04" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">4단원: 조건부 렌더링 및 리스트 순회</h3>
          <span class="chap-badge">v-if, v-show, v-for</span>
        </div>
        <div class="practice-body-box">
          <SampleVif />
          <SampleVshow />
          <SampleVfor />
        </div>
      </section>

      <!-- 5. 렌더링 최적화 디렉티브 -->
      <section id="ch05" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">5단원: 렌더링 제어 및 최적화 디렉티브</h3>
          <span class="chap-badge">v-pre, v-once, v-memo, v-cloak</span>
        </div>
        <div class="practice-body-box">
          <SampleVpre />
          <SampleVonce />
          <SampleVmemo />
          <SampleVcloak />
        </div>
      </section>

      <!-- 6. 이벤트 핸들링 및 폼 처리 -->
      <section id="ch06" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">6단원: 이벤트 핸들링 및 폼 양방향 바인딩</h3>
          <span class="chap-badge">v-on, v-model, 수식어</span>
        </div>
        <div class="practice-body-box">
          <VueonEventHandler />
          <VueEventObject />
          <VueEventModifier />
          <VueForm />
          <VuevModel />
          <VueFormDataBinding />
        </div>
      </section>

      <!-- 7. 스타일링 -->
      <section id="ch07" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">7단원: 클래스 및 인라인 스타일 동적 바인딩</h3>
          <span class="chap-badge">VueStyle</span>
        </div>
        <div class="practice-body-box">
          <VueStyle />
        </div>
      </section>

      <!-- 8. 반응형 상태 -->
      <section id="ch08" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">8단원: Composition API 반응형 상태</h3>
          <span class="chap-badge">ref vs reactive</span>
        </div>
        <div class="practice-body-box">
          <VueRef />
          <VueReactive />
        </div>
      </section>

      <!-- 9. Computed & Watchers -->
      <section id="ch09" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">9단원: Computed 및 Watchers 반응형 감시</h3>
          <span class="chap-badge">computed, watch, watchEffect</span>
        </div>
        <div class="practice-body-box">
          <VueComputed />
          <VueWatch />
          <VueMultiWatch />
          <DeepWatch />
          <WatchEffect />
        </div>
      </section>

      <!-- 10. Hands-on 2 실습 -->
      <section id="ch10" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">10단원: Hands-on 날씨 기초 실습</h3>
          <span class="chap-badge">WeatherComposition</span>
        </div>
        <div class="practice-body-box">
          <WeatherComposition />
        </div>
      </section>

      <!-- 11. Component Lifecycle -->
      <section id="ch11" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">11단원: 컴포넌트 생명주기 (Lifecycle Hooks)</h3>
          <span class="chap-badge">onMounted, onUnmounted</span>
        </div>
        <div class="practice-body-box">
          <VueLifecycle />
        </div>
      </section>

      <!-- 12. Props & Emits -->
      <section id="ch12" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">12단원: 부모-자식 컴포넌트 통신 (Props & Emits)</h3>
          <span class="chap-badge">defineProps, defineEmits</span>
        </div>
        <div class="practice-body-box">
          <PropsEmitsParent />
        </div>
      </section>

      <!-- 13. Slot -->
      <section id="ch13" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">13단원: 슬롯(Slot) 레이아웃 컴포넌트</h3>
          <span class="chap-badge">기본 슬롯, 이름 슬롯, 범위 슬롯</span>
        </div>
        <div class="practice-body-box">
          <SlotDefaultParent />
          <SlotNamedParent />
          <SlotScopedParent />
        </div>
      </section>

      <!-- 14. 컴포넌트 분리 실습 -->
      <section id="ch14" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">14단원: 날씨 컴포넌트 모듈화 분리 실습</h3>
          <span class="chap-badge">WeatherParent & 자식 분리</span>
        </div>
        <div class="practice-body-box">
          <WeatherParent />
        </div>
      </section>

      <!-- 15. Pinia Store 실습 -->
      <section id="ch15" class="practice-section-card">
        <div class="section-card-header">
          <h3 class="section-card-title">15단원: Pinia 전역 상태 관리소 (Store)</h3>
          <span class="chap-badge">StoreCounter</span>
        </div>
        <div class="practice-body-box">
          <StoreCounter />
        </div>
      </section>
    </div>

    <div class="bottom-action-row">
      <button class="btn-primary" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
      <button class="btn-secondary" @click="router.push('/archive')">📖 비전공자 가이드 열람</button>
    </div>
  </div>
</template>

<style scoped>
.practice-lab-view {
  width: 100%;
}

.quick-anchor-nav-card {
  background: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  padding: 18px 22px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-apple-card);
}

[data-theme="dark"] .quick-anchor-nav-card {
  background: #1d1d1f;
  border-color: #333336;
}

.anchor-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.anchor-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .anchor-title {
  color: #f5f5f7 !important;
}

.anchor-btn-rail {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.anchor-chip {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  color: var(--colors-charcoal, #515154);
  padding: 6px 12px;
  border-radius: var(--rounded-pill, 9999px);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.anchor-chip:hover {
  background: var(--colors-primary, #0066cc);
  color: #ffffff;
  border-color: var(--colors-primary, #0066cc);
}

[data-theme="dark"] .anchor-chip {
  background: #272729;
  border-color: #333336;
  color: #d2d2d7;
}

[data-theme="dark"] .anchor-chip:hover {
  background: #2997ff;
  color: #ffffff;
  border-color: #2997ff;
}

.practice-sections-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.practice-section-card {
  background: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-lg, 18px);
  padding: 22px 24px;
  box-shadow: var(--shadow-apple-card);
}

[data-theme="dark"] .practice-section-card {
  background: #1d1d1f;
  border-color: #333336;
}

.section-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--colors-hairline-soft, #e5e5ea);
}

[data-theme="dark"] .section-card-header {
  border-bottom-color: #272729;
}

.section-card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: var(--colors-ink, #1d1d1f);
}

[data-theme="dark"] .section-card-title {
  color: #f5f5f7 !important;
}

.chap-badge {
  font-size: 11.5px;
  font-family: var(--font-mono);
  color: var(--colors-primary, #0066cc);
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  padding: 2px 8px;
  border-radius: var(--rounded-pill, 9999px);
  font-weight: 600;
}

[data-theme="dark"] .chap-badge {
  background: #272729;
  border-color: #333336;
  color: #2997ff;
}

.practice-body-box {
  background: var(--colors-canvas, #f5f5f7);
  border: 1px solid var(--colors-hairline-soft, #e5e5ea);
  border-radius: var(--rounded-md, 12px);
  padding: 18px;
  color: var(--colors-body, #1d1d1f);
}

[data-theme="dark"] .practice-body-box {
  background: #161617;
  border-color: #272729;
  color: #f5f5f7;
}

.bottom-action-row {
  margin-top: 32px;
  display: flex;
  gap: 12px;
}
</style>

<style>
/* 기초 실습 스타일시트 로드 */
@import '@/assets/practice.css';
</style>
