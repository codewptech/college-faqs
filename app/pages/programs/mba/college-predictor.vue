<script setup lang="ts">
import MbaNotice from '~~/app/components/mba/MbaNotice.vue'
import SuccessDialog from '~~/app/components/ui/SuccessDialog.vue'
import FormDisclosure from '~~/app/components/ui/FormDisclosure.vue'
import { useFormPreview, hasNumericValue } from '~~/app/composables/useFormPreview'
import MbaSubpageHero from '~~/app/components/mba/MbaSubpageHero.vue'

useSeoMeta({
  title: 'MBA College Predictor | College FAQs',
  description:
    'Enter one or more MBA entrance exam results and profile details in the College FAQs MBA College Predictor interface.',
})

type ExamEntry = {
  id: number
  exam: string
  score: string | number
  percentile: string | number
}

const nextId = ref(2)
const exams = ref<ExamEntry[]>([
  { id: 1, exam: '', score: '', percentile: '' },
])
const successDialogOpen = ref(false)
const { formRef, errors, validate, clearError, clearErrors } = useFormPreview()

function addExam() {
  if (exams.value.length >= 5) return
  const id = nextId.value++
  exams.value.push({ id, exam: '', score: '', percentile: '' })
  nextTick(() => formRef.value?.querySelector<HTMLSelectElement>(`#exam-name-${id}`)?.focus())
}

function removeExam(id: number) {
  if (exams.value.length === 1) return
  const index = exams.value.findIndex((entry) => entry.id === id)
  clearErrors(`exam-name-${id}`, `exam-score-${id}`, `exam-percentile-${id}`)
  exams.value = exams.value.filter((exam) => exam.id !== id)
  const remainingEntry = exams.value[Math.max(0, index - 1)]
  nextTick(() => formRef.value?.querySelector<HTMLSelectElement>(`#exam-name-${remainingEntry?.id}`)?.focus())
}

function clearRowErrors(id: number) {
  clearErrors(`exam-name-${id}`, `exam-score-${id}`, `exam-percentile-${id}`)
}

function submitPreview() {
  const rowErrors: Record<string, string> = {}

  for (const entry of exams.value) {
    if (!entry.exam) rowErrors[`exam-name-${entry.id}`] = 'Select the entrance exam.'
    if (!hasNumericValue(entry.score) && !hasNumericValue(entry.percentile)) {
      rowErrors[`exam-score-${entry.id}`] = 'Enter a score or percentile for this exam.'
    }
  }

  if (validate(rowErrors)) successDialogOpen.value = true
}
</script>

