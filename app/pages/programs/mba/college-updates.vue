<script setup lang="ts">
import MbaSubpageHero from '~~/app/components/mba/MbaSubpageHero.vue'
import EmptyState from '~~/app/components/ui/EmptyState.vue'

useSeoMeta({
  title: 'MBA College Updates | College FAQs',
  description: 'MBA admission notices and college updates will be published here when verified items are available.',
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="mba-subpage">
    <MbaSubpageHero
      eyebrow="MBA resources"
      title="MBA College Updates"
      description="Verified MBA admission notices and college updates will appear here when they are available."
    />
    <section class="section">
      <div class="container">
        <EmptyState
          title="No verified updates are currently published."
          message="Confirm application dates and announcements directly with the institution you are considering."
        >
          <div class="cluster">
            <NuxtLink class="btn btn--primary" to="/explore/admission-guide">Admission Guide</NuxtLink>
            <NuxtLink class="btn btn--secondary" to="/programs/mba">Back to MBA</NuxtLink>
          </div>
        </EmptyState>
      </div>
    </section>
  </div>
</template>
