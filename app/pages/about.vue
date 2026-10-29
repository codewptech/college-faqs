<script setup lang="ts">
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import EmptyState from "~~/app/components/ui/EmptyState.vue";
import { aboutContent, type AboutCard } from "~~/app/data/content/about";
import {
  hasCtaContent,
  hasSectionContent,
  hasText,
  isInternalHref,
  isSafeHref,
} from "~~/app/data/content/helpers";

const content = aboutContent;
const hasCardContent = (card: AboutCard) =>
  Boolean(card.title?.trim()) || hasText(card.description);
const intro = content.ready ? content.intro.filter(hasText) : [];
const heroLinks = content.ready
  ? content.heroLinks.filter((link) => link.label.trim() && isSafeHref(link.to))
  : [];
const sections = content.ready
  ? content.sections.filter(hasSectionContent)
  : [];
const principles = content.ready
  ? content.principles.items.filter(hasCardContent)
  : [];
const features = content.ready
  ? content.features.items.filter(hasCardContent)
  : [];
const journey = content.ready
  ? content.journey.items.filter(hasCardContent)
  : [];
const statistics = content.ready
  ? content.statistics.items.filter(
      (item) => item.value.trim() && item.label.trim(),
    )
  : [];
const missionLinks = content.ready
  ? content.mission.links.filter(
      (link) => link.label.trim() && isSafeHref(link.to),
    )
  : [];
const hasMission = content.ready && hasCtaContent(content.mission);
const hasContent = Boolean(
  intro.length ||
  heroLinks.length ||
  sections.length ||
  principles.length ||
  features.length ||
  journey.length ||
  statistics.length ||
  hasMission,
);

useSeoMeta({
  title:
    content.ready && content.seo.title.trim()
      ? content.seo.title
      : "About | College FAQs",
  description:
    content.ready && content.seo.description.trim()
      ? content.seo.description
      : "About College FAQs.",
  robots: content.ready && hasContent ? "index, follow" : "noindex, follow",
});
</script>

