<script setup>
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

// 10. handon 2 실습
import WeatherComposition from './components/handson/WeatherComposition.vue'

// 11. Component Lifecycle > hook ex
import VueLifecycle from './components/practices/VueLifecycle.vue'

// 12. PropsEmits 실습
import PropsEmitsParent from './components/practices/PropsEmitsParent.vue'

// 13. Slot 실습
import SlotDefaultParent from './components/practices/SlotDefaultParent.vue'
import SlotNamedParent from './components/practices/SlotNamedParent.vue'
import SlotScopedParent from './components/practices/SlotScopedParent.vue'
</script>

<template>
  <div class="practice-container">
    <h1>SKALA Vue.js 전체 실습 모음</h1>
    <hr />

    <!-- 1. 기본 컴포넌트 -->
    <SampleOne />
    <SampleTwo />

    <!-- 2. 텍스트 렌더링 및 보안 -->
    <SampleVtext />
    <SampleVhtml />
    <SampleXss />

    <!-- 3. 속성 바인딩 -->
    <SampleVbind />
    <SampleVbindhigh />
    <SampleVbindhigh2 />

    <!-- 4. 조건부 및 리스트 렌더링 -->
    <SampleVif />
    <SampleVshow />
    <SampleVfor />

    <!-- 5. 렌더링 최적화 디렉티브 -->
    <SampleVpre />
    <SampleVonce />
    <SampleVmemo />
    <SampleVcloak />

    <!-- 6. 이벤트 핸들링 및 폼 처리 -->
    <VueonEventHandler />
    <VueEventObject />
    <VueEventModifier />
    <VueForm />
    <VuevModel />
    <VueFormDataBinding />

    <!-- 7. 스타일링 -->
    <VueStyle />

    <!-- 8. 반응형 상태 -->
    <VueRef />
    <VueReactive />

    <!-- 9. Computed & Watchers -->
    <VueComputed />
    <VueWatch />
    <VueMultiWatch />
    <DeepWatch />
    <WatchEffect />
    <!-- 10. handon 2  -->
    <WeatherComposition />
    <!-- 11. Component Lifecycle > hook ex  -->
    <VueLifecycle />
    <!-- 12. PropsEmits  -->
    <PropsEmitsParent />
    <!-- 13. Slot  -->
    <SlotDefaultParent />
    <SlotNamedParent />
    <SlotScopedParent />
  </div>
</template>

<style>
/* 🎨 실습용 공통 디자인 스타일시트 불러오기 */
@import '@/assets/practice.css';
</style>
