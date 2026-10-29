<script setup lang="ts">
import ExploreHero from "~~/app/components/explore/ExploreHero.vue";
import EmptyState from "~~/app/components/ui/EmptyState.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentCta from "~~/app/components/content/ContentCta.vue";
import { educationLoanContent as content } from "~~/app/data/content/explore/educationLoan";
import {
  hasCtaContent,
  hasSectionContent,
  hasText,
} from "~~/app/data/content/helpers";

const costs = computed(() => content.costs.items.filter(hasSectionContent));
const guidance = computed(() =>
  content.guidance.items.filter(hasSectionContent),
);
const documents = computed(() => content.documents.items.filter(hasText));
const sections = computed(() => content.sections.filter(hasSectionContent));
const hasCosts = computed(
  () => costs.value.length > 0 || content.costs.intro.some(hasText),
);
const hasGuidance = computed(
  () => guidance.value.length > 0 || content.guidance.intro.some(hasText),
);
const hasDocumentIntro = computed(
  () =>
    content.documents.title.trim() ||
    content.documents.eyebrow.trim() ||
    content.documents.intro.some(hasText) ||
    hasText(content.notice),
);
const hasDocuments = computed(
  () =>
    documents.value.length > 0 ||
    content.documents.intro.some(hasText) ||
    hasText(content.notice),
);
const hasContent = computed(
  () =>
    content.intro.some(hasText) ||
    hasCosts.value ||
    hasGuidance.value ||
    hasDocuments.value ||
    sections.value.length > 0 ||
    hasCtaContent(content.cta),
);

useSeoMeta({
  title:
    (content.ready && content.seo.title.trim()) ||
    "Education Loan | College FAQs",
  description:
    (content.ready && content.seo.description.trim()) ||
    "Education Loan | College FAQs",
  robots: () =>
    content.ready && hasContent.value ? "index, follow" : "noindex, follow",
});
</script>

<template>
  <div class="loan-page">
    <ExploreHero
      :eyebrow="content.eyebrow"
      :title="content.title.trim() || 'Education Loan'"
      :description="content.ready ? content.subtitle : undefined"
      image="/placeholders/education-loan.svg"
      image-alt=""
    >
      <template #actions>
        <div class="loan-hero-actions">
          <a
            v-if="content.ready && hasCosts"
            class="btn btn--primary btn--lg"
            href="#loan-planning"
          >
            Education Loan Guide
          </a>
          <NuxtLink class="btn btn--secondary btn--lg" to="/explore/faqs"
            >Browse FAQs</NuxtLink
          >
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
        v-if="hasCosts"
        id="loan-planning"
        class="section loan-costs"
        :aria-labelledby="
          content.costs.title.trim() ? 'loan-costs-title' : undefined
        "
      >
        <div class="container">
          <div
            v-if="
              content.costs.eyebrow.trim() ||
              content.costs.title.trim() ||
              content.costs.intro.some(hasText)
            "
            class="loan-section-heading"
          >
            <div
              v-if="content.costs.eyebrow.trim() || content.costs.title.trim()"
              class="flow"
            >
              <p v-if="content.costs.eyebrow.trim()" class="loan-eyebrow">
                {{ content.costs.eyebrow }}
              </p>
              <h2 v-if="content.costs.title.trim()" id="loan-costs-title">
                {{ content.costs.title }}
              </h2>
            </div>
            <div
              v-if="content.costs.intro.some(hasText)"
              class="flow loan-section-intro"
            >
              <p
                v-for="(paragraph, index) in content.costs.intro.filter(
                  hasText,
                )"
                :key="index"
              >
                <ContentText :value="paragraph" />
              </p>
            </div>
          </div>
          <div v-if="costs.length" class="loan-costs__grid">
            <article
              v-for="(item, index) in costs"
              :key="item.id || index"
              class="loan-cost-card"
            >
              <ContentSections
                :sections="[item]"
                :heading-level="content.costs.title.trim() ? 3 : 2"
              />
            </article>
          </div>
        </div>
      </section>

      <section
        v-if="hasGuidance"
        class="section loan-compare"
        :aria-labelledby="
          content.guidance.title.trim() ? 'loan-compare-title' : undefined
        "
      >
        <div class="container">
          <div
            v-if="
              content.guidance.eyebrow.trim() ||
              content.guidance.title.trim() ||
              content.guidance.intro.some(hasText)
            "
            class="loan-section-heading"
          >
            <div
              v-if="
                content.guidance.eyebrow.trim() || content.guidance.title.trim()
              "
              class="flow"
            >
              <p v-if="content.guidance.eyebrow.trim()" class="loan-eyebrow">
                {{ content.guidance.eyebrow }}
              </p>
              <h2 v-if="content.guidance.title.trim()" id="loan-compare-title">
                {{ content.guidance.title }}
              </h2>
            </div>
            <div
              v-if="content.guidance.intro.some(hasText)"
              class="flow loan-section-intro"
            >
              <p
                v-for="(paragraph, index) in content.guidance.intro.filter(
                  hasText,
                )"
                :key="index"
              >
                <ContentText :value="paragraph" />
              </p>
            </div>
          </div>
          <ol v-if="guidance.length" class="loan-compare__grid" role="list">
            <li
              v-for="(item, index) in guidance"
              :key="item.id || index"
              class="loan-compare-card"
            >
              <span
                class="loan-compare-card__number number-badge"
                aria-hidden="true"
              >
                {{ String(index + 1).padStart(2, "0") }}
              </span>
              <ContentSections
                :sections="[item]"
                :heading-level="content.guidance.title.trim() ? 3 : 2"
              />
            </li>
          </ol>
        </div>
      </section>

      <section
        v-if="hasDocuments"
        class="section loan-documents"
        :aria-labelledby="
          content.documents.title.trim() ? 'loan-documents-title' : undefined
        "
      >
        <div
          class="container loan-documents__grid"
          :class="{
            'loan-content-grid--single': !hasDocumentIntro || !documents.length,
          }"
        >
          <div v-if="hasDocumentIntro" class="loan-documents__content flow">
            <p v-if="content.documents.eyebrow.trim()" class="loan-eyebrow">
              {{ content.documents.eyebrow }}
            </p>
            <h2 v-if="content.documents.title.trim()" id="loan-documents-title">
              {{ content.documents.title }}
            </h2>
            <p
              v-for="(paragraph, index) in content.documents.intro.filter(
                hasText,
              )"
              :key="index"
            >
              <ContentText :value="paragraph" />
            </p>
            <p v-if="hasText(content.notice)" class="loan-disclaimer">
              <ContentText :value="content.notice" />
            </p>
          </div>
          <div v-if="documents.length" class="loan-documents__card">
            <ul class="loan-document-list" role="list">
              <li v-for="(item, index) in documents" :key="index">
                <span aria-hidden="true">✓</span>
                <span><ContentText :value="item" /></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section v-if="sections.length" class="section">
        <div class="container"><ContentSections :sections="sections" /></div>
      </section>

      <section v-if="hasCtaContent(content.cta)" class="section loan-next">
        <div class="container"><ContentCta :cta="content.cta" /></div>
      </section>
    </template>

    <div v-else class="section section--pending">
      <div class="container">
        <EmptyState
          variant="editorial"
          message="This guide is being prepared."
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.loan-page {
  overflow: clip;
}

