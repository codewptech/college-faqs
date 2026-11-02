<script setup lang="ts">
import ContentOnThisPage from "~~/app/components/content/ContentOnThisPage.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentEditorialDates from "~~/app/components/content/ContentEditorialDates.vue";
import EmptyState from "~~/app/components/ui/EmptyState.vue";
import {
  getRenderableSections,
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
const navigationEntries = computed(() =>
  getRenderableSections(sections.value).flatMap((entry) =>
    entry.anchorId && entry.section.title?.trim()
      ? [{ id: entry.anchorId, label: entry.section.title }]
      : [],
  ),
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
          <ContentEditorialDates
            v-if="hasPublishedContent"
            :published-at="content.publishedAt"
            :last-updated="content.lastUpdated"
            :effective-at="content.effectiveAt"
          />
        </header>

        <template v-if="hasPublishedContent">
          <div v-if="intro.length" class="legal-page__intro flow">
            <p v-for="(paragraph, index) in intro" :key="index">
              <ContentText :value="paragraph" />
            </p>
          </div>

          <div
            v-if="sections.length"
            class="legal-page__reading"
            :class="{
              'editorial-layout--with-nav': navigationEntries.length > 1,
            }"
          >
            <ContentOnThisPage :entries="navigationEntries" />
            <div class="editorial-layout__body editorial-prose">
              <ContentSections :sections="sections" />
            </div>
          </div>

          <aside
            v-if="hasText(content.notice)"
            class="legal-page__notice editorial-note flow"
          >
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
@use "~~/app/assets/scss/abstracts/mixins" as *;
.legal-page {
  background: var(--color-white);
}

.legal-page__content {
  --flow-space: var(--space-8);

  max-width: 72rem;
  margin-inline: auto;
  overflow-wrap: anywhere;
}

.legal-page__content > header,
.legal-page__intro,
.legal-page__notice,
.legal-page__links {
  max-width: 52rem;
}

.legal-page__reading {
  @include editorial-layout;
}

.legal-page__reading .editorial-layout__body {
  max-width: 52rem;
}

.legal-page__eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.legal-page__intro {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.legal-page__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4) var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}
</style>
