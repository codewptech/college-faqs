<script setup lang="ts">
import SubmissionFeedback from "~~/app/components/ui/SubmissionFeedback.vue";
import { useFormSubmission } from "~~/app/composables/useFormSubmission";
import SuccessDialog from "~~/app/components/ui/SuccessDialog.vue";
import FormDisclosure from "~~/app/components/ui/FormDisclosure.vue";
import { useFormPreview } from "~~/app/composables/useFormPreview";
useSeoMeta({
  title: "Engineering Admission Guidance | College FAQs",
  description:
    "Explore Engineering admission guidance, branch and college-selection factors, application support, and personal counselling with College FAQs.",
});

const decisionFactors = [
  {
    number: "01",
    title: "Branch & academic interest",
    description:
      "Start with the fields you are interested in and understand how branch choice may shape the academic experience you are looking for.",
  },
  {
    number: "02",
    title: "College & location",
    description:
      "Compare institutions and locations by looking at the environment, accessibility, campus preferences, and the factors important to your family.",
  },
  {
    number: "03",
    title: "Fees & affordability",
    description:
      "Consider the complete financial picture instead of looking only at the headline tuition amount.",
  },
  {
    number: "04",
    title: "Admission route",
    description:
      "Understand which admission pathway applies to the colleges you are considering and what information or documents you may need next.",
  },
  {
    number: "05",
    title: "Campus & student experience",
    description:
      "Look beyond a single ranking or claim and compare the overall environment in which you would spend the next several years.",
  },
  {
    number: "06",
    title: "Career direction",
    description:
      "Use placement information and career outcomes as part of the decision, while keeping your own skills and long-term interests in view.",
  },
];

const supportAreas = [
  {
    title: "Talk to a mentor",
    description:
      "Discuss your current options, questions, and admission situation before deciding what to do next.",
    action: "Request guidance",
    href: "#engineering-enquiry",
  },
  {
    title: "College-selection guidance",
    description:
      "Organize the factors that matter to you instead of comparing colleges only by name or popularity.",
    action: "See decision factors",
    href: "#engineering-decisions",
  },
  {
    title: "Application support",
    description:
      "Keep track of the practical steps involved once you know which institutions you want to consider.",
    action: "Discuss your application",
    href: "#engineering-enquiry",
  },
];

const successDialogOpen = ref(false);
const { formRef, errors, validate, clearError, applyIssues } = useFormPreview();
const { pending, submissionError, submissionIssues, submit } =
  useFormSubmission("engineering_enquiry", { formRef, applyIssues });

async function submitForm() {
  if (validate() && (await submit())) successDialogOpen.value = true;
}
</script>

