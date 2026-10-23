<script setup lang="ts">
import ContentText from "~~/app/components/content/ContentText.vue";
import {
  hasText,
  isInternalHref,
  isSafeHref,
} from "~~/app/data/content/helpers";
import type { ContentCta } from "~~/app/data/content/types";

const props = defineProps<{ cta: ContentCta }>();
const links = computed(() =>
  props.cta.links.filter((link) => link.label.trim() && isSafeHref(link.to)),
);
</script>

<template>
  <div class="content-cta">
    <div class="content-cta__copy flow">
      <p v-if="cta.eyebrow?.trim()" class="content-cta__eyebrow">
        {{ cta.eyebrow }}
      </p>
      <h2 v-if="cta.title?.trim()">{{ cta.title }}</h2>
      <p v-if="hasText(cta.text)"><ContentText :value="cta.text!" /></p>
    </div>

    <div v-if="links.length" class="content-cta__actions">
      <template v-for="(link, index) in links" :key="index">
        <NuxtLink
          v-if="isInternalHref(link.to)"
          :class="
            index === 0 ? 'btn btn--secondary btn--lg' : 'content-cta__link'
          "
          :to="link.to"
        >
          {{ link.label }}<span v-if="index > 0" aria-hidden="true">→</span>
        </NuxtLink>
        <a
          v-else
          :class="
            index === 0 ? 'btn btn--secondary btn--lg' : 'content-cta__link'
          "
          :href="link.to"
        >
          {{ link.label }}<span v-if="index > 0" aria-hidden="true">→</span>
        </a>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.content-cta {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at 90% 0%, rgb(96 165 250 / 0.3), transparent 22rem),
    var(--color-primary-800);
  color: var(--color-white);
}

.content-cta__copy {
  max-width: 44rem;
}

.content-cta__copy h2 {
  color: var(--color-white);
}

.content-cta__copy > p:not(.content-cta__eyebrow) {
  color: var(--color-primary-100);
}

.content-cta__eyebrow {
  color: var(--color-primary-100);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.content-cta__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-5);
}

.content-cta__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.content-cta__link:hover {
  color: var(--color-white);
  text-decoration: underline;
}

@include respond-to(md) {
  .content-cta {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    padding: var(--space-10);
  }
}
</style>
