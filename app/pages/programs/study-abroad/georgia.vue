<script setup lang="ts">
import StudyDestinationGuide from "~~/app/components/study/StudyDestinationGuide.vue";
import { georgiaGuide } from "~~/app/data/content/studyAbroad/georgia";
</script>

<template>
  <StudyDestinationGuide :guide="georgiaGuide" />
</template>
