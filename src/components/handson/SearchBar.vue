<script setup>
defineEmits(['update-query'])
defineProps({
  query: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="resend-search-box">
    <el-input
      :model-value="query"
      @input="(val) => $emit('update-query', val)"
      placeholder="🔍 산단명 또는 대표 공정 검색 (예: 창원, 기계, 포항, 배터리, 정유)"
      clearable
      size="large"
      class="resend-el-search"
    >
      <template #prefix>
        <span class="search-icon-prefix">🔎</span>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.resend-search-box {
  width: 100%;
}

:deep(.resend-el-search .el-input__wrapper) {
  background-color: var(--colors-surface-deep, #06060a);
  border-radius: var(--rounded-md, 8px);
  box-shadow: 0 0 0 1px var(--colors-hairline-strong, rgba(255, 255, 255, 0.14)) inset;
  padding: 6px 14px;
  transition: all 0.15s ease;
}

:deep(.resend-el-search .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25) inset;
}

:deep(.resend-el-search .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--colors-ink, #fcfdff) inset, 0 0 8px rgba(255, 255, 255, 0.12);
}

.search-icon-prefix {
  font-size: 13px;
  margin-right: 4px;
}
</style>
