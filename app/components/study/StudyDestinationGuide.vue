<script setup lang="ts">
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentOnThisPage from "~~/app/components/content/ContentOnThisPage.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentCta from "~~/app/components/content/ContentCta.vue";
import ContentEditorialDates from "~~/app/components/content/ContentEditorialDates.vue";
import PendingResource from "~~/app/components/content/PendingResource.vue";
import {
  getRenderableSections,
  hasCountryGuideContent,
  hasCtaContent,
  hasText,
} from "~~/app/data/content/helpers";
import type { CountryGuideContent } from "~~/app/data/content/types";

const props = defineProps<{ guide: CountryGuideContent }>();
const published = computed(
  () => props.guide.ready && hasCountryGuideContent(props.guide),
);
const intro = computed(() => props.guide.intro.filter(hasText));
const highlights = computed(() => props.guide.highlights.filter(hasText));
const articleSections = computed(() =>
  getRenderableSections(props.guide.sections),
);
const tocEntries = computed(() =>
  articleSections.value.flatMap((entry) =>
    entry.anchorId && entry.section.title?.trim()
      ? [{ id: entry.anchorId, label: entry.section.title }]
      : [],
  ),
);

useSeoMeta({
  title: () =>
    props.guide.ready && props.guide.seo.title.trim()
      ? props.guide.seo.title
      : `${props.guide.country} Study Guide | College FAQs`,
  description: () =>
    props.guide.ready && props.guide.seo.description.trim()
      ? props.guide.seo.description
      : `${props.guide.country} Study Guide.`,
  robots: () => (published.value ? "index, follow" : "noindex, follow"),
  articlePublishedTime: () => props.guide.publishedAt ?? undefined,
  articleModifiedTime: () => props.guide.lastUpdated ?? undefined,
});
</script>

<template>
  <div class="destination-guide">
    <PendingResource
      v-if="!published"
      :title="`${guide.country} Study Guide`"
      :message="`Detailed guidance for ${guide.country} is being prepared. Explore destinations and the available Study Abroad enquiry forms.`"
      eyebrow="Study Abroad"
      action-to="/programs/study-abroad"
      action-label="Explore Study Abroad"
    />

    <template v-else>
      <section
        class="section destination-guide__hero"
        aria-labelledby="destination-guide-title"
      >
        <div class="container destination-guide__hero-content">
          <nav aria-label="Breadcrumb">
            <ol class="destination-guide__breadcrumb" role="list">
              <li>
                <NuxtLink to="/programs/study-abroad">Study Abroad</NuxtLink>
              </li>
              <li aria-current="page">{{ guide.country }}</li>
            </ol>
          </nav>

          <div class="destination-guide__hero-grid">
            <div class="destination-guide__heading flow">
              <p class="destination-guide__eyebrow">
                {{ guide.eyebrow.trim() || "Destination guide" }}
              </p>
              <h1 id="destination-guide-title">
                {{ guide.title.trim() || `${guide.country} Study Guide` }}
              </h1>
              <p v-if="guide.subtitle.trim()" class="destination-guide__lead">
                {{ guide.subtitle }}
              </p>
              <ContentEditorialDates
                :published-at="guide.publishedAt"
                :last-updated="guide.lastUpdated"
                :effective-at="guide.effectiveAt"
              />
            </div>

            <figure
              v-if="guide.heroImage?.src.trim()"
              class="destination-guide__hero-media"
            >
              <img
                :src="guide.heroImage.src"
                :alt="guide.heroImage.alt"
                :width="guide.heroImage.width"
                :height="guide.heroImage.height"
                decoding="async"
              />
              <figcaption v-if="guide.heroImage.caption?.trim()">
                {{ guide.heroImage.caption }}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <article
        class="section destination-guide__article"
        aria-labelledby="destination-guide-title"
      >
        <div class="container destination-guide__content">
          <div
            class="destination-guide__reading"
            :class="{ 'editorial-layout--with-nav': tocEntries.length > 1 }"
          >
            <ContentOnThisPage :entries="tocEntries" />
            <div class="editorial-layout__body editorial-prose">
              <div v-if="intro.length || highlights.length" class="flow">
                <div v-if="intro.length" class="destination-guide__intro flow">
                  <p v-for="(paragraph, index) in intro" :key="index">
                    <ContentText :value="paragraph" />
                  </p>
                </div>

                <ul
                  v-if="highlights.length"
                  class="destination-guide__highlights"
                >
                  <li v-for="(highlight, index) in highlights" :key="index">
                    <ContentText :value="highlight" />
                  </li>
                </ul>
              </div>

              <ContentSections
                v-if="articleSections.length"
                :sections="guide.sections"
              />

              <aside v-if="hasText(guide.notice)" class="editorial-note flow">
                <p><ContentText :value="guide.notice!" /></p>
              </aside>

              <aside
                v-if="hasText(guide.verificationNotice)"
                class="editorial-note flow"
              >
                <p><ContentText :value="guide.verificationNotice" /></p>
              </aside>
            </div>
          </div>

          <ContentCta v-if="hasCtaContent(guide.cta)" :cta="guide.cta!" />
          <NuxtLink class="destination-guide__back" to="/programs/study-abroad">
            ← Back to Study Abroad
          </NuxtLink>
        </div>
      </article>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.destination-guide__hero {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-white);
}

.destination-guide__hero-content,
.destination-guide__content {
  min-width: 0;
}

.destination-guide__hero-content {
  display: grid;
  gap: var(--space-8);
}

.destination-guide__breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: var(--font-size-sm);
}

.destination-guide__breadcrumb li + li::before {
  padding-right: var(--space-3);
  color: var(--color-text-muted);
  content: "/";
}

.destination-guide__hero-grid {
  display: grid;
  align-items: center;
  min-width: 0;
  gap: var(--space-8);
}

.destination-guide__heading {
  --flow-space: var(--space-5);
  min-width: 0;
  overflow-wrap: anywhere;
}

.destination-guide__eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.destination-guide__lead {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.destination-guide__hero-media {
  min-width: 0;
  margin: 0;
}

.destination-guide__hero-media img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius-xl);
  background: var(--color-white);
  object-fit: contain;
}

.destination-guide__hero-media figcaption {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.destination-guide__article {
  padding-top: var(--space-8);
}

.destination-guide__content {
  display: grid;
  max-width: 72rem;
  gap: var(--space-8);
  overflow-wrap: anywhere;
}

.destination-guide__content > * {
  min-width: 0;
}
.destination-guide__intro {
  --flow-space: var(--space-5);
}

.destination-guide__highlights {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding-left: var(--space-6);
  color: var(--color-text-secondary);
}

.destination-guide__reading {
  @include editorial-layout;
}

.destination-guide__intro,
.destination-guide__highlights {
  max-width: var(--content-max);
}

.destination-guide__back {
  justify-self: start;
  font-weight: var(--font-weight-semibold);
}

@include respond-to(md) {
  .destination-guide__hero-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  }
}
</style>
