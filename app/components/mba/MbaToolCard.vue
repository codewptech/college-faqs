<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  to: string;
  icon: string;
  featured?: boolean;
}>();
</script>

<template>
  <NuxtLink
    class="mba-tool-card"
    :class="{ 'mba-tool-card--featured': featured }"
    :to="to"
  >
    <span class="mba-tool-card__icon" aria-hidden="true">{{ icon }}</span>
    <div class="mba-tool-card__content flow">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <span class="mba-tool-card__arrow" aria-hidden="true">→</span>
  </NuxtLink>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.mba-tool-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: var(--space-4);
  min-height: 100%;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-text);
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  @include interactive-transition(border-color, box-shadow, background-color);
}

.mba-tool-card:hover,
.mba-tool-card:focus-visible {
  border-color: var(--color-primary-600);
  background: var(--color-surface-subtle);
  box-shadow: var(--shadow-md);
  color: var(--color-text);
  text-decoration: none;
}

.mba-tool-card--featured {
  border-top: 3px solid var(--color-brand-red);
  background: var(--color-surface-dark);
  color: var(--color-white);
}

.mba-tool-card--featured:hover,
.mba-tool-card--featured:focus-visible {
  background: var(--color-gray-800);
  color: var(--color-white);
}

.mba-tool-card__icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  font-size: var(--font-size-lg);
}

.mba-tool-card__content {
  --flow-space: var(--space-2);
}

.mba-tool-card__content p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.mba-tool-card__arrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-xl);
  line-height: 1;
}

.mba-tool-card--featured .mba-tool-card__content p {
  color: var(--color-gray-200);
}

.mba-tool-card--featured .mba-tool-card__icon {
  background: var(--color-white);
  color: var(--color-brand-red);
}

.mba-tool-card--featured .mba-tool-card__arrow {
  color: var(--color-white);
}
</style>
