<script setup lang="ts">
const route = useRoute();
const canonical = computed(() => {
  const path = route.path === "/" ? "/" : route.path.replace(/\/$/, "");
  return `https://www.collegefaqs.com${path}`;
});

useHead(() => ({
  link: [{ rel: "canonical", href: canonical.value }],
}));

useSeoMeta({
  ogSiteName: "College FAQs",
  ogType: "website",
  ogUrl: () => canonical.value,
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
