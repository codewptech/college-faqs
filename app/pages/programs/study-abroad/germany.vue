<script setup lang="ts">
import StudyDestinationGuide from "~~/app/components/study/StudyDestinationGuide.vue";
import { germanyGuide } from "~~/app/data/content/studyAbroad/germany";
</script>

<template>
  <StudyDestinationGuide :guide="germanyGuide" />
</template>
