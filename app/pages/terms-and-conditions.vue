<script setup lang="ts">
import LegalPage from "~~/app/components/ui/LegalPage.vue";
import { hasLegalPageContent } from "~~/app/data/content/helpers";
import { termsContent as content } from "~~/app/data/content/legal/terms";

useSeoMeta({
  title: () =>
    content.ready && content.seo.title.trim()
      ? content.seo.title
      : "Terms & Conditions | College FAQs",
  description: () =>
    content.ready && content.seo.description.trim()
      ? content.seo.description
      : "Terms & Conditions | College FAQs",
  robots: () =>
    content.ready && hasLegalPageContent(content)
      ? "index, follow"
      : "noindex, follow",
});
</script>

<template>
  <LegalPage
    :content="content"
    related-title="Privacy Policy"
    related-to="/privacy-policy"
  />
</template>
