<script setup lang="ts">
import ContentOnThisPage from "~~/app/components/content/ContentOnThisPage.vue";
import ContentEditorialDates from "~~/app/components/content/ContentEditorialDates.vue";
import ExploreHero from "~~/app/components/explore/ExploreHero.vue";
import PendingResource from "~~/app/components/content/PendingResource.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentCta from "~~/app/components/content/ContentCta.vue";
import { admissionGuideContent as content } from "~~/app/data/content/explore/admissionGuide";
import {
  getRenderableSections,
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
    content.intro.some(hasText) ||
    hasProcess.value ||
    hasShortlist.value ||
    hasReadiness.value ||
    sections.value.length > 0,
);

const navigationEntries = computed(() => [
  ...(hasProcess.value && content.process.title.trim()
    ? [{ id: "admission-journey", label: content.process.title }]
    : []),
  ...(hasShortlist.value && content.shortlist.title.trim()
    ? [{ id: "admission-shortlist-title", label: content.shortlist.title }]
    : []),
  ...(hasReadiness.value && content.readiness.title.trim()
    ? [{ id: "admission-readiness-title", label: content.readiness.title }]
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
    <PendingResource
      v-if="!content.ready || !hasContent"
      title="Admission Guide"
      message="Admission guidance is being prepared. You can still explore available programmes."
      action-to="/programs/mba"
      action-label="Explore MBA"
    />
    <template v-else>
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
          class="container admission-editorial"
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
              v-if="hasProcess"
              id="admission-journey"
              class="editorial-section admission-journey"
              :aria-labelledby="
                content.process.title.trim()
                  ? 'admission-journey-title'
                  : undefined
              "
            >
              <div>
                <div
                  v-if="
                    content.process.eyebrow.trim() ||
                    content.process.title.trim() ||
                    content.process.intro.some(hasText)
                  "
                  class="editorial-section-heading"
                >
                  <div
                    v-if="
                      content.process.eyebrow.trim() ||
                      content.process.title.trim()
                    "
                    class="flow"
                  >
                    <p
                      v-if="content.process.eyebrow.trim()"
                      class="editorial-eyebrow"
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
                <ol v-if="steps.length" class="editorial-steps" role="list">
                  <li
                    v-for="(step, index) in steps"
                    :key="step.id || index"
                    class="editorial-step"
                  >
                    <span class="editorial-number" aria-hidden="true">
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
              class="editorial-section admission-shortlist"
              :aria-labelledby="
                hasShortlistIntro && content.shortlist.title.trim()
                  ? 'admission-shortlist-title'
                  : undefined
              "
            >
              <div
                class="admission-shortlist__grid"
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
                    class="editorial-eyebrow"
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
                <div v-if="questions.length" class="editorial-card">
                  <component
                    :is="content.shortlist.title.trim() ? 'h3' : 'h2'"
                    v-if="content.shortlist.listTitle.trim()"
                    >{{ content.shortlist.listTitle }}</component
                  >
                  <ul class="editorial-checklist" role="list">
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
              class="editorial-section admission-readiness"
              :aria-labelledby="
                content.readiness.title.trim()
                  ? 'admission-readiness-title'
                  : undefined
              "
            >
              <div>
                <div
                  v-if="
                    content.readiness.eyebrow.trim() ||
                    content.readiness.title.trim() ||
                    content.readiness.intro.some(hasText)
                  "
                  class="editorial-section-heading"
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
                      class="editorial-eyebrow"
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
                      v-for="(
                        paragraph, index
                      ) in content.readiness.intro.filter(hasText)"
                      :key="index"
                    >
                      <ContentText :value="paragraph" />
                    </p>
                  </div>
                </div>
                <div v-if="readinessItems.length" class="editorial-card-grid">
                  <article
                    v-for="(item, index) in readinessItems"
                    :key="item.id || index"
                    class="editorial-card editorial-card--icon"
                  >
                    <div class="editorial-card__mark" aria-hidden="true">✓</div>
                    <ContentSections
                      :sections="[item]"
                      :heading-level="content.readiness.title.trim() ? 3 : 2"
                    />
                  </article>
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

        <section
          v-if="hasCtaContent(content.cta)"
          class="section admission-next"
        >
          <div class="container"><ContentCta :cta="content.cta" /></div>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.admission-guide-page {
  overflow: clip;
}

.admission-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.admission-shortlist__grid {
  display: grid;
  align-items: start;
  gap: var(--space-6);
}

.admission-editorial {
  @include editorial-layout;
  padding-top: var(--space-8);
}
</style>
