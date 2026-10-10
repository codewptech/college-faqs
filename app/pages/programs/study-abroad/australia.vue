<script setup lang="ts">
import StudyDestinationGuide from '~~/app/components/study/StudyDestinationGuide.vue'
import { australiaGuide } from '~~/app/data/content/studyAbroad/australia'
</script>

<template>
  <StudyDestinationGuide :guide="australiaGuide" />
</template>
