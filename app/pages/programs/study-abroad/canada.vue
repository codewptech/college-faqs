<script setup lang="ts">
import StudyDestinationGuide from "~~/app/components/study/StudyDestinationGuide.vue";
import { canadaGuide } from "~~/app/data/content/studyAbroad/canada";
</script>

<template>
  <StudyDestinationGuide :guide="canadaGuide" />
</template>
