<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    message: string;
    eyebrow?: string;
    actionTo?: string;
    actionLabel?: string;
  }>(),
  { eyebrow: "College FAQs" },
);
</script>

<template>
  <section
    class="section pending-resource"
    aria-labelledby="pending-resource-title"
  >
    <div class="container">
      <div class="pending-resource__body flow">
        <p class="pending-resource__eyebrow">{{ eyebrow }}</p>
        <h1 id="pending-resource-title">{{ title }}</h1>
        <div class="content-pending">
          <p class="pending-resource__message">{{ message }}</p>
        </div>
        <NuxtLink
          v-if="actionTo && actionLabel"
          :to="actionTo"
          class="btn btn--primary btn--lg"
        >
          {{ actionLabel }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pending-resource {
  background: var(--color-surface-subtle);
}
.pending-resource__body {
  --flow-space: var(--space-5);
  max-width: 42rem;
  padding-left: var(--space-6);
  border-left: 3px solid var(--color-brand-red);
}
.pending-resource__eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.pending-resource__message {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}
</style>