.loan-eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loan-eyebrow--light {
  color: var(--color-gray-200);
}

.loan-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.loan-section-heading {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}

.loan-section-heading > div {
  max-width: 46rem;
}

.loan-section-heading > p {
  max-width: 40rem;
  color: var(--color-text-secondary);
}

.loan-costs {
  background: var(--color-white);
}

.loan-costs__grid {
  display: grid;
  gap: var(--space-5);
}

.loan-cost-card {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.loan-cost-card :deep(p),
.loan-compare-card :deep(p),
.loan-documents__content > p:not(.loan-eyebrow) {
  color: var(--color-text-secondary);
}

.loan-compare {
  background: var(--color-gray-50);
}

.loan-compare__grid {
  display: grid;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.loan-compare-card {
  display: grid;
  align-content: start;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
}

.loan-compare-card__number {
  align-self: start;
}

.loan-documents {
  background: var(--color-white);
}

.loan-documents__grid {
  display: grid;
  gap: var(--space-8);
  align-items: start;
}

.loan-documents__content {
  max-width: 44rem;
}

.loan-disclaimer {
  padding: var(--space-4);
  border-left: 0.25rem solid var(--color-primary-600);
  border-radius: var(--radius-sm);
  background: var(--color-primary-50);
  font-size: var(--font-size-sm);
}

.loan-documents__card {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-gray-50);
}

.loan-document-list {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.loan-document-list li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--space-3);
  align-items: start;
  color: var(--color-text-secondary);
}

.loan-document-list li > span:first-child {
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

.loan-next {
  padding-top: 0;
}

.loan-next__panel {
  --color-focus: var(--color-white);

  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  background: var(--color-surface-dark);
  color: var(--color-white);
}

.loan-next__panel h2 {
  color: var(--color-white);
}

.loan-next__panel p:not(.loan-eyebrow) {
  color: var(--color-gray-200);
}

.loan-next__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-5);
}

.loan-next__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.loan-next__link:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

@include respond-to(md) {
  .loan-section-heading {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.72fr);
    align-items: end;
  }

  .loan-costs__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .loan-compare__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .loan-documents__grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(20rem, 1.1fr);
    gap: var(--space-12);
  }

  .loan-next__panel {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    padding: var(--space-10);
  }
}

@include respond-to(lg) {
  .loan-compare__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.loan-section-intro {
  color: var(--color-text-secondary);
}

.loan-documents__content,
.loan-documents__card {
  overflow-wrap: anywhere;
}

.loan-content-grid--single {
  grid-template-columns: minmax(0, 1fr);
}
</style>
