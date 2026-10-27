<script setup lang="ts">
import SubmissionFeedback from "~~/app/components/ui/SubmissionFeedback.vue";
import { useFormSubmission } from "~~/app/composables/useFormSubmission";
import MbaSubpageHero from "~~/app/components/mba/MbaSubpageHero.vue";
import FormDisclosure from "~~/app/components/ui/FormDisclosure.vue";
import SuccessDialog from "~~/app/components/ui/SuccessDialog.vue";
import { useFormPreview } from "~~/app/composables/useFormPreview";

useSeoMeta({
  title: "MBA GDPI Preparation | College FAQs",
  description:
    "Prepare for MBA group discussions and personal interviews and organize your preferred colleges with College FAQs.",
});

const modules = [
  {
    number: "01",
    title: "Understand the selection stage",
    description:
      "Know what the institution is evaluating and how the next round fits into the overall admission process.",
  },
  {
    number: "02",
    title: "Personal interview preparation",
    description:
      "Organize your academic story, goals, MBA motivation, strengths, experience, and likely follow-up questions.",
  },
  {
    number: "03",
    title: "Group discussion preparation",
    description:
      "Practice structured thinking, listening, participation, clarity, and respectful contribution when GD is part of the process.",
  },
  {
    number: "04",
    title: "Practice & feedback",
    description:
      "Use mock discussions or interview practice to identify weak areas before the actual selection round.",
  },
];
const { formRef, errors, validate, clearError, applyIssues } = useFormPreview();
const { pending, submissionError, submissionIssues, submit } =
  useFormSubmission("mba_gdpi", { formRef, applyIssues });
const successDialogOpen = ref(false);
const contactFields = [
  {
    id: "gdpi-name",
    name: "fullName",
    label: "Full name",
    type: "text",
    autocomplete: "name",
    required: true,
  },
  {
    id: "gdpi-phone",
    name: "phone",
    label: "Phone number",
    type: "tel",
    autocomplete: "tel",
    required: true,
  },
  {
    id: "gdpi-email",
    name: "email",
    label: "Email",
    type: "email",
    autocomplete: "email",
    required: true,
  },
  {
    id: "gdpi-city",
    name: "currentCity",
    label: "Current city",
    type: "text",
    autocomplete: "address-level2",
    required: false,
  },
];
const collegeGroups = [
  {
    id: "applied",
    name: "appliedColleges",
    label: "Colleges already applied to",
  },
  {
    id: "target",
    name: "targetColleges",
    label: "Colleges targeted / will apply to",
  },
];

async function submitForm() {
  if (validate() && (await submit())) successDialogOpen.value = true;
}
</script>

<template>
  <div class="mba-subpage">
    <MbaSubpageHero
      eyebrow="Selection preparation"
      title="GDPI Preparation"
      description="Prepare for group discussions, personal interviews, and other MBA selection stages with a clear structure instead of last-minute guessing."
    />

    <section class="section">
      <div class="container">
        <div class="gdpi-intro">
          <div class="flow">
            <p class="mba-page-eyebrow">Preparation path</p>
            <h2>Build confidence by preparing one layer at a time.</h2>
          </div>
          <p>
            Every college looks for something unique in GD-PI rounds. Share your
            preferred colleges with us so we can design a personalized strategy,
            complete with targeted practice sessions and realistic mock
            interviews.
          </p>
        </div>

        <ol class="gdpi-grid" role="list">
          <li v-for="module in modules" :key="module.number" class="gdpi-card">
            <span class="gdpi-card__number step-indicator" aria-hidden="true">{{
              module.number
            }}</span>
            <div class="flow">
              <h3>{{ module.title }}</h3>
              <p>{{ module.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section gdpi-practice">
      <div class="container mba-page-grid">
        <div class="mba-page-main">
          <form
            ref="formRef"
            class="mba-panel mba-form-grid"
            :aria-busy="pending"
            novalidate
            @input="clearError"
            @change="clearError"
            @submit.prevent="submitForm"
          >
            <div class="flow">
              <p class="mba-page-eyebrow">Your preparation plans</p>
              <h2>Organize your GDPI preparation</h2>
              <FormDisclosure />
            </div>
            <div class="mba-form-row mba-form-row--2">
              <div
                v-for="field in contactFields"
                :key="field.id"
                class="form-field"
              >
                <label class="form-label" :for="field.id">
                  {{ field.label }}
                  <span v-if="field.required" class="form-label__required"
                    >*</span
                  >
                </label>
                <input
                  :id="field.id"
                  class="form-control"
                  :name="field.name"
                  :type="field.type"
                  :autocomplete="field.autocomplete"
                  :required="field.required"
                  :aria-invalid="errors[field.id] ? 'true' : undefined"
                  :aria-describedby="
                    errors[field.id] ? `${field.id}-error` : undefined
                  "
                />
                <p
                  v-if="errors[field.id]"
                  :id="`${field.id}-error`"
                  class="form-error"
                  role="alert"
                >
                  {{ errors[field.id] }}
                </p>
              </div>
            </div>
            <fieldset
              v-for="group in collegeGroups"
              :key="group.id"
              class="gdpi-college-group"
            >
              <legend>{{ group.label }}</legend>
              <div class="mba-form-row mba-form-row--3">
                <div v-for="number in 3" :key="number" class="form-field">
                  <label class="form-label" :for="`gdpi-${group.id}-${number}`"
                    >College {{ number }}</label
                  >
                  <input
                    :id="`gdpi-${group.id}-${number}`"
                    class="form-control"
                    :name="`${group.name}[${number - 1}]`"
                    type="text"
                  />
                </div>
              </div>
            </fieldset>
            <SubmissionFeedback
              :pending="pending"
              :error="submissionError"
              :issues="submissionIssues"
            />
            <div class="form-actions">
              <button
                class="btn btn--primary btn--lg"
                type="submit"
                :disabled="pending"
              >
                Submit preparation details
              </button>
            </div>
          </form>
        </div>

        <aside class="mba-page-sidebar">
          <div class="mba-panel mba-panel--soft flow">
            <h3>Need personal practice?</h3>
            <p>
              Use the mentor page to organize your questions about preparation
              and mock interviews.
            </p>
            <NuxtLink
              class="btn btn--secondary"
              to="/programs/mba/talk-to-mentor"
              >Talk to Mentor</NuxtLink
            >
          </div>
        </aside>
      </div>
    </section>
  </div>
  <SuccessDialog :open="successDialogOpen" @close="successDialogOpen = false" />
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.gdpi-intro {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}

.gdpi-intro > div,
.gdpi-intro > p {
  max-width: 44rem;
}

.gdpi-intro > p,
.gdpi-card p,
.gdpi-practice p {
  color: var(--color-text-secondary);
}

.gdpi-grid {
  display: grid;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.gdpi-card {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: start;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
}

.gdpi-card__number {
  align-self: start;
  margin-top: 0.125rem;
}

.gdpi-college-group {
  min-width: 0;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.gdpi-college-group legend {
  padding-inline: var(--space-2);
  font-weight: var(--font-weight-semibold);
}

.gdpi-practice {
  background: var(--color-gray-50);
}

@include respond-to(md) {
  .gdpi-intro {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.7fr);
    align-items: end;
  }

  .gdpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
