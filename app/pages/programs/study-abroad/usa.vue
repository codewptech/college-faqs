<script setup lang="ts">
import StudyDestinationGuide from '~~/app/components/study/StudyDestinationGuide.vue'
import { usaGuide } from '~~/app/data/content/studyAbroad/usa'
</script>

<template>
  <StudyDestinationGuide :guide="usaGuide" />
</template>
