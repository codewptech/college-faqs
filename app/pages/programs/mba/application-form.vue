<script setup lang="ts">
import SuccessDialog from "~~/app/components/ui/SuccessDialog.vue";
import FormDisclosure from "~~/app/components/ui/FormDisclosure.vue";
import {
  useFormPreview,
  hasNumericValue,
} from "~~/app/composables/useFormPreview";
import MbaSubpageHero from "~~/app/components/mba/MbaSubpageHero.vue";

useSeoMeta({
  title: "MBA Application Form | College FAQs",
  description:
    "Share the student and academic information needed to begin MBA application support with College FAQs.",
});

const successDialogOpen = ref(false);
const { formRef, errors, validate, clearError, clearErrors } = useFormPreview();
const entranceExam = ref("");
const score = ref<string | number>("");
const percentile = ref<string | number>("");

function clearExamError() {
  clearErrors("app-exam");
}

function submitPreview() {
  const dependencyErrors: Record<string, string> = {};

  if (
    (hasNumericValue(score.value) || hasNumericValue(percentile.value)) &&
    !entranceExam.value.trim()
  ) {
    dependencyErrors["app-exam"] =
      "Enter the entrance exam for this score or percentile.";
  }

  if (validate(dependencyErrors)) successDialogOpen.value = true;
}
</script>

