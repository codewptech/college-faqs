<script setup lang="ts">
import type { ResponsiveImage } from "~~/app/data/content/types";

const props = defineProps<{
  title: string;
  description: string;
  to: string;
  image: ResponsiveImage;
}>();
</script>

<template>
  <article class="program-card card card--interactive">
    <div class="program-card__media">
      <img
        :src="props.image.src"
        :srcset="props.image.srcset"
        :sizes="props.image.sizes"
        :alt="props.image.alt"
        class="program-card__image"
        loading="lazy"
        :width="props.image.width"
        :height="props.image.height"
      />
    </div>

    <div class="program-card__content">
      <h3 class="program-card__title">
        {{ props.title }}
      </h3>

      <p class="program-card__description">
        {{ props.description }}
      </p>

      <NuxtLink
        class="program-card__link"
        :to="props.to"
        :aria-label="`Explore ${props.title}`"
      >
        Explore {{ props.title }}
        <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.program-card {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}

.program-card__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-white);
}

.program-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.program-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.program-card__title {
  font-size: var(--font-size-2xl);
}

.program-card__description {
  color: var(--color-text-secondary);
}

.program-card__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  width: fit-content;
  margin-top: auto;
  font-weight: var(--font-weight-bold);
  text-decoration: none;
}

.program-card__link:hover {
  text-decoration: underline;
}
</style>