<template>
  <div class="engineering-page">
    <section class="engineering-hero section">
      <div class="container engineering-hero__grid">
        <div class="engineering-hero__content flow">
          <p class="engineering-eyebrow">Engineering</p>

          <h1>
            Make your Engineering college decision with a clearer comparison.
          </h1>

          <p class="engineering-hero__lead">
            Explore the factors that matter, organize your college choices, and
            discuss your admission questions with a mentor when you need
            personal guidance.
          </p>

          <div class="engineering-hero__actions">
            <a class="btn btn--primary btn--lg" href="#engineering-enquiry">
              Talk to a mentor
            </a>

            <a class="btn btn--secondary btn--lg" href="#engineering-decisions">
              Compare decision factors
            </a>
          </div>

          <p class="engineering-hero__note">
            Start with your interests, preferences, and admission questions.
          </p>
        </div>

        <div class="engineering-hero__visual" aria-hidden="true">
          <img
            src="/placeholders/engineering-guidance.svg"
            alt=""
            width="760"
            height="600"
          />
        </div>
      </div>
    </section>

    <section
      class="section section--compact engineering-support"
      aria-labelledby="engineering-support-title"
    >
      <div class="container">
        <div
          class="engineering-section-heading engineering-section-heading--compact"
        >
          <div class="flow">
            <p class="engineering-eyebrow">Start where you are</p>

            <h2 id="engineering-support-title">
              Practical support for the stage you are currently at.
            </h2>
          </div>

          <p>
            You do not need to solve every admission question at once. Begin
            with the decision or application step that needs attention now.
          </p>
        </div>

        <div class="engineering-support__grid">
          <article
            v-for="area in supportAreas"
            :key="area.title"
            class="engineering-support-card"
          >
            <div class="flow">
              <h3>{{ area.title }}</h3>
              <p>{{ area.description }}</p>
            </div>

            <a class="engineering-inline-link" :href="area.href">
              {{ area.action }}
              <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </div>
    </section>

    <section
      id="engineering-decisions"
      class="section engineering-decisions"
      aria-labelledby="engineering-decisions-title"
    >
      <div class="container">
        <div class="engineering-section-heading">
          <div class="flow">
            <p class="engineering-eyebrow">Choosing a college</p>

            <h2 id="engineering-decisions-title">
              Compare the decision, not just the college name.
            </h2>
          </div>

          <p>
            The right comparison depends on your priorities. These are useful
            starting points for organizing that discussion before narrowing your
            choices.
          </p>
        </div>

        <ol class="engineering-decisions__grid" role="list">
          <li
            v-for="factor in decisionFactors"
            :key="factor.number"
            class="engineering-decision-card"
          >
            <span
              class="engineering-decision-card__number number-badge"
              aria-hidden="true"
            >
              {{ factor.number }}
            </span>

            <div class="flow">
              <h3>{{ factor.title }}</h3>
              <p>{{ factor.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section
      class="section engineering-process"
      aria-labelledby="engineering-process-title"
    >
      <div class="container engineering-process__grid">
        <div class="engineering-process__content flow">
          <p class="engineering-eyebrow">A simpler process</p>

          <h2 id="engineering-process-title">
            Move from a long list of options to a more useful shortlist.
          </h2>

          <p>
            Start by sharing what you already know: your academic situation,
            preferred branch or field, location preferences, budget range, and
            the colleges you are currently considering.
          </p>

          <p>
            From there, the discussion can focus on the questions that actually
            affect your next step instead of repeating information you already
            have.
          </p>
        </div>

        <ol class="engineering-process__steps">
          <li class="engineering-process-step">
            <span class="step-indicator" aria-hidden="true">01</span>
            <div>
              <h3>Share your situation</h3>
              <p>
                Tell us what you have already considered and where you are
                unsure.
              </p>
            </div>
          </li>

          <li class="engineering-process-step">
            <span class="step-indicator" aria-hidden="true">02</span>
            <div>
              <h3>Organize the comparison</h3>
              <p>Look at the factors that are relevant to your priorities.</p>
            </div>
          </li>

          <li class="engineering-process-step">
            <span class="step-indicator" aria-hidden="true">03</span>
            <div>
              <h3>Decide the next action</h3>
              <p>
                Move toward a shortlist, application step, or further
                discussion.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section
      id="engineering-enquiry"
      class="section engineering-enquiry"
      aria-labelledby="engineering-enquiry-title"
    >
      <div class="container engineering-enquiry__grid">
        <div class="engineering-enquiry__intro flow">
          <p class="engineering-eyebrow">Talk to a mentor</p>

          <h2 id="engineering-enquiry-title">
            Tell us what you want to discuss.
          </h2>

          <p>
            Share your Engineering admission questions and the options you are
            considering.
          </p>

          <div class="engineering-enquiry__note">
            <strong>Useful to include:</strong>
            preferred branch, colleges you are considering, location preference,
            budget range, and the question you want answered first.
          </div>
        </div>

        <div class="engineering-enquiry__panel">
          <form
            ref="formRef"
            class="engineering-form"
            :aria-busy="pending"
            novalidate
            @input="clearError"
            @change="clearError"
            @submit.prevent="submitForm"
          >
            <FormDisclosure />
            <div class="engineering-form__row">
              <div class="form-field">
                <label class="form-label" for="engineering-name">
                  Full name
                  <span class="form-label__required">*</span>
                </label>

                <input
                  id="engineering-name"
                  name="fullName"
                  class="form-control"
                  type="text"
                  autocomplete="name"
                  required
                  placeholder="Your name"
                  :aria-invalid="
                    errors['engineering-name'] ? 'true' : undefined
                  "
                  :aria-describedby="
                    errors['engineering-name']
                      ? 'engineering-name-error'
                      : undefined
                  "
                />
                <p
                  v-if="errors['engineering-name']"
                  id="engineering-name-error"
                  class="form-error"
                  role="alert"
                >
                  {{ errors["engineering-name"] }}
                </p>
              </div>

              <div class="form-field">
                <label class="form-label" for="engineering-phone">
                  Phone number
                  <span class="form-label__required">*</span>
                </label>

                <input
                  id="engineering-phone"
                  name="phone"
                  class="form-control"
                  type="tel"
                  autocomplete="tel"
                  required
                  placeholder="Your phone number"
                  :aria-invalid="
                    errors['engineering-phone'] ? 'true' : undefined
                  "
                  :aria-describedby="
                    errors['engineering-phone']
                      ? 'engineering-phone-error'
                      : undefined
                  "
                />
                <p
                  v-if="errors['engineering-phone']"
                  id="engineering-phone-error"
                  class="form-error"
                  role="alert"
                >
                  {{ errors["engineering-phone"] }}
                </p>
              </div>
            </div>

            <div class="engineering-form__row">
              <div class="form-field">
                <label class="form-label" for="engineering-email">
                  Email
                </label>

                <input
                  id="engineering-email"
                  name="email"
                  class="form-control"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  :aria-invalid="
                    errors['engineering-email'] ? 'true' : undefined
                  "
                  :aria-describedby="
                    errors['engineering-email']
                      ? 'engineering-email-error'
                      : undefined
                  "
                />
                <p
                  v-if="errors['engineering-email']"
                  id="engineering-email-error"
                  class="form-error"
                  role="alert"
                >
                  {{ errors["engineering-email"] }}
                </p>
              </div>

              <div class="form-field">
                <label class="form-label" for="engineering-branch">
                  Preferred branch or field
                </label>

                <input
                  id="engineering-branch"
                  name="preferredBranch"
                  class="form-control"
                  type="text"
                  placeholder="If you already have one in mind"
                />
              </div>
            </div>

            <div class="form-field">
              <label class="form-label" for="engineering-message">
                What would you like help with?
              </label>

              <textarea
                id="engineering-message"
                name="message"
                class="form-control"
                rows="4"
                placeholder="Tell us about your current options, preferences, or questions."
              ></textarea>
            </div>

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
                Request guidance
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>

  <SuccessDialog :open="successDialogOpen" @close="successDialogOpen = false" />
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.engineering-page {
  overflow: clip;
}

.engineering-eyebrow {
  color: var(--color-brand-red);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.engineering-hero {
  background: var(--color-white);
}

.engineering-hero__grid {
  display: grid;
  align-items: center;
  gap: var(--space-10);
}

.engineering-hero__content {
  --flow-space: var(--space-6);

  max-width: 46rem;
}

.engineering-hero__lead {
  max-width: 43rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.engineering-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.engineering-hero__note {
  max-width: 40rem;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.engineering-hero__visual {
  max-width: 38rem;
  margin-inline: auto;
  background: var(--color-white);
}

.engineering-hero__visual img {
  width: 100%;
  height: auto;
}

.engineering-section-heading {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}

.engineering-section-heading > div {
  max-width: 44rem;
}

.engineering-section-heading > p {
  max-width: 39rem;
  color: var(--color-text-secondary);
}

.engineering-section-heading--compact {
  margin-bottom: var(--space-8);
}

.engineering-support {
  background: var(--color-white);
}

.engineering-support__grid {
  display: grid;
  gap: var(--space-5);
}

.engineering-support-card {
  display: grid;
  align-content: space-between;
  gap: var(--space-6);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.engineering-support-card p,
.engineering-decision-card p,
.engineering-process__content p:not(.engineering-eyebrow),
.engineering-process-step p,
.engineering-enquiry__intro > p:not(.engineering-eyebrow) {
  color: var(--color-text-secondary);
}

.engineering-inline-link {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-primary-700);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.engineering-inline-link:hover {
  color: var(--color-primary-800);
}

.engineering-decisions {
  background: var(--color-gray-50);
}

.engineering-decisions__grid {
  display: grid;
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.engineering-decision-card {
  display: grid;
  align-content: start;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-white);
}

.engineering-decision-card__number {
  align-self: start;
}

.engineering-process {
  background: var(--color-white);
}

.engineering-process__grid {
  display: grid;
  gap: var(--space-10);
}

.engineering-process__content {
  max-width: 42rem;
}

.engineering-process__steps {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.engineering-process-step {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: start;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-gray-50);
}

.engineering-process-step > .step-indicator {
  align-self: start;
  margin-top: 0.125rem;
}

.engineering-process-step > div {
  min-width: 0;
}

.engineering-process-step h3 {
  margin-bottom: var(--space-2);
}

.engineering-enquiry {
  background: var(--color-gray-50);
}

.engineering-enquiry__grid {
  display: grid;
  gap: var(--space-8);
}

.engineering-enquiry__intro {
  max-width: 40rem;
}

.engineering-enquiry__note {
  padding: var(--space-4);
  border-left: 3px solid var(--color-primary-600);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background: var(--color-primary-50);
  color: var(--color-text-secondary);
}

.engineering-enquiry__panel {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  box-shadow: var(--shadow-md);
}

.engineering-form {
  display: grid;
  gap: var(--space-5);
}

.engineering-form__row {
  display: grid;
  gap: var(--space-4);
}

@include respond-to(md) {
  .engineering-hero__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.95fr);
  }

  .engineering-section-heading {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.72fr);
    align-items: end;
  }

  .engineering-support__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .engineering-decisions__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .engineering-process__grid,
  .engineering-enquiry__grid {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-12);
  }

  .engineering-form__row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include respond-to(lg) {
  .engineering-hero__grid {
    gap: var(--space-16);
  }

  .engineering-decisions__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .engineering-support-card,
  .engineering-decision-card,
  .engineering-enquiry__panel {
    padding: var(--space-7);
  }
}
</style>
