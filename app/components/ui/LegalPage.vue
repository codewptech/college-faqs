<script setup lang="ts">
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import EmptyState from "~~/app/components/ui/EmptyState.vue";
import {
  hasLegalPageContent,
  hasSectionContent,
  hasText,
} from "~~/app/data/content/helpers";
import type { LegalPageContent } from "~~/app/data/content/types";

const props = defineProps<{
  content: LegalPageContent;
  relatedTitle: string;
  relatedTo: string;
}>();

const intro = computed(() =>
  props.content.ready ? props.content.intro.filter(hasText) : [],
);
const sections = computed(() =>
  props.content.ready ? props.content.sections.filter(hasSectionContent) : [],
);
const hasPublishedContent = computed(
  () => props.content.ready && hasLegalPageContent(props.content),
);
</script>

<template>
  <section class="section legal-page" aria-labelledby="legal-page-title">
    <div class="container">
      <div class="legal-page__content flow">
        <header class="flow">
          <p class="legal-page__eyebrow">College FAQs</p>
          <h1 id="legal-page-title">{{ content.title }}</h1>
          <p
            v-if="hasPublishedContent && content.lastUpdated.trim()"
            class="legal-page__updated"
          >
            Last updated: {{ content.lastUpdated }}
          </p>
        </header>

        <template v-if="hasPublishedContent">
          <div v-if="intro.length" class="legal-page__intro flow">
            <p v-for="(paragraph, index) in intro" :key="index">
              <ContentText :value="paragraph" />
            </p>
          </div>

          <ContentSections v-if="sections.length" :sections="sections" />

          <aside v-if="hasText(content.notice)" class="legal-page__notice flow">
            <ContentText :value="content.notice!" />
          </aside>
        </template>

        <EmptyState
          v-else
          variant="editorial"
          :message="`${content.title} content is being prepared.`"
        />

        <nav class="legal-page__links" aria-label="Related pages">
          <NuxtLink :to="relatedTo">{{ relatedTitle }}</NuxtLink>
          <NuxtLink to="/about">About College FAQs</NuxtLink>
          <NuxtLink to="/">Return to Home</NuxtLink>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.legal-page {
  background: var(--color-surface-subtle);
}

.legal-page__content {
  --flow-space: var(--space-8);

  max-width: 52rem;
  margin-inline: auto;
  overflow-wrap: anywhere;
}

.legal-page__eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.legal-page__updated {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.legal-page__intro {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.legal-page__notice {
  padding: var(--space-5);
  border-left: 3px solid var(--color-primary-600);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background: var(--color-primary-50);
  color: var(--color-text-secondary);
}

.legal-page__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4) var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}
</style>
