<template>
  <div class="h-screen min-h-screen flex flex-col">
    <header class="flex items-center justify-center border-b border-neutral-200 p-4 dark:border-neutral-800">
      <!-- Placeholder for future logo -->
      <h1 class="text-2xl font-bold">Nexus</h1>
    </header>
    <main class="flex flex-1 items-center justify-center">
      <slot />
    </main>
  </div>
</template>
