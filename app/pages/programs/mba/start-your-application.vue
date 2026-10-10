<script setup lang="ts">
import SuccessDialog from '~~/app/components/ui/SuccessDialog.vue'
import FormDisclosure from '~~/app/components/ui/FormDisclosure.vue'
import { useFormPreview, hasNumericValue } from '~~/app/composables/useFormPreview'
import MbaSubpageHero from '~~/app/components/mba/MbaSubpageHero.vue'

useSeoMeta({
  title: 'Start Your MBA Application | College FAQs',
  description:
    'Start the MBA application support process by sharing your shortlist, entrance exam context, and current admission stage.',
})

const successDialogOpen = ref(false)
const { formRef, errors, validate, clearError, clearErrors } = useFormPreview()
const entranceExams = ref('')
const bestScore = ref<string | number>('')
const bestPercentile = ref<string | number>('')

function clearExamError() {
  clearErrors('start-exams')
}

function submitPreview() {
  const dependencyErrors: Record<string, string> = {}

  if ((hasNumericValue(bestScore.value) || hasNumericValue(bestPercentile.value)) && !entranceExams.value.trim()) {
    dependencyErrors['start-exams'] = 'Enter the entrance exam for this score or percentile.'
  }

  if (validate(dependencyErrors)) successDialogOpen.value = true
}
</script>

