<script setup lang="ts">
import MbaSubpageHero from '~~/app/components/mba/MbaSubpageHero.vue'
import EmptyState from '~~/app/components/ui/EmptyState.vue'

useSeoMeta({
  title: 'Coupons & application offers | College FAQs',
  description: 'MBA application offers will be published here when verified items are available.',
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="mba-subpage">
    <MbaSubpageHero
      eyebrow="MBA resources"
      title="Coupons & application offers"
      description="Verified application-related offers will appear here when they are available."
    />
    <section class="section">
      <div class="container">
        <EmptyState
          title="No verified offers are currently published."
          message="Explore the admission guide or continue with your MBA application questions."
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
