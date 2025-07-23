<script setup lang="ts">
import { computed, ref } from 'vue'

const isPulling = ref(false)
const isRefreshing = ref(false)
const pullDistance = ref(0)
const PULL_THRESHOLD = 120
const hasTriggeredRefresh = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

if (import.meta.client) {
  let lastDistance = 0
  usePullToRefresh({
    onPullStart: () => {
      isPulling.value = true
      isRefreshing.value = false
      pullDistance.value = 0
      hasTriggeredRefresh.value = false
    },
    onPullMove: (distance) => {
      pullDistance.value = Math.max(0, Math.min(distance, PULL_THRESHOLD * 1.5))
      lastDistance = distance
    },
    onPullEnd: () => {
      if (lastDistance >= PULL_THRESHOLD && !hasTriggeredRefresh.value) {
        isRefreshing.value = true
        isPulling.value = false
        hasTriggeredRefresh.value = true
        // Haptic feedback (if supported)
        if (window.navigator.vibrate)
          window.navigator.vibrate(10)
        setTimeout(() => {
          window.location.reload()
        }, 350)
      }
      else {
        isPulling.value = false
        pullDistance.value = 0
      }
      lastDistance = 0
    },
    threshold: PULL_THRESHOLD,
    scrollContainer,
  })
}

const activeColor = computed(() =>
  pullDistance.value >= PULL_THRESHOLD ? '#e12afb' : '#e12afb',
)
const textColorClass = computed(() =>
  pullDistance.value >= PULL_THRESHOLD
    ? 'text-primary-600 dark:text-primary-400'
    : 'text-primary-600 dark:text-primary-400',
)
const arrowRotation = computed(() =>
  pullDistance.value >= PULL_THRESHOLD ? 'rotate-180' : '',
)
</script>

<template>
  <div class="h-screen flex">
    <transition name="fade">
      <div
        v-if="isPulling || isRefreshing"
        class="fixed top-0 left-0 right-0 z-40 flex flex-col items-center justify-start pointer-events-none"
        :style="{ height: isPulling ? `${pullDistance}px` : isRefreshing ? '72px' : '0' }"
      >
        <div
          class="flex flex-col items-center justify-center w-full"
          :style="{ transform: `translateY(${isPulling ? pullDistance / 2 : 0}px)` }"
        >
          <div
            class="backdrop-blur bg-white/90 dark:bg-neutral-900/90 shadow-xl rounded-2xl border border-primary-100 dark:border-primary-900 flex items-center gap-4 px-6 py-3 mt-4 transition-all duration-200"
            style="min-width: 200px; min-height: 56px;"
          >
            <div class="relative flex items-center justify-center" style="width: 36px; height: 36px;">
              <svg v-if="!isRefreshing" width="36" height="36" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  :stroke="activeColor"
                  stroke-width="4"
                  stroke-linecap="round"
                  :stroke-dasharray="2 * Math.PI * 16"
                  :stroke-dashoffset="2 * Math.PI * 16 * (1 - Math.min(pullDistance / PULL_THRESHOLD, 1))"
                  style="transition: stroke 0.2s, stroke-dashoffset 0.2s;"
                />
              </svg>
              <UIcon
                v-if="!isRefreshing"
                name="i-lucide-arrow-down"
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200" :class="[
                  arrowRotation,
                  textColorClass,
                ]"
                size="28"
              />
              <UIcon
                v-if="isRefreshing"
                name="i-lucide-loader-circle"
                class="absolute inset-0 animate-spin" :class="[textColorClass]"
                size="32"
              />
            </div>
            <span class="text-base font-semibold select-none" :class="[textColorClass]">
              <template v-if="isRefreshing">
                Yenileniyor...
              </template>
              <template v-else-if="pullDistance >= PULL_THRESHOLD">
                Yenile
              </template>
              <template v-else>
                Sürükle yenile
              </template>
            </span>
          </div>
        </div>
      </div>
    </transition>
    <!-- Sidebar -->
    <NavSidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <NavHeader />

      <!-- Page Content -->
      <main ref="scrollContainer" class="flex-1 overflow-auto p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
