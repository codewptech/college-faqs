<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  description: string;
  backLabel?: string;
}>();
</script>

<template>
  <section class="mba-subhero section section--compact">
    <div class="container mba-subhero__inner">
      <NuxtLink class="mba-subhero__back" to="/programs/mba">
        <span aria-hidden="true">←</span>
        {{ backLabel || "Back to MBA" }}
      </NuxtLink>

      <div class="mba-subhero__content flow">
        <p class="mba-page-eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p class="mba-subhero__lead">{{ description }}</p>
      </div>
    </div>
  </section>
</template>
