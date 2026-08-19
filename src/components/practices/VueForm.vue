<script setup>
import { ref } from 'vue'

const result = ref('')

const submit = (e) => {
  const formData = new FormData(e.target)
  result.value = formData.get('name')
}
</script>

<template>
    
  <form @submit.prevent="submit">
        이름:     <input name="name" />     <button type="submit">확인</button>   
  </form>

    
  <p>이름: {{ result }}</p>
</template>