<template>
  <div class="mba-subpage">
    <MbaSubpageHero
      eyebrow="Next step"
      title="Let’s start your MBA application."
      description="Share where you currently stand. You do not need every answer before starting—this page is designed to capture enough context for the next discussion."
    />

    <section class="section">
      <div class="container mba-page-grid">
        <div class="mba-page-main">
          <form ref="formRef" class="mba-panel mba-form-grid" novalidate @input="clearError" @change="clearError" @submit.prevent="submitPreview">
            <FormDisclosure />
            <div class="mba-form-section">
              <div class="mba-form-section__heading">
                <h2>Tell us where you are</h2>
                <p>A short intake form before the detailed application process.</p>
              </div>

              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="start-name">Full name <span class="form-label__required">*</span></label>
                  <input id="start-name" class="form-control" type="text" autocomplete="name" required placeholder="Your name" name="fullName" :aria-invalid="errors['start-name'] ? 'true' : undefined" :aria-describedby="errors['start-name'] ? 'start-name-error' : undefined">
                  <p v-if="errors['start-name']" id="start-name-error" class="form-error" role="alert">{{ errors['start-name'] }}</p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="start-phone">Phone number <span class="form-label__required">*</span></label>
                  <input id="start-phone" class="form-control" type="tel" autocomplete="tel" required placeholder="Phone number" name="phone" :aria-invalid="errors['start-phone'] ? 'true' : undefined" :aria-describedby="errors['start-phone'] ? 'start-phone-error' : undefined">
                  <p v-if="errors['start-phone']" id="start-phone-error" class="form-error" role="alert">{{ errors['start-phone'] }}</p>
                </div>
              </div>

              <div class="mba-form-row mba-form-row--2">
                <div class="form-field">
                  <label class="form-label" for="start-email">Email</label>
                  <input id="start-email" class="form-control" type="email" autocomplete="email" placeholder="you@example.com" name="email" :aria-invalid="errors['start-email'] ? 'true' : undefined" :aria-describedby="errors['start-email'] ? 'start-email-error' : undefined">
                  <p v-if="errors['start-email']" id="start-email-error" class="form-error" role="alert">{{ errors['start-email'] }}</p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="start-stage">Current stage</label>
                  <select id="start-stage" class="form-control" name="currentStage">
                    <option value="">Choose one</option>
                    <option value="exploring-colleges">Still exploring colleges</option>
                    <option value="have-shortlist">Have a shortlist</option>
                    <option value="ready-to-apply">Ready to apply</option>
                    <option value="applications-submitted">Already submitted some applications</option>
                    <option value="preparing-gdpi">Preparing for GD/PI</option>
                  </select>
                </div>
              </div>

              <div class="mba-form-row mba-form-row--3">
                <div class="form-field">
                  <label class="form-label" for="start-city">Current city</label>
                  <input id="start-city" class="form-control" type="text" name="currentCity" autocomplete="address-level2" placeholder="City">
                </div>
                <div class="form-field">
                  <label class="form-label" for="start-budget">Budget (in lakhs)</label>
                  <input id="start-budget" class="form-control" type="number" min="0" step="any" inputmode="decimal" name="budgetLakhs" placeholder="Optional" :aria-invalid="errors['start-budget'] ? 'true' : undefined" :aria-describedby="errors['start-budget'] ? 'start-budget-error' : undefined">
                  <p v-if="errors['start-budget']" id="start-budget-error" class="form-error" role="alert">{{ errors['start-budget'] }}</p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="start-location">Preferred city</label>
                  <input id="start-location" class="form-control" type="text" name="preferredLocation" placeholder="If you have a preference">
                </div>
              </div>

              <div class="form-field">
                <label class="form-label" for="start-shortlist">College shortlist</label>
                <textarea id="start-shortlist" class="form-control" placeholder="Add college names, or tell us that you need help creating a shortlist." name="collegeShortlist" rows="4"></textarea>
              </div>

              <div class="mba-form-row mba-form-row--3">
                <div class="form-field">
                  <label class="form-label" for="start-exams">Entrance exams</label>
                  <input id="start-exams" v-model="entranceExams" class="form-control" type="text" placeholder="CAT, XAT, CMAT, MAT, etc." name="entranceExams" :aria-invalid="errors['start-exams'] ? 'true' : undefined" :aria-describedby="errors['start-exams'] ? 'start-exams-error' : undefined" @input="clearExamError">
                  <p v-if="errors['start-exams']" id="start-exams-error" class="form-error" role="alert">{{ errors['start-exams'] }}</p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="start-best-score">Best score</label>
                  <input id="start-best-score" v-model="bestScore" class="form-control" type="number" step="any" inputmode="decimal" name="bestScore" placeholder="Score" :aria-invalid="errors['start-best-score'] ? 'true' : undefined" :aria-describedby="errors['start-best-score'] ? 'start-best-score-error' : undefined" @input="clearExamError">
                  <p v-if="errors['start-best-score']" id="start-best-score-error" class="form-error" role="alert">{{ errors['start-best-score'] }}</p>
                </div>
                <div class="form-field">
                  <label class="form-label" for="start-best-percentile">Best percentile</label>
                  <input id="start-best-percentile" v-model="bestPercentile" class="form-control" type="number" min="0" max="100" step="any" inputmode="decimal" name="bestPercentile" placeholder="0 to 100" :aria-invalid="errors['start-best-percentile'] ? 'true' : undefined" :aria-describedby="errors['start-best-percentile'] ? 'start-best-percentile-error' : 'start-best-percentile-help'" @input="clearExamError">
                  <p id="start-best-percentile-help" class="form-help">Enter a percentile from 0 to 100, if available.</p>
                  <p v-if="errors['start-best-percentile']" id="start-best-percentile-error" class="form-error" role="alert">{{ errors['start-best-percentile'] }}</p>
                </div>
              </div>

              <div class="form-field">
                <label class="form-label" for="start-help">What help do you need first?</label>
                <textarea id="start-help" class="form-control" placeholder="Shortlisting, application form, documents, fee/loan questions, GDPI, or something else." name="helpNeeded" rows="4"></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn--primary btn--lg" type="submit">Start application support</button>
              <NuxtLink class="btn btn--secondary btn--lg" to="/programs/mba/application-form">Open detailed application form</NuxtLink>
            </div>
          </form>
        </div>

        <aside class="mba-page-sidebar">
          <div class="mba-panel mba-panel--soft flow">
            <h3>You can begin even if you are unsure.</h3>
            <p>The purpose of this shorter form is to understand the student’s current stage before asking for every detailed application field.</p>
          </div>
          <div class="mba-panel flow">
            <h3>Need to discuss first?</h3>
            <p>Use the mentor page if you would rather speak before filling a detailed application form.</p>
            <NuxtLink class="btn btn--secondary" to="/programs/mba/talk-to-mentor">Talk to Mentor</NuxtLink>
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