<template>
  <div class="mba-subpage">
    <MbaSubpageHero
      eyebrow="MBA tool"
      title="College Predictor"
      description="Add your MBA entrance exam information and basic preferences. Add up to five exams, with a score or percentile for each."
    />

    <section class="section">
      <div class="container mba-page-grid">
        <div class="mba-page-main">
          <form ref="formRef" class="mba-panel mba-form-grid" novalidate @input="clearError" @change="clearError" @submit.prevent="submitPreview">
            <FormDisclosure />
            <div class="mba-form-section">
              <div class="mba-form-section__heading">
                <h2>Your details</h2>
                <p>Basic contact information for the predictor request.</p>
              </div>

              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="predictor-name">Full name <span class="form-label__required">*</span></label>
                  <input id="predictor-name" class="form-control" type="text" required autocomplete="name" placeholder="Your name" name="fullName" :aria-invalid="errors['predictor-name'] ? 'true' : undefined" :aria-describedby="errors['predictor-name'] ? 'predictor-name-error' : undefined">
                  <p v-if="errors['predictor-name']" id="predictor-name-error" class="form-error" role="alert">{{ errors['predictor-name'] }}</p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="predictor-phone">Phone number <span class="form-label__required">*</span></label>
                  <input id="predictor-phone" class="form-control" type="tel" required autocomplete="tel" placeholder="Your phone number" name="phone" :aria-invalid="errors['predictor-phone'] ? 'true' : undefined" :aria-describedby="errors['predictor-phone'] ? 'predictor-phone-error' : undefined">
                  <p v-if="errors['predictor-phone']" id="predictor-phone-error" class="form-error" role="alert">{{ errors['predictor-phone'] }}</p>
                </div>
              </div>

              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="predictor-email">Email</label>
                  <input id="predictor-email" class="form-control" type="email" autocomplete="email" placeholder="you@example.com" name="email" :aria-invalid="errors['predictor-email'] ? 'true' : undefined" :aria-describedby="errors['predictor-email'] ? 'predictor-email-error' : undefined">
                  <p v-if="errors['predictor-email']" id="predictor-email-error" class="form-error" role="alert">{{ errors['predictor-email'] }}</p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="predictor-city">Current city</label>
                  <input id="predictor-city" class="form-control" type="text" autocomplete="address-level2" placeholder="City" name="currentCity">
                </div>
              </div>
            </div>

            <div class="mba-form-section">
              <div class="mba-form-section__heading">
                <h2>Entrance exams</h2>
                <p>Add each exam separately and provide at least a score or percentile. You can include up to five exams.</p>
              </div>

              <div class="mba-record-list">
                <fieldset v-for="(entry, index) in exams" :key="entry.id" class="mba-record" @input="clearRowErrors(entry.id)" @change="clearRowErrors(entry.id)">
                  <legend class="form-label">Exam {{ index + 1 }}</legend>

                  <div class="mba-form-row mba-form-row--3">
                    <div class="form-field">
                      <label class="form-label" :for="`exam-name-${entry.id}`">Entrance exam <span class="form-label__required">*</span></label>
                      <select :id="`exam-name-${entry.id}`" v-model="entry.exam" :name="`exams[${index}][exam]`" class="form-control" required :aria-invalid="errors[`exam-name-${entry.id}`] ? 'true' : undefined" :aria-describedby="errors[`exam-name-${entry.id}`] ? `exam-name-error-${entry.id}` : undefined">
                        <option value="">Select exam</option>
                        <option value="cat">CAT</option>
                        <option value="xat">XAT</option>
                        <option value="cmat">CMAT</option>
                        <option value="mat">MAT</option>
                        <option value="nmat">NMAT</option>
                        <option value="snap">SNAP</option>
                        <option value="mah-mba-cet">MAH MBA CET</option>
                        <option value="other">Other</option>
                      </select>
                      <p v-if="errors[`exam-name-${entry.id}`]" :id="`exam-name-error-${entry.id}`" class="form-error" role="alert">{{ errors[`exam-name-${entry.id}`] }}</p>
                    </div>

                    <div class="form-field">
                      <label class="form-label" :for="`exam-score-${entry.id}`">Score</label>
                      <input :id="`exam-score-${entry.id}`" v-model="entry.score" :name="`exams[${index}][score]`" class="form-control" type="number" step="any" inputmode="decimal" placeholder="Score" :aria-invalid="errors[`exam-score-${entry.id}`] ? 'true' : undefined" :aria-describedby="errors[`exam-score-${entry.id}`] ? `exam-score-error-${entry.id}` : undefined">
                      <p v-if="errors[`exam-score-${entry.id}`]" :id="`exam-score-error-${entry.id}`" class="form-error" role="alert">{{ errors[`exam-score-${entry.id}`] }}</p>
                    </div>

                    <div class="form-field">
                      <label class="form-label" :for="`exam-percentile-${entry.id}`">Percentile</label>
                      <input :id="`exam-percentile-${entry.id}`" v-model="entry.percentile" :name="`exams[${index}][percentile]`" class="form-control" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="0 to 100" :aria-invalid="errors[`exam-percentile-${entry.id}`] ? 'true' : undefined" :aria-describedby="errors[`exam-percentile-${entry.id}`] ? `exam-percentile-error-${entry.id}` : `exam-percentile-help-${entry.id}`">
                      <p :id="`exam-percentile-help-${entry.id}`" class="form-help">Percentile, if available: 0 to 100.</p>
                      <p v-if="errors[`exam-percentile-${entry.id}`]" :id="`exam-percentile-error-${entry.id}`" class="form-error" role="alert">{{ errors[`exam-percentile-${entry.id}`] }}</p>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button class="btn btn--ghost btn--sm" type="button" :disabled="exams.length === 1" @click="removeExam(entry.id)">Remove exam</button>
                  </div>
                </fieldset>
              </div>

              <div class="form-actions">
                <button class="btn btn--secondary" type="button" :disabled="exams.length >= 5" @click="addExam">+ Add another exam</button>
                <p class="form-help" aria-live="polite">{{ exams.length }} of 5 exams added.</p>
              </div>
            </div>

            <div class="mba-form-section">
              <div class="mba-form-section__heading">
                <h2>Preferences</h2>
                <p>Tell us what matters to your college shortlist.</p>
              </div>

              <div class="mba-form-row mba-form-row--3">
                <div class="form-field">
                  <label class="form-label" for="predictor-specialization">Preferred specialization</label>
                  <select id="predictor-specialization" class="form-control" name="preferredSpecialization">
                    <option value="">No preference yet</option>
                    <option value="marketing">Marketing</option>
                    <option value="finance">Finance</option>
                    <option value="human-resources">Human Resources</option>
                    <option value="operations">Operations</option>
                    <option value="business-analytics">Business Analytics</option>
                    <option value="other-undecided">Other / Undecided</option>
                  </select>
                </div>
                <div class="form-field">
                  <label class="form-label" for="predictor-location">Preferred location</label>
                  <input id="predictor-location" class="form-control" type="text" placeholder="City, state, or flexible" name="preferredLocation">
                </div>
                <div class="form-field">
                  <label class="form-label" for="predictor-budget">Budget (in lakhs)</label>
                  <input id="predictor-budget" class="form-control" type="number" min="0" step="any" inputmode="decimal" name="budgetLakhs" placeholder="Optional" :aria-invalid="errors['predictor-budget'] ? 'true' : undefined" :aria-describedby="errors['predictor-budget'] ? 'predictor-budget-error' : undefined">
                  <p v-if="errors['predictor-budget']" id="predictor-budget-error" class="form-error" role="alert">{{ errors['predictor-budget'] }}</p>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn--primary btn--lg" type="submit">Check college possibilities</button>
            </div>
          </form>
        </div>

        <aside class="mba-page-sidebar">
          <MbaNotice>
            Your results provide context for a college discussion. This tool does not calculate admission chances or confirm eligibility.
          </MbaNotice>

          <div class="mba-panel mba-panel--soft flow">
            <h3>Why multiple exams?</h3>
            <p>MBA applicants often sit for more than one entrance exam. Separate results help keep the discussion clear when each exam uses a different scoring scale.</p>
          </div>
        </aside>
      </div>
    </section>
  </div>

    <SuccessDialog
      :open="successDialogOpen"
      @close="successDialogOpen = false"
    />

</template>
