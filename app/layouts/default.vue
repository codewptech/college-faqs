<script setup lang="ts">
import AppFooter from '~~/app/components/layout/AppFooter.vue'
import AppHeader from '~~/app/components/layout/AppHeader.vue'
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">
      Skip to main content
    </a>

    <AppHeader />

    <main
      id="main-content"
      class="site-main"
      tabindex="-1"
    >
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
