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
  <div class="content-cta editorial-prose">
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
            index === 0 ? 'btn btn--primary btn--lg' : 'content-cta__link'
          "
          :to="link.to"
        >
          {{ link.label }}<span v-if="index > 0" aria-hidden="true">→</span>
        </NuxtLink>
        <a
          v-else
          :class="
            index === 0 ? 'btn btn--primary btn--lg' : 'content-cta__link'
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
  width: 100%;
  min-width: 0;
  max-width: 64rem;
  gap: var(--space-6);
  margin-inline: auto;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-brand-red);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-text);
  overflow-wrap: anywhere;
}

.content-cta__copy {
  --flow-space: var(--space-4);
  min-width: 0;
  max-width: 44rem;
}

.content-cta__copy h2 {
  color: var(--color-text);
  text-wrap: pretty;
}

.content-cta__copy > p:not(.content-cta__eyebrow) {
  color: var(--color-text-secondary);
}

.content-cta__eyebrow {
  color: var(--color-brand-red);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.content-cta__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-6);
  min-width: 0;
}

.content-cta__actions > a {
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
}

.content-cta__link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-link);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.content-cta__link:hover {
  color: var(--color-link-hover);
  text-decoration: underline;
}

@include respond-to(md) {
  .content-cta {
    padding: var(--space-8);
  }
}
</style>
