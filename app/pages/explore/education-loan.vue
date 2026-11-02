<script setup lang="ts">
import ContentOnThisPage from "~~/app/components/content/ContentOnThisPage.vue";
import ContentEditorialDates from "~~/app/components/content/ContentEditorialDates.vue";
import ExploreHero from "~~/app/components/explore/ExploreHero.vue";
import PendingResource from "~~/app/components/content/PendingResource.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentCta from "~~/app/components/content/ContentCta.vue";
import { educationLoanContent as content } from "~~/app/data/content/explore/educationLoan";
import {
  getRenderableSections,
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
    sections.value.length > 0,
);

const navigationEntries = computed(() => [
  ...(hasCosts.value && content.costs.title.trim()
    ? [{ id: "loan-planning", label: content.costs.title }]
    : []),
  ...(hasGuidance.value && content.guidance.title.trim()
    ? [{ id: "loan-compare-title", label: content.guidance.title }]
    : []),
  ...(hasDocuments.value && content.documents.title.trim()
    ? [{ id: "loan-documents-title", label: content.documents.title }]
    : []),
  ...getRenderableSections(sections.value).flatMap((entry) =>
    entry.anchorId && entry.section.title?.trim()
      ? [{ id: entry.anchorId, label: entry.section.title }]
      : [],
  ),
]);

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
    <PendingResource
      v-if="!content.ready || !hasContent"
      title="Education Loan"
      message="Education loan information is being prepared. Explore available programmes while we complete this resource."
      action-to="/programs/engineering"
      action-label="Explore Engineering"
    />
    <template v-else>
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
        <template #metadata>
          <ContentEditorialDates
            :published-at="content.publishedAt"
            :last-updated="content.lastUpdated"
            :effective-at="content.effectiveAt"
          />
        </template>
      </ExploreHero>

      <template v-if="content.ready && hasContent">
        <div
          class="container loan-editorial"
          :class="{
            'editorial-layout--with-nav': navigationEntries.length > 1,
          }"
        >
          <ContentOnThisPage :entries="navigationEntries" />
          <div class="editorial-layout__body editorial-prose">
            <section
              v-if="content.intro.some(hasText)"
              class="editorial-section"
            >
              <div class="flow">
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
              class="editorial-section loan-costs"
              :aria-labelledby="
                content.costs.title.trim() ? 'loan-costs-title' : undefined
              "
            >
              <div>
                <div
                  v-if="
                    content.costs.eyebrow.trim() ||
                    content.costs.title.trim() ||
                    content.costs.intro.some(hasText)
                  "
                  class="editorial-section-heading"
                >
                  <div
                    v-if="
                      content.costs.eyebrow.trim() || content.costs.title.trim()
                    "
                    class="flow"
                  >
                    <p
                      v-if="content.costs.eyebrow.trim()"
                      class="editorial-eyebrow"
                    >
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
                <div v-if="costs.length" class="editorial-card-grid">
                  <article
                    v-for="(item, index) in costs"
                    :key="item.id || index"
                    class="editorial-card"
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
              class="editorial-section loan-compare"
              :aria-labelledby="
                content.guidance.title.trim() ? 'loan-compare-title' : undefined
              "
            >
              <div>
                <div
                  v-if="
                    content.guidance.eyebrow.trim() ||
                    content.guidance.title.trim() ||
                    content.guidance.intro.some(hasText)
                  "
                  class="editorial-section-heading"
                >
                  <div
                    v-if="
                      content.guidance.eyebrow.trim() ||
                      content.guidance.title.trim()
                    "
                    class="flow"
                  >
                    <p
                      v-if="content.guidance.eyebrow.trim()"
                      class="editorial-eyebrow"
                    >
                      {{ content.guidance.eyebrow }}
                    </p>
                    <h2
                      v-if="content.guidance.title.trim()"
                      id="loan-compare-title"
                    >
                      {{ content.guidance.title }}
                    </h2>
                  </div>
                  <div
                    v-if="content.guidance.intro.some(hasText)"
                    class="flow loan-section-intro"
                  >
                    <p
                      v-for="(
                        paragraph, index
                      ) in content.guidance.intro.filter(hasText)"
                      :key="index"
                    >
                      <ContentText :value="paragraph" />
                    </p>
                  </div>
                </div>
                <ol
                  v-if="guidance.length"
                  class="editorial-card-grid"
                  role="list"
                >
                  <li
                    v-for="(item, index) in guidance"
                    :key="item.id || index"
                    class="editorial-card"
                  >
                    <span class="editorial-number" aria-hidden="true">
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
              class="editorial-section loan-documents"
              :aria-labelledby="
                content.documents.title.trim()
                  ? 'loan-documents-title'
                  : undefined
              "
            >
              <div
                class="loan-documents__grid"
                :class="{
                  'loan-content-grid--single':
                    !hasDocumentIntro || !documents.length,
                }"
              >
                <div
                  v-if="hasDocumentIntro"
                  class="loan-documents__content flow"
                >
                  <p
                    v-if="content.documents.eyebrow.trim()"
                    class="editorial-eyebrow"
                  >
                    {{ content.documents.eyebrow }}
                  </p>
                  <h2
                    v-if="content.documents.title.trim()"
                    id="loan-documents-title"
                  >
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
                  <p v-if="hasText(content.notice)" class="editorial-note">
                    <ContentText :value="content.notice" />
                  </p>
                </div>
                <div v-if="documents.length" class="editorial-card">
                  <ul class="editorial-checklist" role="list">
                    <li v-for="(item, index) in documents" :key="index">
                      <span aria-hidden="true">✓</span>
                      <span><ContentText :value="item" /></span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section v-if="sections.length" class="editorial-section">
              <div>
                <ContentSections :sections="sections" />
              </div>
            </section>
          </div>
        </div>

        <section v-if="hasCtaContent(content.cta)" class="section loan-next">
          <div class="container"><ContentCta :cta="content.cta" /></div>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.loan-page {
  overflow: clip;
}

.loan-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.loan-documents__grid {
  display: grid;
  align-items: start;
  gap: var(--space-6);
}

.loan-editorial {
  @include editorial-layout;
  padding-top: var(--space-8);
}
</style>
