<script setup lang="ts">
import type { ContentText, TextSegment } from '~~/app/data/content/types'
import { isInternalHref, isSafeHref } from '~~/app/data/content/helpers'

const props = defineProps<{ value: ContentText }>()

const segments = computed<TextSegment[]>(() => {
  if (typeof props.value === 'string') return [{ text: props.value }]
  return props.value.filter(segment => segment?.text?.trim())
})
</script>

<template>
  <template v-for="(segment, index) in segments" :key="index">
    <NuxtLink
      v-if="segment.href && isSafeHref(segment.href) && isInternalHref(segment.href)"
      :to="segment.href"
    >
      <strong v-if="segment.strong">{{ segment.text }}</strong>
      <template v-else>{{ segment.text }}</template>
    </NuxtLink>
    <a
      v-else-if="segment.href && isSafeHref(segment.href)"
      :href="segment.href"
    >
      <strong v-if="segment.strong">{{ segment.text }}</strong>
      <template v-else>{{ segment.text }}</template>
    </a>
    <strong v-else-if="segment.strong">{{ segment.text }}</strong>
    <template v-else>{{ segment.text }}</template>
  </template>
</template>
