<script setup lang="ts">
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentCta from "~~/app/components/content/ContentCta.vue";
import {
  hasCountryGuideContent,
  hasCtaContent,
  hasSectionContent,
  hasText,
} from "~~/app/data/content/helpers";
import type { CountryGuideContent } from "~~/app/data/content/types";

const props = defineProps<{ guide: CountryGuideContent }>();
const intro = computed(() => props.guide.intro.filter(hasText));
const highlights = computed(() => props.guide.highlights.filter(hasText));
const hasSections = computed(() =>
  props.guide.sections.some(hasSectionContent),
);
const hasPublishedContent = computed(
  () => props.guide.ready && hasCountryGuideContent(props.guide),
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
  robots: () =>
    hasPublishedContent.value ? "index, follow" : "noindex, follow",
});
</script>

<template>
  <div class="destination-guide">
    <section
      class="section destination-guide__hero"
      aria-labelledby="destination-guide-title"
    >
      <div class="container flow">
        <nav aria-label="Breadcrumb">
          <ol class="destination-guide__breadcrumb" role="list">
            <li>
              <NuxtLink to="/programs/study-abroad">Study Abroad</NuxtLink>
            </li>
            <li aria-current="page">{{ guide.country }}</li>
          </ol>
        </nav>

        <div class="destination-guide__hero-grid">
          <div class="flow">
            <p class="destination-guide__eyebrow">
              {{
                hasPublishedContent && guide.eyebrow.trim()
                  ? guide.eyebrow
                  : "Destination guide"
              }}
            </p>
            <h1 id="destination-guide-title">
              {{
                hasPublishedContent && guide.title.trim()
                  ? guide.title
                  : `${guide.country} Study Guide`
              }}
            </h1>
            <p
              v-if="hasPublishedContent && guide.subtitle.trim()"
              class="destination-guide__lead"
            >
              {{ guide.subtitle }}
            </p>
          </div>
          <img
            src="/placeholders/study-destination-guide.svg"
            alt=""
            width="640"
            height="360"
          />
        </div>
      </div>
    </section>

    <section
      class="section"
      :aria-labelledby="
        hasPublishedContent ? undefined : 'destination-guide-status'
      "
    >
      <div class="container destination-guide__content">
        <div v-if="!hasPublishedContent" class="destination-guide__status flow">
          <h2 id="destination-guide-status">Guide being prepared</h2>
          <p>This guide is being prepared.</p>
        </div>

        <template v-else>
          <div v-if="intro.length" class="flow">
            <p v-for="(paragraph, index) in intro" :key="index">
              <ContentText :value="paragraph" />
            </p>
          </div>

          <div v-if="highlights.length" class="flow">
            <ul class="destination-guide__highlights">
              <li v-for="(highlight, index) in highlights" :key="index">
                <ContentText :value="highlight" />
              </li>
            </ul>
          </div>

          <ContentSections v-if="hasSections" :sections="guide.sections" />

          <aside
            v-if="hasText(guide.notice)"
            class="destination-guide__note flow"
          >
            <p><ContentText :value="guide.notice!" /></p>
          </aside>

          <aside
            v-if="hasText(guide.verificationNotice)"
            class="destination-guide__note flow"
          >
            <p><ContentText :value="guide.verificationNotice" /></p>
          </aside>

          <ContentCta v-if="hasCtaContent(guide.cta)" :cta="guide.cta!" />
        </template>

        <NuxtLink class="destination-guide__back" to="/programs/study-abroad"
          >← Back to Study Abroad</NuxtLink
        >
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.destination-guide__hero {
  background: linear-gradient(
    180deg,
    var(--color-primary-50),
    var(--color-white)
  );
}

.destination-guide__breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: 0;
  list-style: none;
  font-size: var(--font-size-sm);

  li + li::before {
    padding-right: var(--space-3);
    color: var(--color-text-muted);
    content: "/";
  }
}

.destination-guide__hero-grid {
  display: grid;
  min-width: 0;
  overflow-wrap: anywhere;
  align-items: center;
  gap: var(--space-8);

  > .flow {
    --flow-space: var(--space-6);
  }

  img {
    width: 100%;
    height: auto;
    border-radius: var(--radius-xl);
  }
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

.destination-guide__content {
  display: grid;
  min-width: 0;
  overflow-wrap: anywhere;
  gap: var(--space-8);
  max-width: calc(var(--content-max) + 2 * var(--container-gutter));

  > * {
    min-width: 0;
  }
}

.destination-guide__highlights {
  display: grid;
  gap: var(--space-3);
  padding-left: var(--space-6);
  color: var(--color-text-secondary);
}

.destination-guide__status {
  --flow-space: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-gray-50);

  p {
    color: var(--color-text-secondary);
  }
}

.destination-guide__note {
  --flow-space: var(--space-3);
  padding-inline: var(--space-4);
  border-left: 3px solid var(--color-primary-100);
  color: var(--color-text-secondary);

  h2 {
    font-size: var(--font-size-lg);
  }
}

.destination-guide__back {
  justify-self: start;
  font-weight: var(--font-weight-semibold);
}

@include respond-to(md) {
  .destination-guide__hero-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  }

  .destination-guide__status {
    padding: var(--space-8);
  }
}
</style>
