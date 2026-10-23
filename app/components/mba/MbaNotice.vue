<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    tone?: "info" | "success";
  }>(),
  {
    title: "Good to know",
    tone: "info",
  },
);
</script>

<template>
  <aside class="mba-notice" :class="`mba-notice--${tone}`">
    <span class="mba-notice__icon" aria-hidden="true">i</span>
    <div class="flow">
      <strong>{{ title }}</strong>
      <div class="mba-notice__content">
        <slot />
      </div>
    </div>
  </aside>
</template>
