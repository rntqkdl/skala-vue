<script setup>
import { ref } from 'vue'

// 1. 조건부 온/오프 스위치 변수
const isLoggedIn = ref(false)
// 2. 다중 조건 분기용 숫자 변수
const score = ref(85)
</script>

<template>
  <div class="practice-section">
    <h2>v-if, v-else-if, v-else 디렉티브 학습</h2>
    <h3>1) 기본 로그인 상태 스위치</h3>
    <p v-if="isLoggedIn">환영합니다! 회원 전용 화면 입니다.</p>
    <p v-else>로그인이 필요합니다. 먼저 로그인 해주세요.</p>
    <button @click="isLoggedIn = !isLoggedIn">
      {{ isLoggedIn ? '로그아웃 하기' : '로그인 하기' }}
    </button>
    <br />
    <h3>2) 성적별 학점 등급 측정 (다중 조건문)</h3>
    <label> 현재 점수 입력 : </label>
    <input type="number" v-model="score" min="0" max="100" step="5" />
    <br />
    <div v-if="score >= 90" style="color: green; font-weight: bold">
      합격등급: A 학점 (훌륭합니다!)
    </div>
    <div v-else-if="score >= 80" style="color: blue; font-weight: bold">
      합격등급: B 학점 (양호합니다.)
    </div>
    <div v-else-if="score >= 70" style="color: orange; font-weight: bold">
      합격등급: C 학점 (조금 더 분발 하세요.)
    </div>
    <div v-else style="color: red; font-weight: bold">불합격: F 학점 (재시험 대상입니다.)</div>
  </div>
</template>