<template>
  <div class="about-page">
    <section class="about-hero section">
      <div class="container about-hero__grid">
        <div class="about-hero__content flow">
          <p
            v-if="content.ready && content.eyebrow?.trim()"
            class="about-eyebrow"
          >
            {{ content.eyebrow }}
          </p>
          <h1>
            {{
              content.ready && content.title.trim() ? content.title : "About"
            }}
          </h1>
          <p
            v-for="(paragraph, index) in intro"
            :key="index"
            class="about-hero__lead"
          >
            <ContentText :value="paragraph" />
          </p>
          <div v-if="heroLinks.length" class="about-hero__actions">
            <template v-for="(link, index) in heroLinks" :key="index">
              <NuxtLink
                v-if="isInternalHref(link.to)"
                class="btn btn--lg"
                :class="index === 0 ? 'btn--primary' : 'btn--secondary'"
                :to="link.to"
                >{{ link.label }}</NuxtLink
              >
              <a
                v-else
                class="btn btn--lg"
                :class="index === 0 ? 'btn--primary' : 'btn--secondary'"
                :href="link.to"
                >{{ link.label }}</a
              >
            </template>
          </div>
          <EmptyState
            v-if="!hasContent"
            variant="editorial"
            message="Content is being prepared."
          />
        </div>
        <div class="about-hero__visual" aria-hidden="true">
          <img
            src="/placeholders/about-guidance.svg"
            alt=""
            width="760"
            height="600"
          />
        </div>
      </div>
    </section>

    <section
      v-for="(section, index) in sections"
      :id="section.id || `about-section-${index + 1}`"
      :key="section.id || index"
      class="section about-story"
      :aria-labelledby="
        section.title?.trim() ? `about-section-title-${index + 1}` : undefined
      "
    >
      <div
        class="container about-story__grid"
        :class="{
          'about-story__grid--body-only':
            !section.title?.trim() && !section.eyebrow?.trim(),
        }"
      >
        <div
          v-if="section.title?.trim() || section.eyebrow?.trim()"
          class="about-story__heading flow"
        >
          <p v-if="section.eyebrow?.trim()" class="about-eyebrow">
            {{ section.eyebrow }}
          </p>
          <h2
            v-if="section.title?.trim()"
            :id="`about-section-title-${index + 1}`"
          >
            {{ section.title }}
          </h2>
        </div>
        <ContentSections
          class="about-story__content"
          :sections="[{ blocks: section.blocks }]"
          :heading-level="section.title?.trim() ? 3 : 2"
        />
      </div>
    </section>

    <section
      v-if="principles.length"
      class="section about-principles"
      :aria-labelledby="
        content.principles.title?.trim() ? 'principles-title' : undefined
      "
    >
      <div class="container">
        <div
          v-if="
            content.principles.title?.trim() ||
            content.principles.eyebrow?.trim() ||
            hasText(content.principles.intro)
          "
          class="about-section-heading"
        >
          <div
            v-if="
              content.principles.title?.trim() ||
              content.principles.eyebrow?.trim()
            "
            class="flow"
          >
            <p v-if="content.principles.eyebrow?.trim()" class="about-eyebrow">
              {{ content.principles.eyebrow }}
            </p>
            <h2 v-if="content.principles.title?.trim()" id="principles-title">
              {{ content.principles.title }}
            </h2>
          </div>
          <p v-if="hasText(content.principles.intro)">
            <ContentText :value="content.principles.intro!" />
          </p>
        </div>
        <ol class="about-principles__grid" role="list">
          <li
            v-for="(principle, index) in principles"
            :key="index"
            class="about-principle"
          >
            <span
              class="about-principle__number number-badge"
              aria-hidden="true"
              >{{ String(index + 1).padStart(2, "0") }}</span
            >
            <div class="flow">
              <component
                :is="content.principles.title?.trim() ? 'h3' : 'h2'"
                v-if="principle.title?.trim()"
                >{{ principle.title }}</component
              >
              <p v-if="hasText(principle.description)">
                <ContentText :value="principle.description!" />
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section
      v-if="features.length"
      class="section about-support"
      :aria-labelledby="
        content.features.title?.trim() ? 'support-title' : undefined
      "
    >
      <div class="container">
        <div
          v-if="
            content.features.title?.trim() ||
            content.features.eyebrow?.trim() ||
            hasText(content.features.intro)
          "
          class="about-section-heading"
        >
          <div
            v-if="
              content.features.title?.trim() || content.features.eyebrow?.trim()
            "
            class="flow"
          >
            <p v-if="content.features.eyebrow?.trim()" class="about-eyebrow">
              {{ content.features.eyebrow }}
            </p>
            <h2 v-if="content.features.title?.trim()" id="support-title">
              {{ content.features.title }}
            </h2>
          </div>
          <p v-if="hasText(content.features.intro)">
            <ContentText :value="content.features.intro!" />
          </p>
        </div>
        <div class="about-support__grid">
          <article
            v-for="(feature, index) in features"
            :key="index"
            class="about-support-card"
          >
            <div class="about-support-card__icon" aria-hidden="true">
              <span />
            </div>
            <div class="flow">
              <component
                :is="content.features.title?.trim() ? 'h3' : 'h2'"
                v-if="feature.title?.trim()"
                >{{ feature.title }}</component
              >
              <p v-if="hasText(feature.description)">
                <ContentText :value="feature.description!" />
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section
      v-if="journey.length"
      class="section about-journey"
      :aria-labelledby="
        content.journey.title?.trim() ? 'journey-title' : undefined
      "
    >
      <div
        class="container about-journey__layout"
        :class="{
          'about-journey__layout--steps-only':
            !content.journey.title?.trim() &&
            !content.journey.eyebrow?.trim() &&
            !hasText(content.journey.intro),
        }"
      >
        <div
          v-if="
            content.journey.title?.trim() ||
            content.journey.eyebrow?.trim() ||
            hasText(content.journey.intro)
          "
          class="about-journey__intro flow"
        >
          <p v-if="content.journey.eyebrow?.trim()" class="about-eyebrow">
            {{ content.journey.eyebrow }}
          </p>
          <h2 v-if="content.journey.title?.trim()" id="journey-title">
            {{ content.journey.title }}
          </h2>
          <p v-if="hasText(content.journey.intro)">
            <ContentText :value="content.journey.intro!" />
          </p>
        </div>
        <ol class="about-journey__steps" role="list">
          <li
            v-for="(step, index) in journey"
            :key="index"
            class="about-journey__step"
          >
            <span
              class="about-journey__index step-indicator"
              aria-hidden="true"
              >{{ String(index + 1).padStart(2, "0") }}</span
            >
            <div class="flow">
              <component
                :is="content.journey.title?.trim() ? 'h3' : 'h2'"
                v-if="step.title?.trim()"
                >{{ step.title }}</component
              >
              <p v-if="hasText(step.description)">
                <ContentText :value="step.description!" />
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section
      v-if="statistics.length"
      class="section about-principles"
      :aria-labelledby="
        content.statistics.title?.trim() ? 'statistics-title' : undefined
      "
    >
      <div class="container">
        <div
          v-if="content.statistics.title?.trim()"
          class="about-section-heading"
        >
          <h2 id="statistics-title">{{ content.statistics.title }}</h2>
        </div>
        <dl class="about-principles__grid">
          <div
            v-for="(statistic, index) in statistics"
            :key="index"
            class="about-principle"
          >
            <dt>{{ statistic.label }}</dt>
            <dd class="about-statistic__value">{{ statistic.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section
      v-if="hasMission"
      class="section about-cta"
      :aria-labelledby="
        content.mission.title?.trim() ? 'about-cta-title' : undefined
      "
    >
      <div class="container">
        <div class="about-cta__panel">
          <div
            v-if="
              content.mission.eyebrow?.trim() ||
              content.mission.title?.trim() ||
              hasText(content.mission.text)
            "
            class="flow"
          >
            <p
              v-if="content.mission.eyebrow?.trim()"
              class="about-eyebrow about-eyebrow--light"
            >
              {{ content.mission.eyebrow }}
            </p>
            <h2 v-if="content.mission.title?.trim()" id="about-cta-title">
              {{ content.mission.title }}
            </h2>
            <p v-if="hasText(content.mission.text)">
              <ContentText :value="content.mission.text!" />
            </p>
          </div>
          <div v-if="missionLinks.length" class="about-cta__actions">
            <template v-for="(link, index) in missionLinks" :key="index">
              <NuxtLink
                v-if="isInternalHref(link.to)"
                :class="
                  index === 0 ? 'btn btn--secondary btn--lg' : 'about-cta__link'
                "
                :to="link.to"
                >{{ link.label
                }}<span v-if="index > 0" aria-hidden="true">→</span></NuxtLink
              >
              <a
                v-else
                :class="
                  index === 0 ? 'btn btn--secondary btn--lg' : 'about-cta__link'
                "
                :href="link.to"
                >{{ link.label
                }}<span v-if="index > 0" aria-hidden="true">→</span></a
              >
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;
.about-page {
  overflow: clip;
  overflow-wrap: anywhere;
}
.about-eyebrow {
  color: var(--color-brand-red);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.about-eyebrow--light {
  color: var(--color-gray-200);
}
.about-hero {
  background: var(--color-white);
}
.about-hero__grid {
  display: grid;
  align-items: center;
  gap: var(--space-10);
}
.about-hero__content {
  --flow-space: var(--space-6);
  max-width: 45rem;
}
.about-hero__lead {
  max-width: 42rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}
.about-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
.about-hero__visual {
  max-width: 38rem;
  margin-inline: auto;
  background: var(--color-white);
}
.about-hero__visual img {
  width: 100%;
  height: auto;
}
.about-story {
  background: var(--color-white);
}
.about-story__grid {
  display: grid;
  gap: var(--space-8);
}
.about-story__heading {
  max-width: 38rem;
}
.about-story__content {
  --flow-space: var(--space-5);
  max-width: 46rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}
.about-story__grid.about-story__grid--body-only {
  grid-template-columns: minmax(0, 1fr);
}
.about-section-heading {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}
.about-section-heading > div {
  max-width: 43rem;
}
.about-section-heading > p {
  max-width: 38rem;
  color: var(--color-text-secondary);
}
.about-principles {
  background: var(--color-gray-50);
}
.about-principles__grid {
  display: grid;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}
.about-principle {
  display: grid;
  align-content: start;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}
.about-principle__number {
  align-self: start;
}
.about-statistic__value {
  margin: 0;
  color: var(--color-primary-700);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
}
.about-principle p,
.about-support-card p,
.about-journey__step p {
  color: var(--color-text-secondary);
}
.about-support {
  background: var(--color-white);
}
.about-support__grid {
  display: grid;
  gap: var(--space-5);
}
.about-support-card {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
.about-support-card__icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
}
.about-support-card__icon span {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: var(--color-primary-600);
}
.about-journey {
  background: var(--color-gray-50);
}
.about-journey__layout {
  display: grid;
  gap: var(--space-10);
}
.about-journey__layout.about-journey__layout--steps-only {
  grid-template-columns: minmax(0, 1fr);
}
.about-journey__intro {
  max-width: 40rem;
}
.about-journey__intro p:last-child {
  color: var(--color-text-secondary);
}
.about-journey__steps {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
.about-journey__step {
  position: relative;
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: start;
  gap: var(--space-5);
  padding-block: var(--space-6);
}
.about-journey__step:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}
.about-journey__index {
  align-self: start;
  margin-top: 0.125rem;
}
.about-cta {
  padding-top: 0;
  background: var(--color-gray-50);
}
.about-cta__panel {
  --color-focus: var(--color-gray-100);
  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border-top: 3px solid var(--color-brand-red);
  border-radius: var(--radius-xl);
  background: var(--color-surface-dark);
  color: var(--color-white);
}
.about-cta__panel > div:first-child {
  max-width: 44rem;
}
.about-cta__panel p:not(.about-eyebrow) {
  color: var(--color-gray-200);
}
.about-cta__panel :deep(p a) {
  color: inherit;
}
.about-cta__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-5);
}
.about-cta__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}
.about-cta__link:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
@include respond-to(md) {
  .about-hero__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.95fr);
  }
  .about-story__grid {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-12);
  }
  .about-section-heading {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.7fr);
    align-items: end;
  }
  .about-principles__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .about-support__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .about-journey__layout {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-12);
  }
  .about-cta__panel {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    padding: var(--space-10);
  }
}
@include respond-to(lg) {
  .about-hero__grid {
    gap: var(--space-16);
  }
  .about-principle,
  .about-support-card {
    padding: var(--space-7);
  }
}
</style>
