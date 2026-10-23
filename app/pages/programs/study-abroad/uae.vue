<script setup lang="ts">
import StudyDestinationGuide from "~~/app/components/study/StudyDestinationGuide.vue";
import { uaeGuide } from "~~/app/data/content/studyAbroad/uae";
</script>

<template>
  <StudyDestinationGuide :guide="uaeGuide" />
</template>
