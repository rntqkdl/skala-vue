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
  <div class="apple-search-bar">
    <div class="search-inner-wrapper">
      <div class="search-input-col">
        <span class="search-label">산단 및 설비 공정 검색</span>
        <input
          type="text"
          :value="query"
          @input="(e) => $emit('update-query', e.target.value)"
          placeholder="산단명 또는 공정 검색 (예: 창원, 반도체, 여수, 제철, 구미)"
          class="apple-native-input"
        />
      </div>
      <button
        v-if="query"
        class="btn-clear-search"
        @click="$emit('update-query', '')"
        title="검색어 지우기"
      >
        ✕
      </button>
      <div class="search-orb-btn" title="검색">
        <span class="orb-icon">🔍</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.apple-search-bar {
  width: 100%;
}

.search-inner-wrapper {
  background: var(--colors-surface-card, #ffffff);
  border: 1px solid var(--colors-hairline, #d2d2d7);
  border-radius: var(--rounded-pill, 9999px);
  padding: 8px 10px 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-apple-card);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-inner-wrapper:hover {
  border-color: #b0b0b5;
  box-shadow: var(--shadow-apple-hover);
}

.search-inner-wrapper:focus-within {
  border-color: var(--colors-primary-focus, #0071e3);
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.25);
}

[data-theme='dark'] .search-inner-wrapper {
  background: #1d1d1f;
  border-color: #333336;
}

[data-theme='dark'] .search-inner-wrapper:hover {
  border-color: #48484a;
}

[data-theme='dark'] .search-inner-wrapper:focus-within {
  border-color: #2997ff;
  box-shadow: 0 0 0 3px rgba(41, 151, 255, 0.35);
}

.search-input-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.search-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--colors-mute, #86868b);
  letter-spacing: -0.1px;
  margin-bottom: 2px;
}

[data-theme='dark'] .search-label {
  color: #a1a1a6 !important;
}

.apple-native-input {
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-sans);
  font-size: 14.5px;
  color: var(--colors-body, #1d1d1f);
  width: 100%;
  padding: 0;
  margin: 0;
  letter-spacing: -0.2px;
}

.apple-native-input::placeholder {
  color: var(--colors-ash, #a1a1a6);
}

[data-theme='dark'] .apple-native-input {
  color: #f5f5f7;
}

.btn-clear-search {
  background: transparent;
  border: none;
  color: var(--colors-mute, #86868b);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--rounded-pill, 9999px);
  margin-right: 6px;
  transition: background-color 0.15s ease;
}

.btn-clear-search:hover {
  background-color: var(--colors-surface-deep, #e8e8ed);
  color: var(--colors-ink, #1d1d1f);
}

[data-theme='dark'] .btn-clear-search:hover {
  background-color: #272729;
  color: #f5f5f7;
}

.search-orb-btn {
  width: 36px;
  height: 36px;
  background-color: var(--colors-primary, #0066cc);
  color: #ffffff;
  border-radius: var(--rounded-pill, 9999px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    transform 0.1s ease,
    background-color 0.15s ease;
}

.search-orb-btn:hover {
  background-color: var(--colors-primary-focus, #0071e3);
}

.search-orb-btn:active {
  transform: scale(0.95);
}

.orb-icon {
  font-size: 14px;
}
</style>
