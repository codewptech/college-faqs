<script setup lang="ts">
import ContentOnThisPage from "~~/app/components/content/ContentOnThisPage.vue";
import ContentEditorialDates from "~~/app/components/content/ContentEditorialDates.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import PendingResource from "~~/app/components/content/PendingResource.vue";
import { aboutContent, type AboutCard } from "~~/app/data/content/about";
import {
  getRenderableSections,
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
const sectionEntries = getRenderableSections(sections);
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

const navigationEntries = [
  ...sectionEntries.flatMap((entry) =>
    entry.anchorId && entry.section.title?.trim()
      ? [{ id: entry.anchorId, label: entry.section.title }]
      : [],
  ),
  ...(principles.length && content.principles.title?.trim()
    ? [{ id: "principles-title", label: content.principles.title }]
    : []),
  ...(features.length && content.features.title?.trim()
    ? [{ id: "support-title", label: content.features.title }]
    : []),
  ...(journey.length && content.journey.title?.trim()
    ? [{ id: "journey-title", label: content.journey.title }]
    : []),
  ...(statistics.length && content.statistics.title?.trim()
    ? [{ id: "statistics-title", label: content.statistics.title }]
    : []),
];

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
    <PendingResource
      v-if="!hasContent"
      title="About College FAQs"
      message="More information about College FAQs is being prepared. In the meantime, explore our programmes and available guidance."
      action-to="/programs/mba"
      action-label="Explore MBA"
    />
    <template v-else>
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
            <ContentEditorialDates
              :published-at="content.publishedAt"
              :last-updated="content.lastUpdated"
              :effective-at="content.effectiveAt"
            />
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

      <div
        class="container about-editorial"
        :class="{ 'editorial-layout--with-nav': navigationEntries.length > 1 }"
      >
        <ContentOnThisPage :entries="navigationEntries" />
        <div class="editorial-layout__body editorial-prose">
          <section
            v-for="(entry, index) in sectionEntries"
            :id="entry.anchorId"
            :key="entry.anchorId || index"
            class="editorial-section about-story"
            :aria-labelledby="
              entry.section.title?.trim()
                ? `about-section-title-${index + 1}`
                : undefined
            "
          >
            <div
              class="about-story__grid"
              :class="{
                'about-story__grid--body-only':
                  !entry.section.title?.trim() &&
                  !entry.section.eyebrow?.trim(),
              }"
            >
              <div
                v-if="
                  entry.section.title?.trim() || entry.section.eyebrow?.trim()
                "
                class="about-story__heading flow"
              >
                <p
                  v-if="entry.section.eyebrow?.trim()"
                  class="editorial-eyebrow"
                >
                  {{ entry.section.eyebrow }}
                </p>
                <h2
                  v-if="entry.section.title?.trim()"
                  :id="`about-section-title-${index + 1}`"
                >
                  {{ entry.section.title }}
                </h2>
              </div>
              <ContentSections
                class="about-story__content"
                :sections="[{ blocks: entry.blocks }]"
                :heading-level="entry.section.title?.trim() ? 3 : 2"
              />
            </div>
          </section>

          <section
            v-if="principles.length"
            class="editorial-section about-principles"
            :aria-labelledby="
              content.principles.title?.trim() ? 'principles-title' : undefined
            "
          >
            <div>
              <div
                v-if="
                  content.principles.title?.trim() ||
                  content.principles.eyebrow?.trim() ||
                  hasText(content.principles.intro)
                "
                class="editorial-section-heading"
              >
                <div
                  v-if="
                    content.principles.title?.trim() ||
                    content.principles.eyebrow?.trim()
                  "
                  class="flow"
                >
                  <p
                    v-if="content.principles.eyebrow?.trim()"
                    class="editorial-eyebrow"
                  >
                    {{ content.principles.eyebrow }}
                  </p>
                  <h2
                    v-if="content.principles.title?.trim()"
                    id="principles-title"
                  >
                    {{ content.principles.title }}
                  </h2>
                </div>
                <p v-if="hasText(content.principles.intro)">
                  <ContentText :value="content.principles.intro!" />
                </p>
              </div>
              <ol class="editorial-card-grid" role="list">
                <li
                  v-for="(principle, index) in principles"
                  :key="index"
                  class="editorial-card"
                >
                  <span class="editorial-number" aria-hidden="true">{{
                    String(index + 1).padStart(2, "0")
                  }}</span>
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
            class="editorial-section about-support"
            :aria-labelledby="
              content.features.title?.trim() ? 'support-title' : undefined
            "
          >
            <div>
              <div
                v-if="
                  content.features.title?.trim() ||
                  content.features.eyebrow?.trim() ||
                  hasText(content.features.intro)
                "
                class="editorial-section-heading"
              >
                <div
                  v-if="
                    content.features.title?.trim() ||
                    content.features.eyebrow?.trim()
                  "
                  class="flow"
                >
                  <p
                    v-if="content.features.eyebrow?.trim()"
                    class="editorial-eyebrow"
                  >
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
              <div class="editorial-card-grid">
                <article
                  v-for="(feature, index) in features"
                  :key="index"
                  class="editorial-card editorial-card--icon"
                >
                  <div
                    class="editorial-card__mark about-support-icon"
                    aria-hidden="true"
                  >
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
            class="editorial-section about-journey"
            :aria-labelledby="
              content.journey.title?.trim() ? 'journey-title' : undefined
            "
          >
            <div
              class="about-journey__layout"
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
                class="editorial-section-heading"
              >
                <p
                  v-if="content.journey.eyebrow?.trim()"
                  class="editorial-eyebrow"
                >
                  {{ content.journey.eyebrow }}
                </p>
                <h2 v-if="content.journey.title?.trim()" id="journey-title">
                  {{ content.journey.title }}
                </h2>
                <p v-if="hasText(content.journey.intro)">
                  <ContentText :value="content.journey.intro!" />
                </p>
              </div>
              <ol class="editorial-steps" role="list">
                <li
                  v-for="(step, index) in journey"
                  :key="index"
                  class="editorial-step"
                >
                  <span class="editorial-number" aria-hidden="true">{{
                    String(index + 1).padStart(2, "0")
                  }}</span>
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
            class="editorial-section about-principles"
            :aria-labelledby="
              content.statistics.title?.trim() ? 'statistics-title' : undefined
            "
          >
            <div>
              <div
                v-if="content.statistics.title?.trim()"
                class="editorial-section-heading"
              >
                <h2 id="statistics-title">{{ content.statistics.title }}</h2>
              </div>
              <dl class="editorial-card-grid">
                <div
                  v-for="(statistic, index) in statistics"
                  :key="index"
                  class="editorial-card"
                >
                  <dt>{{ statistic.label }}</dt>
                  <dd class="about-statistic__value">{{ statistic.value }}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>

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
                    index === 0
                      ? 'btn btn--secondary btn--lg'
                      : 'about-cta__link'
                  "
                  :to="link.to"
                  >{{ link.label
                  }}<span v-if="index > 0" aria-hidden="true">→</span></NuxtLink
                >
                <a
                  v-else
                  :class="
                    index === 0
                      ? 'btn btn--secondary btn--lg'
                      : 'about-cta__link'
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
    </template>
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
.about-story__grid {
  display: grid;
  gap: var(--space-4);
}
.about-story__content {
  max-width: var(--content-max);
}
.about-support-icon span {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--color-primary-600);
}
.about-statistic__value {
  margin: 0;
  color: var(--color-primary-700);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
}
.about-cta {
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
}
.about-editorial {
  @include editorial-layout;
  padding-top: var(--space-8);
}
</style>
