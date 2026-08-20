<script setup>
import SlotNamedChild from './SlotNamedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named Slot 주입 실습</h2>
    <SlotNamedChild>
      <!-- 1. 이름을 지정한 슬롯 (자식의 <slot name="header"> 영역으로 쏙 들어감) -->
      <template #header>
        <h3>Child 주입 제목</h3>
      </template>

      <!-- 2. 기본 슬롯 (자식의 기본 <slot> 영역으로 쏙 들어감) -->
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
      </p>
    </SlotNamedChild>
  </div>
</template>
