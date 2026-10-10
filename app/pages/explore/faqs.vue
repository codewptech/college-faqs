<script setup lang="ts">
import ExploreHero from '~~/app/components/explore/ExploreHero.vue'
import EmptyState from '~~/app/components/ui/EmptyState.vue'
import ContentText from '~~/app/components/content/ContentText.vue'
import ContentSections from '~~/app/components/content/ContentSections.vue'
import ContentCta from '~~/app/components/content/ContentCta.vue'
import { faqContent as content } from '~~/app/data/content/explore/faqs'
import { hasCtaContent, hasSectionContent, hasText } from '~~/app/data/content/helpers'

const faqGroups = computed(() => [
  { id: 'questions', title: '', items: content.items },
  ...content.groups,
].map(group => ({
  ...group,
  items: group.items.filter(item => item.question.trim() && hasSectionContent({ blocks: item.answer })),
})).filter(group => group.items.length > 0))
const hasIntro = computed(() => content.introTitle.trim() || content.intro.some(hasText))
const hasContent = computed(() => hasText(content.subtitle) || content.intro.some(hasText) || faqGroups.value.length > 0 || hasCtaContent(content.cta))

useSeoMeta({
  title: (content.ready && content.seo.title.trim()) || 'FAQs | College FAQs',
  description: (content.ready && content.seo.description.trim()) || 'FAQs | College FAQs',
  robots: () => content.ready && hasContent.value ? 'index, follow' : 'noindex, follow',
})
</script>

<template>
  <div class="faq-page">
    <ExploreHero
      :eyebrow="content.eyebrow"
      :title="content.title.trim() || 'FAQs'"
      :description="content.ready ? content.subtitle : undefined"
      image="/placeholders/faqs.svg"
      image-alt=""
    >
      <template #actions>
        <div class="faq-hero-actions">
          <a v-if="content.ready && faqGroups.length" class="btn btn--primary btn--lg" href="#faq-list">
            Browse questions
          </a>
          <NuxtLink class="btn btn--secondary btn--lg" to="/explore/admission-guide">Admission Guide</NuxtLink>
        </div>
      </template>
    </ExploreHero>

    <template v-if="content.ready && hasContent">
      <section
        v-if="faqGroups.length || content.intro.some(hasText)"
        id="faq-list"
        class="section faq-content"
        :aria-labelledby="content.introTitle.trim() ? 'faq-content-title' : undefined"
      >
        <div class="container faq-content__layout" :class="{ 'faq-content__layout--single': !hasIntro || !faqGroups.length }">
          <div v-if="hasIntro" class="faq-content__intro flow">
            <h2 v-if="content.introTitle.trim()" id="faq-content-title">{{ content.introTitle }}</h2>
            <p v-for="(paragraph, index) in content.intro.filter(hasText)" :key="index">
              <ContentText :value="paragraph" />
            </p>
          </div>
          <div v-if="faqGroups.length" class="faq-groups">
            <section
              v-for="(group, groupIndex) in faqGroups"
              :key="group.id || groupIndex"
              class="faq-group"
              :aria-labelledby="group.title?.trim() ? `faq-group-${groupIndex}` : undefined"
            >
              <component :is="content.introTitle.trim() ? 'h3' : 'h2'" v-if="group.title?.trim()" :id="`faq-group-${groupIndex}`">
                {{ group.title }}
              </component>
              <div class="faq-group__items">
                <details v-for="(item, itemIndex) in group.items" :key="itemIndex" class="faq-item">
                  <summary>
                    <span>{{ item.question }}</span>
                    <span class="faq-item__icon" aria-hidden="true">+</span>
                  </summary>
                  <div class="faq-item__answer">
                    <ContentSections :sections="[{ blocks: item.answer }]" :heading-level="group.title?.trim() && content.introTitle.trim() ? 4 : group.title?.trim() || content.introTitle.trim() ? 3 : 2" />
                  </div>
                </details>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section v-if="hasCtaContent(content.cta)" class="section faq-next">
        <div class="container"><ContentCta :cta="content.cta" /></div>
      </section>
    </template>

    <section v-else class="section">
      <div class="container"><EmptyState title="FAQs" message="FAQs are being prepared." /></div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '~~/app/assets/scss/abstracts/mixins' as *;

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
  color: var(--color-primary-100);
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
  display: grid;
  gap: var(--space-10);
  align-items: start;
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

.faq-next {
  padding-top: 0;
}

.faq-next__panel {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(
      circle at 90% 0%,
      rgb(96 165 250 / 0.3),
      transparent 22rem
    ),
    var(--color-primary-800);
  color: var(--color-white);
}

.faq-next__panel h2 {
  color: var(--color-white);
}

.faq-next__panel p:not(.faq-eyebrow) {
  color: var(--color-primary-100);
}

.faq-next__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-5);
}

.faq-next__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.faq-next__link:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

@include respond-to(md) {
  .faq-content__layout {
    grid-template-columns: minmax(0, 0.65fr) minmax(0, 1.35fr);
    gap: var(--space-12);
  }

  .faq-content__intro {
    position: sticky;
    top: calc(var(--header-height) + var(--space-6));
  }

  .faq-next__panel {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    padding: var(--space-10);
  }
}
.faq-content__layout--single {
  grid-template-columns: minmax(0, 1fr);
}

.faq-content__layout--single .faq-content__intro {
  position: static;
}

.faq-content__intro,
.faq-item summary {
  overflow-wrap: anywhere;
}
</style>
