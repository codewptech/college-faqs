<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description?: string
  image: string
  imageAlt: string
}>()
</script>

<template>
  <section class="explore-hero section">
    <div class="container explore-hero__grid">
      <div class="explore-hero__content flow">
        <p v-if="eyebrow.trim()" class="explore-hero__eyebrow">
          {{ eyebrow }}
        </p>

        <h1>
          {{ title }}
        </h1>

        <p v-if="description?.trim()" class="explore-hero__lead">
          {{ description }}
        </p>

        <slot name="actions" />
      </div>

      <div class="explore-hero__visual">
        <img
          :src="image"
          :alt="imageAlt"
          width="760"
          height="600"
        >
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '~~/app/assets/scss/abstracts/mixins' as *;

.explore-hero {
  border-bottom: 1px solid var(--color-border);
  background:
    radial-gradient(
      circle at 88% 15%,
      rgb(219 234 254 / 0.82),
      transparent 30rem
    ),
    linear-gradient(
      180deg,
      var(--color-white),
      var(--color-gray-50)
    );
}

.explore-hero__grid {
  display: grid;
  align-items: center;
  gap: var(--space-10);
}

.explore-hero__content {
  --flow-space: var(--space-6);

  min-width: 0;
  max-width: 47rem;
  overflow-wrap: anywhere;
}

.explore-hero__eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.explore-hero__lead {
  max-width: 43rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.explore-hero__visual {
  max-width: 36rem;
  margin-inline: auto;
}

.explore-hero__visual img {
  width: 100%;
  height: auto;
}

@include respond-to(md) {
  .explore-hero__grid {
    grid-template-columns:
      minmax(0, 1.05fr)
      minmax(20rem, 0.95fr);
  }
}

@include respond-to(lg) {
  .explore-hero__grid {
    gap: var(--space-16);
  }
}
</style>
