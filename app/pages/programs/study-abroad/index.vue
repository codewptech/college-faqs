<script setup lang="ts">
import SuccessDialog from "~~/app/components/ui/SuccessDialog.vue";
import FormDisclosure from "~~/app/components/ui/FormDisclosure.vue";
import { useFormPreview } from "~~/app/composables/useFormPreview";
import {
  studyDestinations as destinations,
  type StudyDestination,
} from "~~/app/data/studyDestinations";
import ContentText from "~~/app/components/content/ContentText.vue";
import ContentSections from "~~/app/components/content/ContentSections.vue";
import ContentCta from "~~/app/components/content/ContentCta.vue";
import { studyAbroadContent as content } from "~~/app/data/content/studyAbroad";
import {
  hasCtaContent,
  hasSectionContent,
  hasText,
} from "~~/app/data/content/helpers";

const supportAreas = computed(() =>
  content.ready
    ? content.support.items.filter(
        (item) => item.title.trim() || hasText(item.description),
      )
    : [],
);
const guideSections = computed(
  () => content.ready && content.sections.some(hasSectionContent),
);

const hasPublishedContent = computed(
  () =>
    content.ready &&
    Boolean(
      content.hero.intro.some(hasText) ||
      hasText(content.hero.note) ||
      supportAreas.value.length ||
      content.destinations.intro.some(hasText) ||
      content.guides.intro.some(hasText) ||
      content.sections.some(hasSectionContent) ||
      content.profile.intro.some(hasText) ||
      content.profile.checklist.some(hasText) ||
      content.mentor.intro.some(hasText) ||
      hasCtaContent(content.cta),
    ),
);

useSeoMeta({
  title: () =>
    content.ready && content.seo.title.trim()
      ? content.seo.title
      : "Study Abroad | College FAQs",
  description: () =>
    content.ready && content.seo.description.trim()
      ? content.seo.description
      : "Study Abroad | College FAQs",
  robots: () =>
    hasPublishedContent.value ? "index, follow" : "noindex, follow",
});

const selectedDestination = ref(destinations[0]!);
const considerations = computed(
  () =>
    selectedDestination.value.considerations?.filter((item) => item.trim()) ??
    [],
);
const profileDialogOpen = ref(false);
const mentorDialogOpen = ref(false);
const {
  formRef: profileForm,
  errors: profileErrors,
  validate: validateProfile,
  clearError: clearProfileError,
} = useFormPreview();
const {
  formRef: mentorForm,
  errors: mentorErrors,
  validate: validateMentor,
  clearError: clearMentorError,
} = useFormPreview();

function selectDestination(destination: StudyDestination) {
  selectedDestination.value = destination;
}

function submitProfilePreview() {
  if (validateProfile()) profileDialogOpen.value = true;
}

function submitMentorPreview() {
  if (validateMentor()) mentorDialogOpen.value = true;
}
</script>

