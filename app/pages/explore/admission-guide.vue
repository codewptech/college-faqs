<script setup lang="ts">
import ExploreHero from "~~/app/components/explore/ExploreHero.vue";
import EmptyState from "~~/app/components/ui/EmptyState.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentCta from "~~/app/components/content/ContentCta.vue";
import { admissionGuideContent as content } from "~~/app/data/content/explore/admissionGuide";
import {
  hasCtaContent,
  hasSectionContent,
  hasText,
} from "~~/app/data/content/helpers";

const steps = computed(() => content.process.steps.filter(hasSectionContent));
const questions = computed(() => content.shortlist.items.filter(hasText));
const readinessItems = computed(() =>
  content.readiness.items.filter(hasSectionContent),
);
const sections = computed(() => content.sections.filter(hasSectionContent));
const hasProcess = computed(
  () => steps.value.length > 0 || content.process.intro.some(hasText),
);
const hasShortlistIntro = computed(
  () =>
    content.shortlist.title.trim() ||
    content.shortlist.eyebrow.trim() ||
    content.shortlist.intro.some(hasText),
);
const hasShortlist = computed(
  () => questions.value.length > 0 || content.shortlist.intro.some(hasText),
);
const hasReadiness = computed(
  () =>
    readinessItems.value.length > 0 || content.readiness.intro.some(hasText),
);
const hasContent = computed(
  () =>
    hasText(content.subtitle) ||
    content.intro.some(hasText) ||
    hasProcess.value ||
    hasShortlist.value ||
    hasReadiness.value ||
    sections.value.length > 0 ||
    hasCtaContent(content.cta),
);

useSeoMeta({
  title:
    (content.ready && content.seo.title.trim()) ||
    "Admission Guide | College FAQs",
  description:
    (content.ready && content.seo.description.trim()) ||
    "Admission Guide | College FAQs",
  robots: () =>
    content.ready && hasContent.value ? "index, follow" : "noindex, follow",
});
</script>

<template>
  <div class="admission-guide-page">
    <ExploreHero
      :eyebrow="content.eyebrow"
      :title="content.title.trim() || 'Admission Guide'"
      :description="content.ready ? content.subtitle : undefined"
      image="/placeholders/admission-guide.svg"
      image-alt=""
    >
      <template #actions>
        <div class="admission-hero-actions">
          <a
            v-if="content.ready && hasProcess"
            class="btn btn--primary btn--lg"
            href="#admission-journey"
          >
            Admission process
          </a>
          <NuxtLink class="btn btn--secondary btn--lg" to="/#programs">
            Explore programs
          </NuxtLink>
        </div>
      </template>
    </ExploreHero>

    <template v-if="content.ready && hasContent">
      <section v-if="content.intro.some(hasText)" class="section">
        <div class="container flow">
          <p
            v-for="(paragraph, index) in content.intro.filter(hasText)"
            :key="index"
          >
            <ContentText :value="paragraph" />
          </p>
        </div>
      </section>

      <section
        v-if="hasProcess"
        id="admission-journey"
        class="section admission-journey"
        :aria-labelledby="
          content.process.title.trim() ? 'admission-journey-title' : undefined
        "
      >
        <div class="container">
          <div
            v-if="
              content.process.eyebrow.trim() ||
              content.process.title.trim() ||
              content.process.intro.some(hasText)
            "
            class="admission-section-heading"
          >
            <div
              v-if="
                content.process.eyebrow.trim() || content.process.title.trim()
              "
              class="flow"
            >
              <p
                v-if="content.process.eyebrow.trim()"
                class="admission-eyebrow"
              >
                {{ content.process.eyebrow }}
              </p>
              <h2
                v-if="content.process.title.trim()"
                id="admission-journey-title"
              >
                {{ content.process.title }}
              </h2>
            </div>
            <div
              v-if="content.process.intro.some(hasText)"
              class="flow admission-section-intro"
            >
              <p
                v-for="(paragraph, index) in content.process.intro.filter(
                  hasText,
                )"
                :key="index"
              >
                <ContentText :value="paragraph" />
              </p>
            </div>
          </div>
          <ol v-if="steps.length" class="admission-journey__grid" role="list">
            <li
              v-for="(step, index) in steps"
              :key="step.id || index"
              class="admission-step"
            >
              <span
                class="admission-step__number step-indicator"
                aria-hidden="true"
              >
                {{ String(index + 1).padStart(2, "0") }}
              </span>
              <ContentSections
                :sections="[step]"
                :heading-level="content.process.title.trim() ? 3 : 2"
              />
            </li>
          </ol>
        </div>
      </section>

      <section
        v-if="hasShortlist"
        class="section admission-shortlist"
        :aria-labelledby="
          hasShortlistIntro && content.shortlist.title.trim()
            ? 'admission-shortlist-title'
            : undefined
        "
      >
        <div
          class="container admission-shortlist__grid"
          :class="{
            'admission-content-grid--single':
              !hasShortlistIntro || !questions.length,
          }"
        >
          <div
            v-if="hasShortlistIntro"
            class="admission-shortlist__content flow"
          >
            <p
              v-if="content.shortlist.eyebrow.trim()"
              class="admission-eyebrow"
            >
              {{ content.shortlist.eyebrow }}
            </p>
            <h2
              v-if="content.shortlist.title.trim()"
              id="admission-shortlist-title"
            >
              {{ content.shortlist.title }}
            </h2>
            <p
              v-for="(paragraph, index) in content.shortlist.intro.filter(
                hasText,
              )"
              :key="index"
            >
              <ContentText :value="paragraph" />
            </p>
          </div>
          <div v-if="questions.length" class="admission-checklist-card">
            <component
              :is="content.shortlist.title.trim() ? 'h3' : 'h2'"
              v-if="content.shortlist.listTitle.trim()"
              >{{ content.shortlist.listTitle }}</component
            >
            <ul class="admission-checklist" role="list">
              <li v-for="(question, index) in questions" :key="index">
                <span aria-hidden="true">✓</span>
                <span><ContentText :value="question" /></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        v-if="hasReadiness"
        class="section admission-readiness"
        :aria-labelledby="
          content.readiness.title.trim()
            ? 'admission-readiness-title'
            : undefined
        "
      >
        <div class="container">
          <div
            v-if="
              content.readiness.eyebrow.trim() ||
              content.readiness.title.trim() ||
              content.readiness.intro.some(hasText)
            "
            class="admission-section-heading"
          >
            <div
              v-if="
                content.readiness.eyebrow.trim() ||
                content.readiness.title.trim()
              "
              class="flow"
            >
              <p
                v-if="content.readiness.eyebrow.trim()"
                class="admission-eyebrow"
              >
                {{ content.readiness.eyebrow }}
              </p>
              <h2
                v-if="content.readiness.title.trim()"
                id="admission-readiness-title"
              >
                {{ content.readiness.title }}
              </h2>
            </div>
            <div
              v-if="content.readiness.intro.some(hasText)"
              class="flow admission-section-intro"
            >
              <p
                v-for="(paragraph, index) in content.readiness.intro.filter(
                  hasText,
                )"
                :key="index"
              >
                <ContentText :value="paragraph" />
              </p>
            </div>
          </div>
          <div v-if="readinessItems.length" class="admission-readiness__grid">
            <article
              v-for="(item, index) in readinessItems"
              :key="item.id || index"
              class="admission-readiness-card"
            >
              <div class="admission-readiness-card__mark" aria-hidden="true">
                ✓
              </div>
              <ContentSections
                :sections="[item]"
                :heading-level="content.readiness.title.trim() ? 3 : 2"
              />
            </article>
          </div>
        </div>
      </section>

      <section v-if="sections.length" class="section">
        <div class="container"><ContentSections :sections="sections" /></div>
      </section>

      <section v-if="hasCtaContent(content.cta)" class="section admission-next">
        <div class="container"><ContentCta :cta="content.cta" /></div>
      </section>
    </template>

    <section v-else class="section">
      <div class="container">
        <EmptyState
          title="Admission Guide"
          message="This guide is being prepared."
        />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.admission-guide-page {
  overflow: clip;
}

