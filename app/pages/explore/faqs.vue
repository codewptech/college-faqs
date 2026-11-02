<script setup lang="ts">
import ContentOnThisPage from "~~/app/components/content/ContentOnThisPage.vue";
import ContentEditorialDates from "~~/app/components/content/ContentEditorialDates.vue";
import ExploreHero from "~~/app/components/explore/ExploreHero.vue";
import PendingResource from "~~/app/components/content/PendingResource.vue";
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentCta from "~~/app/components/content/ContentCta.vue";
import { faqContent as content } from "~~/app/data/content/explore/faqs";
import {
  hasCtaContent,
  hasSectionContent,
  hasText,
} from "~~/app/data/content/helpers";

const faqGroups = computed(() =>
  [{ id: "questions", title: "", items: content.items }, ...content.groups]
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.question.trim() && hasSectionContent({ blocks: item.answer }),
      ),
    }))
    .filter((group) => group.items.length > 0),
);
const navigationEntries = computed(() =>
  faqGroups.value.flatMap((group) =>
    group.id && /^[A-Za-z][A-Za-z0-9_-]*$/.test(group.id)
      ? [{ id: group.id, label: group.title.trim() || "General questions" }]
      : [],
  ),
);
const hasIntro = computed(
  () => content.introTitle.trim() || content.intro.some(hasText),
);
const hasContent = computed(
  () => content.intro.some(hasText) || faqGroups.value.length > 0,
);

useSeoMeta({
  title: (content.ready && content.seo.title.trim()) || "FAQs | College FAQs",
  description:
    (content.ready && content.seo.description.trim()) || "FAQs | College FAQs",
  robots: () =>
    content.ready && hasContent.value ? "index, follow" : "noindex, follow",
});
</script>

<template>
  <div class="faq-page">
    <PendingResource
      v-if="!content.ready || !hasContent"
      title="FAQs"
      message="Answers to common admission questions are being prepared. You can explore programmes or connect with a mentor."
      action-to="/programs/mba/talk-to-mentor"
      action-label="Talk to Mentor"
    />
    <template v-else>
      <ExploreHero
        :eyebrow="content.eyebrow"
        :title="content.title.trim() || 'FAQs'"
        :description="content.ready ? content.subtitle : undefined"
        image="/placeholders/faqs.svg"
        image-alt=""
      >
        <template #actions>
          <div class="faq-hero-actions">
            <a
              v-if="content.ready && faqGroups.length"
              class="btn btn--primary btn--lg"
              href="#faq-list"
            >
              Browse questions
            </a>
            <NuxtLink
              class="btn btn--secondary btn--lg"
              to="/explore/admission-guide"
              >Admission Guide</NuxtLink
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
        <section
          v-if="faqGroups.length || content.intro.some(hasText)"
          id="faq-list"
          class="section section--editorial-opening faq-content"
          :aria-labelledby="
            content.introTitle.trim() ? 'faq-content-title' : undefined
          "
        >
          <div
            class="container faq-content__layout"
            :class="{
              'editorial-layout--with-nav': navigationEntries.length > 1,
            }"
          >
            <ContentOnThisPage :entries="navigationEntries" />
            <div class="editorial-layout__body editorial-prose">
              <div v-if="hasIntro" class="faq-content__intro flow">
                <h2 v-if="content.introTitle.trim()" id="faq-content-title">
                  {{ content.introTitle }}
                </h2>
                <p
                  v-for="(paragraph, index) in content.intro.filter(hasText)"
                  :key="index"
                >
                  <ContentText :value="paragraph" />
                </p>
              </div>
              <div v-if="faqGroups.length" class="faq-groups">
                <section
                  v-for="(group, groupIndex) in faqGroups"
                  :key="group.id || groupIndex"
                  :id="group.id"
                  class="faq-group"
                  :aria-labelledby="
                    group.title?.trim() ? `faq-group-${groupIndex}` : undefined
                  "
                >
                  <component
                    :is="content.introTitle.trim() ? 'h3' : 'h2'"
                    v-if="group.title?.trim()"
                    :id="`faq-group-${groupIndex}`"
                  >
                    {{ group.title }}
                  </component>
                  <div class="faq-group__items">
                    <details
                      v-for="(item, itemIndex) in group.items"
                      :key="itemIndex"
                      class="faq-item"
                    >
                      <summary>
                        <span>{{ item.question }}</span>
                        <span class="faq-item__icon" aria-hidden="true">+</span>
                      </summary>
                      <div class="faq-item__answer">
                        <ContentSections
                          :sections="[{ blocks: item.answer }]"
                          :heading-level="
                            group.title?.trim() && content.introTitle.trim()
                              ? 4
                              : group.title?.trim() || content.introTitle.trim()
                                ? 3
                                : 2
                          "
                        />
                      </div>
                    </details>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section v-if="hasCtaContent(content.cta)" class="section faq-next">
          <div class="container"><ContentCta :cta="content.cta" /></div>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.faq-page {
  overflow: clip;
}

.faq-eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.faq-eyebrow--light {
  color: var(--color-gray-200);
}

.faq-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.faq-content {
  background: var(--color-white);
}

.faq-content__layout {
  @include editorial-layout;
}

.faq-content__intro {
  max-width: 39rem;
}

.faq-content__intro > p:last-child {
  color: var(--color-text-secondary);
}

.faq-groups {
  display: grid;
  gap: var(--space-10);
}

.faq-group > h2,
.faq-group > h3 {
  margin-bottom: var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.faq-group__items {
  display: grid;
  gap: var(--space-3);
}

.faq-item {
  overflow: clip;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
}

.faq-item summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-5);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  list-style: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary:focus-visible {
  outline: 0.1875rem solid var(--color-focus);
  outline-offset: -0.1875rem;
}

.faq-item__icon {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 50%;
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-size: var(--font-size-xl);
  line-height: 1;
  transition: transform var(--duration-fast) var(--ease-standard);
}

.faq-item[open] .faq-item__icon {
  transform: rotate(45deg);
}

.faq-item__answer {
  padding: 0 var(--space-5) var(--space-5);
}

.faq-item__answer :deep(p) {
  max-width: 52rem;
  color: var(--color-text-secondary);
}

.faq-content__intro,
.faq-item summary {
  overflow-wrap: anywhere;
}
</style>
