<script setup lang="ts">
import StudyDestinationGuide from "~~/app/components/study/StudyDestinationGuide.vue";
import { franceGuide } from "~~/app/data/content/studyAbroad/france";
</script>

<template>
  <StudyDestinationGuide :guide="franceGuide" />
</template>
