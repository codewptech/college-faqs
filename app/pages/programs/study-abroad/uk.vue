<script setup lang="ts">
import StudyDestinationGuide from "~~/app/components/study/StudyDestinationGuide.vue";
import { ukGuide } from "~~/app/data/content/studyAbroad/uk";
</script>

<template>
  <StudyDestinationGuide :guide="ukGuide" />
</template>