<template>
  <div class="study-abroad-page">
    <section class="study-hero section">
      <div class="container study-hero__grid">
        <div class="study-hero__content flow">
          <p class="study-eyebrow">
            {{
              content.ready && content.hero.eyebrow.trim()
                ? content.hero.eyebrow
                : "Study Abroad"
            }}
          </p>

          <h1>
            {{
              content.ready && content.hero.title.trim()
                ? content.hero.title
                : "Study Abroad"
            }}
          </h1>

          <template v-if="content.ready">
            <p
              v-for="(paragraph, index) in content.hero.intro.filter(hasText)"
              :key="index"
              class="study-hero__lead"
            >
              <ContentText :value="paragraph" />
            </p>
          </template>

          <div class="study-hero__actions">
            <a class="btn btn--primary btn--lg" href="#profile-evaluation">
              Free profile evaluation
            </a>

            <a class="btn btn--secondary btn--lg" href="#talk-to-mentor">
              Talk to a mentor
            </a>
          </div>

          <p
            v-if="content.ready && hasText(content.hero.note)"
            class="study-hero__note"
          >
            <ContentText :value="content.hero.note" />
          </p>
        </div>

        <div class="study-hero__visual" aria-hidden="true">
          <img
            src="/placeholders/study-abroad-guidance.svg"
            alt=""
            width="760"
            height="600"
          />
        </div>
      </div>
    </section>

    <section
      v-if="supportAreas.length"
      class="section section--compact study-support"
      :aria-labelledby="
        content.support.title.trim() ? 'study-support-title' : undefined
      "
    >
      <div class="container">
        <div
          v-if="
            content.support.eyebrow.trim() ||
            content.support.title.trim() ||
            content.support.intro.some(hasText)
          "
          class="study-section-heading study-section-heading--compact"
        >
          <div
            v-if="
              content.support.eyebrow.trim() || content.support.title.trim()
            "
            class="flow"
          >
            <p v-if="content.support.eyebrow.trim()" class="study-eyebrow">
              {{ content.support.eyebrow }}
            </p>
            <h2 v-if="content.support.title.trim()" id="study-support-title">
              {{ content.support.title }}
            </h2>
          </div>
          <div v-if="content.support.intro.some(hasText)" class="flow">
            <p
              v-for="(paragraph, index) in content.support.intro.filter(
                hasText,
              )"
              :key="index"
            >
              <ContentText :value="paragraph" />
            </p>
          </div>
        </div>

        <div class="study-support__grid">
          <article
            v-for="(area, index) in supportAreas"
            :key="index"
            class="study-support-card"
          >
            <span
              class="study-support-card__icon number-badge"
              aria-hidden="true"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <div class="flow">
              <component
                :is="content.support.title.trim() ? 'h3' : 'h2'"
                v-if="area.title.trim()"
                >{{ area.title }}</component
              >
              <p v-if="hasText(area.description)">
                <ContentText :value="area.description" />
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section
      class="section study-destinations"
      aria-labelledby="study-destinations-title"
    >
      <div class="container">
        <div class="study-section-heading">
          <div class="flow">
            <p
              v-if="content.ready && content.destinations.eyebrow.trim()"
              class="study-eyebrow"
            >
              {{ content.destinations.eyebrow }}
            </p>
            <h2 id="study-destinations-title">
              {{
                content.ready && content.destinations.title.trim()
                  ? content.destinations.title
                  : "Destinations"
              }}
            </h2>
          </div>
          <div
            v-if="content.ready && content.destinations.intro.some(hasText)"
            class="flow"
          >
            <p
              v-for="(paragraph, index) in content.destinations.intro.filter(
                hasText,
              )"
              :key="index"
            >
              <ContentText :value="paragraph" />
            </p>
          </div>
        </div>

        <div
          class="study-destinations__tabs"
          role="group"
          aria-label="Study destinations"
        >
          <button
            v-for="destination in destinations"
            :key="destination.id"
            class="study-destination-tab"
            :class="{
              'study-destination-tab--active':
                selectedDestination.id === destination.id,
            }"
            type="button"
            :aria-pressed="selectedDestination.id === destination.id"
            aria-controls="study-destination-panel"
            @click="selectDestination(destination)"
          >
            {{ destination.shortName }}
          </button>
        </div>

        <div
          id="study-destination-panel"
          class="study-destination-panel"
          :class="{ 'study-destination-panel--single': !considerations.length }"
          role="region"
          aria-labelledby="study-selected-destination-title"
        >
          <div class="study-destination-panel__content flow">
            <p class="study-eyebrow">{{ selectedDestination.name }}</p>
            <h3 id="study-selected-destination-title">
              {{ selectedDestination.shortName }} Study Guide
            </h3>
            <p v-if="selectedDestination.description?.trim()">
              {{ selectedDestination.description }}
            </p>
            <NuxtLink :to="`/programs/study-abroad/${selectedDestination.id}`">
              View the {{ selectedDestination.shortName }} guide
            </NuxtLink>
          </div>

          <ul v-if="considerations.length" class="study-checklist" role="list">
            <li v-for="item in considerations" :key="item">
              <span aria-hidden="true">✓</span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section study-guides" aria-labelledby="study-guides-title">
      <div class="container">
        <div class="study-section-heading">
          <div class="flow">
            <p
              v-if="content.ready && content.guides.eyebrow.trim()"
              class="study-eyebrow"
            >
              {{ content.guides.eyebrow }}
            </p>
            <h2 id="study-guides-title">
              {{
                content.ready && content.guides.title.trim()
                  ? content.guides.title
                  : "Destination guides"
              }}
            </h2>
          </div>
          <div
            v-if="content.ready && content.guides.intro.some(hasText)"
            class="flow"
          >
            <p
              v-for="(paragraph, index) in content.guides.intro.filter(hasText)"
              :key="index"
            >
              <ContentText :value="paragraph" />
            </p>
          </div>
        </div>

        <p id="study-guides-scroll-note" class="study-guides__hint">
          On smaller screens, scroll to explore all nine destinations.
        </p>
        <div
          class="study-guides__scroller"
          role="region"
          aria-label="Destination guides"
          aria-describedby="study-guides-scroll-note"
          tabindex="0"
        >
          <ul class="study-guides__grid" role="list">
            <li v-for="destination in destinations" :key="destination.id">
              <NuxtLink
                class="study-guide-card"
                :to="`/programs/study-abroad/${destination.id}`"
              >
                <img
                  src="/placeholders/study-destination-guide.svg"
                  alt=""
                  width="640"
                  height="360"
                  loading="lazy"
                />
                <div class="study-guide-card__content flow">
                  <h3>{{ destination.shortName }}</h3>
                  <p v-if="destination.description?.trim()">
                    {{ destination.description }}
                  </p>
                  <span class="study-guide-card__link"
                    >Explore guide <span aria-hidden="true">→</span></span
                  >
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section
      v-if="guideSections || (content.ready && hasCtaContent(content.cta))"
      class="section"
    >
      <div class="container flow">
        <ContentSections v-if="guideSections" :sections="content.sections" />
        <ContentCta
          v-if="content.ready && hasCtaContent(content.cta)"
          :cta="content.cta!"
        />
      </div>
    </section>

    <section
      id="profile-evaluation"
      class="section study-profile"
      aria-labelledby="profile-evaluation-title"
    >
      <div class="container study-profile__grid">
        <div class="study-profile__intro flow">
          <p
            v-if="content.ready && content.profile.eyebrow.trim()"
            class="study-eyebrow"
          >
            {{ content.profile.eyebrow }}
          </p>
          <h2 id="profile-evaluation-title">
            {{
              content.ready && content.profile.title.trim()
                ? content.profile.title
                : "Free profile evaluation"
            }}
          </h2>
          <template v-if="content.ready">
            <p
              v-for="(paragraph, index) in content.profile.intro.filter(
                hasText,
              )"
              :key="index"
            >
              <ContentText :value="paragraph" />
            </p>
            <ul
              v-if="content.profile.checklist.some(hasText)"
              class="study-checklist"
              role="list"
            >
              <li
                v-for="(item, index) in content.profile.checklist.filter(
                  hasText,
                )"
                :key="index"
              >
                <span aria-hidden="true">✓</span>
                <ContentText :value="item" />
              </li>
            </ul>
          </template>
        </div>

        <div class="study-form-panel">
          <form
            ref="profileForm"
            class="study-form-grid"
            novalidate
            @submit.prevent="submitProfilePreview"
            @input="clearProfileError"
            @change="clearProfileError"
          >
            <FormDisclosure />
            <div class="study-form-row study-form-row--2">
              <div class="form-field">
                <label class="form-label" for="profile-name">
                  Full name
                  <span class="form-label__required">*</span>
                </label>
                <input
                  id="profile-name"
                  class="form-control"
                  name="name"
                  type="text"
                  autocomplete="name"
                  :aria-invalid="Boolean(profileErrors['profile-name'])"
                  :aria-describedby="
                    profileErrors['profile-name']
                      ? 'profile-name-error'
                      : undefined
                  "
                  required
                  placeholder="Your name"
                />
                <p
                  v-if="profileErrors['profile-name']"
                  id="profile-name-error"
                  class="form-error"
                >
                  {{ profileErrors["profile-name"] }}
                </p>
              </div>

              <div class="form-field">
                <label class="form-label" for="profile-phone">
                  Phone number
                  <span class="form-label__required">*</span>
                </label>
                <input
                  id="profile-phone"
                  class="form-control"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  :aria-invalid="Boolean(profileErrors['profile-phone'])"
                  :aria-describedby="
                    profileErrors['profile-phone']
                      ? 'profile-phone-error'
                      : undefined
                  "
                  required
                  placeholder="Your phone number"
                />
                <p
                  v-if="profileErrors['profile-phone']"
                  id="profile-phone-error"
                  class="form-error"
                >
                  {{ profileErrors["profile-phone"] }}
                </p>
              </div>
            </div>

            <div class="study-form-row study-form-row--2">
              <div class="form-field">
                <label class="form-label" for="profile-email"> Email </label>
                <input
                  id="profile-email"
                  class="form-control"
                  name="email"
                  type="email"
                  autocomplete="email"
                  :aria-invalid="Boolean(profileErrors['profile-email'])"
                  :aria-describedby="
                    profileErrors['profile-email']
                      ? 'profile-email-error'
                      : undefined
                  "
                  placeholder="you@example.com"
                />
                <p
                  v-if="profileErrors['profile-email']"
                  id="profile-email-error"
                  class="form-error"
                >
                  {{ profileErrors["profile-email"] }}
                </p>
              </div>

              <div class="form-field">
                <label class="form-label" for="profile-qualification">
                  Current qualification
                  <span class="form-label__required">*</span>
                </label>
                <input
                  id="profile-qualification"
                  class="form-control"
                  name="qualification"
                  type="text"
                  :aria-invalid="
                    Boolean(profileErrors['profile-qualification'])
                  "
                  :aria-describedby="
                    profileErrors['profile-qualification']
                      ? 'profile-qualification-error'
                      : undefined
                  "
                  required
                  placeholder="e.g. B.Tech, B.Com, Class 12"
                />
                <p
                  v-if="profileErrors['profile-qualification']"
                  id="profile-qualification-error"
                  class="form-error"
                >
                  {{ profileErrors["profile-qualification"] }}
                </p>
              </div>
            </div>

            <div class="study-form-row study-form-row--2">
              <div class="form-field">
                <label class="form-label" for="profile-level">
                  Intended study level
                </label>
                <select
                  id="profile-level"
                  class="form-control"
                  name="studyLevel"
                >
                  <option value="">Choose a level</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="mba">MBA / Management</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-field">
                <label class="form-label" for="profile-destination">
                  Preferred destination
                </label>
                <select
                  id="profile-destination"
                  class="form-control"
                  name="destination"
                >
                  <option value="">Not decided yet</option>
                  <option
                    v-for="destination in destinations"
                    :key="destination.id"
                    :value="destination.id"
                  >
                    {{ destination.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="study-form-row study-form-row--2">
              <div class="form-field">
                <label class="form-label" for="profile-course">
                  Course or subject of interest
                </label>
                <input
                  id="profile-course"
                  class="form-control"
                  name="course"
                  type="text"
                  placeholder="e.g. Data Science, Finance, Engineering"
                />
              </div>

              <div class="form-field">
                <label class="form-label" for="profile-intake">
                  Preferred intake
                </label>
                <input
                  id="profile-intake"
                  class="form-control"
                  name="intake"
                  type="text"
                  placeholder="e.g. Fall 2027"
                />
              </div>
            </div>

            <div class="form-field">
              <label class="form-label" for="profile-message">
                Anything else we should know?
              </label>
              <textarea
                id="profile-message"
                class="form-control"
                name="message"
                rows="5"
                placeholder="Tell us about your goals, budget, preferred locations, or questions."
              />
            </div>

            <div class="form-actions">
              <button class="btn btn--primary btn--lg" type="submit">
                Submit for evaluation
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <section
      id="talk-to-mentor"
      class="section study-mentor"
      aria-labelledby="study-mentor-title"
    >
      <div class="container study-mentor__panel">
        <div class="study-mentor__content flow">
          <p
            v-if="content.ready && content.mentor.eyebrow.trim()"
            class="study-eyebrow study-eyebrow--light"
          >
            {{ content.mentor.eyebrow }}
          </p>
          <h2 id="study-mentor-title">
            {{
              content.ready && content.mentor.title.trim()
                ? content.mentor.title
                : "Talk to a mentor"
            }}
          </h2>
          <template v-if="content.ready">
            <p
              v-for="(paragraph, index) in content.mentor.intro.filter(hasText)"
              :key="index"
            >
              <ContentText :value="paragraph" />
            </p>
          </template>
        </div>

        <div class="study-mentor__form-wrap">
          <form
            ref="mentorForm"
            class="study-mentor__form"
            novalidate
            @submit.prevent="submitMentorPreview"
            @input="clearMentorError"
            @change="clearMentorError"
          >
            <FormDisclosure />
            <div class="form-field">
              <label
                class="form-label study-mentor__label"
                for="study-mentor-name"
              >
                Name
                <span class="form-label__required">*</span>
              </label>
              <input
                id="study-mentor-name"
                class="form-control"
                name="name"
                type="text"
                autocomplete="name"
                :aria-invalid="Boolean(mentorErrors['study-mentor-name'])"
                :aria-describedby="
                  mentorErrors['study-mentor-name']
                    ? 'study-mentor-name-error'
                    : undefined
                "
                required
                placeholder="Your name"
              />
              <p
                v-if="mentorErrors['study-mentor-name']"
                id="study-mentor-name-error"
                class="form-error"
              >
                {{ mentorErrors["study-mentor-name"] }}
              </p>
            </div>

            <div class="form-field">
              <label
                class="form-label study-mentor__label"
                for="study-mentor-phone"
              >
                Phone number
                <span class="form-label__required">*</span>
              </label>
              <input
                id="study-mentor-phone"
                class="form-control"
                name="phone"
                type="tel"
                autocomplete="tel"
                :aria-invalid="Boolean(mentorErrors['study-mentor-phone'])"
                :aria-describedby="
                  mentorErrors['study-mentor-phone']
                    ? 'study-mentor-phone-error'
                    : undefined
                "
                required
                placeholder="Your phone number"
              />
              <p
                v-if="mentorErrors['study-mentor-phone']"
                id="study-mentor-phone-error"
                class="form-error"
              >
                {{ mentorErrors["study-mentor-phone"] }}
              </p>
            </div>

            <div class="form-actions">
              <button class="btn btn--secondary btn--lg" type="submit">
                Request callback
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
    <SuccessDialog
      :open="profileDialogOpen"
      @close="profileDialogOpen = false"
    />

    <SuccessDialog :open="mentorDialogOpen" @close="mentorDialogOpen = false" />
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.study-abroad-page {
  overflow: clip;
  overflow-wrap: anywhere;
}

.study-eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.study-eyebrow--light {
  color: var(--color-primary-100);
}

.study-hero {
  background:
    radial-gradient(
      circle at 86% 16%,
      rgb(219 234 254 / 0.9),
      transparent 30rem
    ),
    linear-gradient(180deg, var(--color-white), var(--color-gray-50));
}

.study-hero__grid {
  display: grid;
  align-items: center;
  gap: var(--space-10);
}

.study-hero__content {
  --flow-space: var(--space-6);

  max-width: 47rem;
}

.study-hero__lead {
  max-width: 43rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.study-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.study-hero__note {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.study-hero__visual {
  max-width: 39rem;
  margin-inline: auto;
}

.study-hero__visual img {
  width: 100%;
  height: auto;
}

.study-section-heading {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}

.study-section-heading > div {
  max-width: 46rem;
}

.study-section-heading > p,
.study-section-heading > .flow:last-child:not(:first-child) {
  max-width: 39rem;
  color: var(--color-text-secondary);
}

.study-section-heading--compact {
  margin-bottom: var(--space-8);
}

.study-support {
  background: var(--color-white);
}

.study-support__grid {
  display: grid;
  gap: var(--space-5);
}

.study-support-card {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.study-support-card__icon {
  align-self: start;
}

.study-support-card p {
  color: var(--color-text-secondary);
}

.study-destinations {
  background: var(--color-gray-50);
}

.study-destinations__tabs {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  margin-bottom: var(--space-6);
  padding: var(--space-2);
  scrollbar-width: thin;
}

.study-destination-tab {
  flex: 0 0 auto;
  min-height: 2.75rem;
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-white);
  color: var(--color-text-secondary);
  font: inherit;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.study-destination-tab:hover {
  border-color: var(--color-primary-100);
  color: var(--color-primary-800);
}

.study-destination-tab:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.study-destination-tab--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: var(--color-white);
}

.study-destination-tab--active:hover {
  color: var(--color-white);
}

.study-destination-panel {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-7, var(--space-6));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.study-destination-panel__content {
  max-width: 43rem;
}

.study-destination-panel__content p:last-child {
  color: var(--color-text-secondary);
}

.study-checklist {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.study-checklist li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: start;
  color: var(--color-text-secondary);
}

.study-checklist li > span {
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

.study-guides__hint {
  margin-bottom: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.study-guides__scroller {
  overflow-x: auto;
  padding: var(--space-2);
  scrollbar-width: thin;
  scroll-snap-type: x proximity;
  @include focus-ring;
}

.study-guides__grid {
  display: grid;
  grid-auto-columns: minmax(15rem, 78%);
  grid-auto-flow: column;
  gap: var(--space-5);
  margin: 0;
  padding: 0 0 var(--space-4);
  list-style: none;

  > li {
    min-width: 0;
    scroll-snap-align: start;
  }
}

.study-guide-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  color: var(--color-text);
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  @include focus-ring;
  @include interactive-transition(border-color, box-shadow);

  &:hover {
    border-color: var(--color-primary-600);
    box-shadow: var(--shadow-md);
  }

  > img {
    width: 100%;
    height: auto;
  }
}

.study-guide-card__content {
  --flow-space: var(--space-2);
  padding: var(--space-5);

  h3 {
    font-size: var(--font-size-xl);
  }
  p {
    color: var(--color-text-secondary);
  }
}

.study-guide-card__link {
  display: block;
  color: var(--color-primary-700);
  font-weight: var(--font-weight-semibold);
}

.study-profile {
  background: var(--color-white);
}

.study-profile__grid {
  display: grid;
  gap: var(--space-10);
}

.study-profile__intro {
  max-width: 40rem;
}

.study-profile__intro > p:not(.study-eyebrow) {
  color: var(--color-text-secondary);
}

.study-form-panel {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-gray-50);
}

.study-form-grid {
  display: grid;
  gap: var(--space-5);
}

.study-form-row {
  display: grid;
  gap: var(--space-4);
}

.study-mentor {
  padding-top: 0;
}

.study-mentor__panel {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(
      circle at 90% 0%,
      rgb(96 165 250 / 0.28),
      transparent 24rem
    ),
    var(--color-primary-900);
  color: var(--color-white);
}

.study-mentor__content {
  max-width: 43rem;
}

.study-mentor__content p:not(.study-eyebrow) {
  color: var(--color-primary-100);
}

.study-mentor__form-wrap {
  min-width: 0;
}

.study-mentor__form {
  display: grid;
  gap: var(--space-4);
}

.study-mentor__label {
  color: var(--color-white);
}

.study-mentor__label .form-label__required,
.study-mentor__form .form-error {
  color: var(--color-primary-100);
}

@include respond-to(sm) {
  .study-guides__hint {
    display: none;
  }

  .study-guides__grid {
    grid-auto-flow: row;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include respond-to(md) {
  .study-hero__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.95fr);
  }

  .study-section-heading {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.7fr);
    align-items: end;
  }

  .study-support__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .study-destination-panel {
    grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
    align-items: center;
    padding: var(--space-8);
  }

  .study-destination-panel--single {
    grid-template-columns: minmax(0, 1fr);
  }

  .study-profile__grid {
    grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
    align-items: start;
  }

  .study-form-row--2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .study-mentor__panel {
    grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.65fr);
    align-items: center;
    padding: var(--space-10);
  }
}

@include respond-to(lg) {
  .study-guides__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .study-hero__grid {
    gap: var(--space-16);
  }

  .study-support-card {
    padding: var(--space-7, var(--space-6));
  }
}
</style>