.admission-eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admission-eyebrow--light {
  color: var(--color-primary-100);
}

.admission-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.admission-section-heading {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}

.admission-section-heading > div {
  max-width: 46rem;
}

.admission-section-heading > p {
  max-width: 39rem;
  color: var(--color-text-secondary);
}

.admission-journey {
  background: var(--color-white);
}

.admission-journey__grid {
  display: grid;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.admission-step {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-content: start;
  align-items: start;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.admission-step__number {
  align-self: start;
  margin-top: 0.125rem;
}

.admission-step :deep(p),
.admission-shortlist__content p,
.admission-readiness-card :deep(p) {
  color: var(--color-text-secondary);
}

.admission-shortlist {
  background: var(--color-gray-50);
}

.admission-shortlist__grid {
  display: grid;
  gap: var(--space-8);
  align-items: start;
}

.admission-shortlist__content {
  max-width: 43rem;
}

.admission-checklist-card {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.admission-checklist-card h2,
.admission-checklist-card h3 {
  margin-bottom: var(--space-5);
}

.admission-checklist {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.admission-checklist li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
  align-items: start;
  color: var(--color-text-secondary);
}

.admission-checklist li > span:first-child {
  display: grid;
  width: 1.5rem;
  height: 1.5rem;
  place-items: center;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-primary-800);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.admission-readiness {
  background: var(--color-white);
}

.admission-readiness__grid {
  display: grid;
  gap: var(--space-5);
}

.admission-readiness-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.admission-readiness-card__mark {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-weight: var(--font-weight-bold);
}

.admission-next {
  padding-top: 0;
}

.admission-next__panel {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at 90% 0%, rgb(96 165 250 / 0.3), transparent 22rem),
    var(--color-primary-800);
  color: var(--color-white);
}

.admission-next__panel h2 {
  color: var(--color-white);
}

.admission-next__panel p:not(.admission-eyebrow) {
  color: var(--color-primary-100);
}

.admission-next__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-5);
}

.admission-next__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.admission-next__link:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

@include respond-to(md) {
  .admission-section-heading {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.72fr);
    align-items: end;
  }

  .admission-journey__grid,
  .admission-readiness__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admission-shortlist__grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(20rem, 1.1fr);
    gap: var(--space-12);
  }

  .admission-next__panel {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    padding: var(--space-10);
  }
}

@include respond-to(xl) {
  .admission-journey__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .admission-step {
    grid-template-columns: minmax(0, 1fr);
  }
}
.admission-section-intro {
  color: var(--color-text-secondary);
}

.admission-shortlist__content,
.admission-checklist-card {
  overflow-wrap: anywhere;
}

.admission-content-grid--single {
  grid-template-columns: minmax(0, 1fr);
}
</style>