<template>
  <div class="mba-subpage">
    <MbaSubpageHero
      eyebrow="Application support"
      title="MBA Application Form"
      description="Share your contact details, academic background, and college preferences for MBA application guidance."
    />

    <section class="section">
      <div class="container mba-page-grid">
        <div class="mba-page-main">
          <form
            ref="formRef"
            class="mba-panel mba-form-grid"
            novalidate
            @input="clearError"
            @change="clearError"
            @submit.prevent="submitPreview"
          >
            <FormDisclosure />
            <div class="mba-form-section">
              <div class="mba-form-section__heading">
                <h2>Student details</h2>
                <p>Primary contact and profile information.</p>
              </div>

              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="app-name"
                    >Full name
                    <span class="form-label__required">*</span></label
                  >
                  <input
                    id="app-name"
                    class="form-control"
                    type="text"
                    autocomplete="name"
                    required
                    placeholder="Student name"
                    name="fullName"
                    :aria-invalid="errors['app-name'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['app-name'] ? 'app-name-error' : undefined
                    "
                  />
                  <p
                    v-if="errors['app-name']"
                    id="app-name-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["app-name"] }}
                  </p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="app-phone"
                    >Phone number
                    <span class="form-label__required">*</span></label
                  >
                  <input
                    id="app-phone"
                    class="form-control"
                    type="tel"
                    autocomplete="tel"
                    required
                    placeholder="Phone number"
                    name="phone"
                    :aria-invalid="errors['app-phone'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['app-phone'] ? 'app-phone-error' : undefined
                    "
                  />
                  <p
                    v-if="errors['app-phone']"
                    id="app-phone-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["app-phone"] }}
                  </p>
                </div>
              </div>

              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="app-email"
                    >Email <span class="form-label__required">*</span></label
                  >
                  <input
                    id="app-email"
                    class="form-control"
                    type="email"
                    autocomplete="email"
                    required
                    placeholder="you@example.com"
                    name="email"
                    :aria-invalid="errors['app-email'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['app-email'] ? 'app-email-error' : undefined
                    "
                  />
                  <p
                    v-if="errors['app-email']"
                    id="app-email-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["app-email"] }}
                  </p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="app-city">Current city</label>
                  <input
                    id="app-city"
                    class="form-control"
                    type="text"
                    autocomplete="address-level2"
                    placeholder="City"
                    name="currentCity"
                  />
                </div>
              </div>
            </div>

            <div class="mba-form-section">
              <div class="mba-form-section__heading">
                <h2>Academic background</h2>
                <p>
                  Add your graduation details and any entrance-exam results you
                  have available.
                </p>
              </div>

              <div class="mba-form-row mba-form-row--3">
                <div class="form-field">
                  <label class="form-label" for="app-degree"
                    >Graduation degree</label
                  >
                  <input
                    id="app-degree"
                    class="form-control"
                    type="text"
                    placeholder="B.Com, B.Tech, BBA, etc."
                    name="graduationDegree"
                  />
                </div>
                <div class="form-field">
                  <label class="form-label" for="app-graduation-year"
                    >Graduation year</label
                  >
                  <input
                    id="app-graduation-year"
                    class="form-control"
                    type="text"
                    inputmode="numeric"
                    placeholder="YYYY"
                    name="graduationYear"
                  />
                </div>
                <div class="form-field">
                  <label class="form-label" for="app-graduation-score"
                    >Graduation score</label
                  >
                  <input
                    id="app-graduation-score"
                    class="form-control"
                    type="text"
                    placeholder="Percentage / CGPA"
                    name="graduationScore"
                  />
                </div>
              </div>

              <div class="mba-form-row mba-form-row--3">
                <div class="form-field">
                  <label class="form-label" for="app-exam">Entrance exam</label>
                  <input
                    id="app-exam"
                    v-model="entranceExam"
                    class="form-control"
                    type="text"
                    placeholder="CAT, XAT, CMAT, MAT, etc."
                    name="exam"
                    :aria-invalid="errors['app-exam'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['app-exam'] ? 'app-exam-error' : undefined
                    "
                    @input="clearExamError"
                  />
                  <p
                    v-if="errors['app-exam']"
                    id="app-exam-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["app-exam"] }}
                  </p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="app-score">Score</label>
                  <input
                    id="app-score"
                    v-model="score"
                    class="form-control"
                    type="number"
                    step="any"
                    inputmode="decimal"
                    name="score"
                    placeholder="Score"
                    :aria-invalid="errors['app-score'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['app-score'] ? 'app-score-error' : undefined
                    "
                    @input="clearExamError"
                  />
                  <p
                    v-if="errors['app-score']"
                    id="app-score-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["app-score"] }}
                  </p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="app-percentile"
                    >Percentile</label
                  >
                  <input
                    id="app-percentile"
                    v-model="percentile"
                    class="form-control"
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    inputmode="decimal"
                    name="percentile"
                    placeholder="0 to 100"
                    :aria-invalid="
                      errors['app-percentile'] ? 'true' : undefined
                    "
                    :aria-describedby="
                      errors['app-percentile']
                        ? 'app-percentile-error'
                        : 'app-percentile-help'
                    "
                    @input="clearExamError"
                  />
                  <p id="app-percentile-help" class="form-help">
                    Enter a percentile from 0 to 100, if available.
                  </p>
                  <p
                    v-if="errors['app-percentile']"
                    id="app-percentile-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["app-percentile"] }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mba-form-section">
              <div class="mba-form-section__heading">
                <h2>Application preferences</h2>
                <p>
                  Tell us which colleges, specializations, and fee range you are
                  considering.
                </p>
              </div>

              <div class="form-field">
                <label class="form-label" for="app-colleges"
                  >Colleges or universities you are considering</label
                >
                <textarea
                  id="app-colleges"
                  class="form-control"
                  placeholder="Add college names or write 'need guidance' if you have not shortlisted yet."
                  name="preferredColleges"
                  rows="4"
                ></textarea>
              </div>

              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="app-specialization"
                    >Preferred specialization</label
                  >
                  <input
                    id="app-specialization"
                    class="form-control"
                    type="text"
                    placeholder="Finance, Marketing, HR, etc."
                    name="preferredSpecialization"
                  />
                </div>
                <div class="form-field">
                  <label class="form-label" for="app-budget"
                    >Approximate fee range</label
                  >
                  <input
                    id="app-budget"
                    class="form-control"
                    type="text"
                    placeholder="Optional"
                    name="feeRange"
                  />
                </div>
              </div>

              <div class="form-field">
                <label class="form-label" for="app-notes"
                  >Anything else we should know?</label
                >
                <textarea
                  id="app-notes"
                  class="form-control"
                  placeholder="Application stage, deadlines, documentation questions, or other context."
                  name="notes"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn--primary btn--lg" type="submit">
                Continue with application support
              </button>
            </div>
          </form>
        </div>

        <aside class="mba-page-sidebar">
          <div class="mba-panel mba-panel--soft flow">
            <h3>Before you begin</h3>
            <ul class="mba-list" role="list">
              <li>
                <span class="mba-list__mark">✓</span
                ><span>Keep academic details handy.</span>
              </li>
              <li>
                <span class="mba-list__mark">✓</span
                ><span>Add entrance-exam information where available.</span>
              </li>
              <li>
                <span class="mba-list__mark">✓</span
                ><span
                  >You can still ask for guidance if you have not shortlisted
                  colleges.</span
                >
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  </div>

  <SuccessDialog :open="successDialogOpen" @close="successDialogOpen = false" />
</template>
