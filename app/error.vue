<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const isNotFound = computed(() => props.error.statusCode === 404);

useSeoMeta({
  title: () =>
    `${isNotFound.value ? "Page not found" : "Something went wrong"} | College FAQs`,
  description:
    "Return to College FAQs and explore college programs, admission guidance and FAQs.",
  robots: "noindex, nofollow",
});

function recover() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <NuxtLayout name="default">
    <section class="section section--subtle">
      <div class="container container--narrow error-content flow">
        <p class="mba-page-eyebrow">
          College FAQs · {{ isNotFound ? "404" : "Error" }}
        </p>
        <h1>
          {{
            isNotFound ? "We couldn’t find that page." : "Something went wrong."
          }}
        </h1>
        <p>
          {{
            isNotFound
              ? "The address may have changed, or the page may no longer be available."
              : "Please try again, or return home to continue exploring."
          }}
        </p>
        <button class="btn btn--primary btn--lg" type="button" @click="recover">
          Back to Home
        </button>
        <nav aria-label="Helpful pages" class="error-navigation flow">
          <h2>Continue exploring</h2>
          <div class="cluster">
            <NuxtLink to="/programs/mba">MBA</NuxtLink>
            <NuxtLink to="/programs/engineering">Engineering</NuxtLink>
            <NuxtLink to="/programs/study-abroad">Study Abroad</NuxtLink>
            <NuxtLink to="/explore/admission-guide">Admission Guide</NuxtLink>
            <NuxtLink to="/explore/faqs">FAQs</NuxtLink>
          </div>
        </nav>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.error-content {
  --flow-space: var(--space-6);
}

.error-navigation {
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.error-navigation h2 {
  font-size: var(--font-size-xl);
}
</style>
