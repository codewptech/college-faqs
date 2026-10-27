<script setup lang="ts">
import SubmissionFeedback from "~~/app/components/ui/SubmissionFeedback.vue";
import { useFormSubmission } from "~~/app/composables/useFormSubmission";
import SuccessDialog from "~~/app/components/ui/SuccessDialog.vue";
import FormDisclosure from "~~/app/components/ui/FormDisclosure.vue";
import { useFormPreview } from "~~/app/composables/useFormPreview";
import MbaSubpageHero from "~~/app/components/mba/MbaSubpageHero.vue";

useSeoMeta({
  title: "Talk to an MBA Mentor | College FAQs",
  description:
    "Request a callback and discuss your MBA admission questions with College FAQs.",
});

const successDialogOpen = ref(false);
const { formRef, errors, validate, clearError, applyIssues } = useFormPreview();
const { pending, submissionError, submissionIssues, submit } =
  useFormSubmission("mba_mentor", { formRef, applyIssues });

async function submitForm() {
  if (validate() && (await submit())) successDialogOpen.value = true;
}
</script>

<template>
  <div class="mba-subpage">
    <MbaSubpageHero
      eyebrow="Personal guidance"
      title="Talk to a mentor about your MBA plans."
      description="Share your questions, preferred colleges, exam situation, or admission concerns and continue the discussion with a mentor."
    />

    <section class="section">
      <div class="container mba-page-grid">
        <div class="mba-page-main">
          <div class="mba-panel">
            <div class="mba-panel__heading">
              <h2>Request a callback</h2>
              <p>
                Leave the details needed to understand what you would like to
                discuss.
              </p>
            </div>

            <form
              ref="formRef"
              class="mba-form-grid"
              :aria-busy="pending"
              novalidate
              @input="clearError"
              @change="clearError"
              @submit.prevent="submitForm"
            >
              <FormDisclosure />
              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="mentor-name"
                    >Full name
                    <span class="form-label__required">*</span></label
                  >
                  <input
                    id="mentor-name"
                    class="form-control"
                    type="text"
                    autocomplete="name"
                    required
                    placeholder="Your name"
                    name="fullName"
                    :aria-invalid="errors['mentor-name'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['mentor-name'] ? 'mentor-name-error' : undefined
                    "
                  />
                  <p
                    v-if="errors['mentor-name']"
                    id="mentor-name-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["mentor-name"] }}
                  </p>
                </div>

                <div class="form-field">
                  <label class="form-label" for="mentor-phone"
                    >Phone number
                    <span class="form-label__required">*</span></label
                  >
                  <input
                    id="mentor-phone"
                    class="form-control"
                    name="phone"
                    type="tel"
                    autocomplete="tel"
                    required
                    placeholder="Your phone number"
                    :aria-invalid="errors['mentor-phone'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['mentor-phone'] ? 'mentor-phone-error' : undefined
                    "
                  />
                  <p
                    v-if="errors['mentor-phone']"
                    id="mentor-phone-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["mentor-phone"] }}
                  </p>
                </div>
              </div>

              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="mentor-email">Email</label>
                  <input
                    id="mentor-email"
                    class="form-control"
                    name="email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    :aria-invalid="errors['mentor-email'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['mentor-email'] ? 'mentor-email-error' : undefined
                    "
                  />
                  <p
                    v-if="errors['mentor-email']"
                    id="mentor-email-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["mentor-email"] }}
                  </p>
                </div>

                <div class="form-field">
                  <label class="form-label" for="mentor-course"
                    >Program <span class="form-label__required">*</span></label
                  >
                  <select
                    id="mentor-course"
                    class="form-control"
                    required
                    name="program"
                    :aria-invalid="errors['mentor-course'] ? 'true' : undefined"
                    :aria-describedby="
                      errors['mentor-course']
                        ? 'mentor-course-error'
                        : undefined
                    "
                  >
                    <option value="">Choose a program</option>
                    <option value="mba" selected>MBA</option>
                    <option value="engineering">Engineering</option>
                    <option value="study-abroad">Study Abroad</option>
                  </select>
                  <p
                    v-if="errors['mentor-course']"
                    id="mentor-course-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors["mentor-course"] }}
                  </p>
                </div>
              </div>

              <div class="form-field">
                <label class="form-label" for="mentor-message"
                  >What would you like to discuss?</label
                >
                <textarea
                  id="mentor-message"
                  class="form-control"
                  name="message"
                  placeholder="Tell us about your exams, preferred colleges, application stage, or questions."
                  rows="4"
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
                  Request callback
                </button>
              </div>
            </form>
          </div>
        </div>

        <aside
          class="mba-page-sidebar"
          aria-label="Preparing for your discussion"
        >
          <div class="mba-panel mba-panel--soft">
            <h3>Useful before the call</h3>

            <div class="mba-panel__content-gap">
              <ul class="mba-list" role="list">
                <li>
                  <span class="mba-list__mark">✓</span
                  ><span>Your exam names and scores or percentiles</span>
                </li>
                <li>
                  <span class="mba-list__mark">✓</span
                  ><span>Your preferred cities or colleges</span>
                </li>
                <li>
                  <span class="mba-list__mark">✓</span
                  ><span>Your approximate fee or budget range</span>
                </li>
                <li>
                  <span class="mba-list__mark">✓</span
                  ><span>The questions you want answered first</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>

  <SuccessDialog :open="successDialogOpen" @close="successDialogOpen = false" />
</template>
