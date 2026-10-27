<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    message: string;
    variant?: "default" | "editorial";
  }>(),
  { variant: "default" },
);
</script>

<template>
  <div :class="variant === 'editorial' ? 'content-pending' : 'empty-state'">
    <h2 v-if="title">{{ title }}</h2>
    <p>{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.content-pending {
  color: var(--color-text-secondary);
}

.content-pending p {
  max-width: var(--content-max);
}
</style>
