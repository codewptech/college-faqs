<script setup lang="ts">
import LegalPage from "~~/app/components/ui/LegalPage.vue";
import { hasLegalPageContent } from "~~/app/data/content/helpers";
import { privacyContent as content } from "~~/app/data/content/legal/privacy";

useSeoMeta({
  title: () =>
    content.ready && content.seo.title.trim()
      ? content.seo.title
      : "Privacy Policy | College FAQs",
  description: () =>
    content.ready && content.seo.description.trim()
      ? content.seo.description
      : "Privacy Policy | College FAQs",
  robots: () =>
    content.ready && hasLegalPageContent(content)
      ? "index, follow"
      : "noindex, follow",
});
</script>

<template>
  <LegalPage
    :content="content"
    related-title="Terms & Conditions"
    related-to="/terms-and-conditions"
  />
</template>
