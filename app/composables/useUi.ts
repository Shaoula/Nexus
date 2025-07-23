export const useUiState = defineStore('ui', () => {
  const showSidebar = ref(false)

  async function toggleSidebar(value?: boolean) {
    if (typeof value === 'boolean')
      showSidebar.value = value
    else
      showSidebar.value = !showSidebar.value
  }

  return {
    showSidebar,
    toggleSidebar,
  }
}, { persist: true })

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUiState, import.meta.hot))
