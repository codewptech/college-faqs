<script setup lang="ts">
import type { PropType } from "vue";
import type { EditorialTimestamps } from "~~/app/data/content/types";
import {
  isValidEditorialTimestamp,
  shouldShowEffectiveAt,
} from "~~/app/data/content/helpers";

const props = defineProps({
  publishedAt: {
    type: String as PropType<EditorialTimestamps["publishedAt"]>,
    default: null,
  },
  lastUpdated: {
    type: String as PropType<EditorialTimestamps["lastUpdated"]>,
    default: null,
  },
  effectiveAt: {
    type: String as PropType<EditorialTimestamps["effectiveAt"]>,
    default: null,
  },
});

const format = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  }).format(new Date(value));

const fields = computed(() => {
  const showEffective = shouldShowEffectiveAt(
    props.lastUpdated,
    props.effectiveAt,
  );
  const choices = [
    {
      key: "published",
      label: "Publication date",
      value: props.publishedAt,
    },
    {
      key: "updated",
      label: "Last updated",
      value: props.lastUpdated,
    },
    {
      key: "effective",
      label: "Effective date",
      value: showEffective ? props.effectiveAt : null,
    },
  ];
  return choices
    .filter((field) => isValidEditorialTimestamp(field.value))
    .map((field) => ({
      key: field.key,
      label: field.label,
      value: field.value!,
    }));
});
</script>

<template>
  <dl
    v-if="fields.length"
    class="content-editorial-dates"
    aria-label="Editorial dates"
  >
    <div
      v-for="field in fields"
      :key="field.key"
      class="content-editorial-dates__item"
    >
      <dt>{{ field.label }}:</dt>
      <dd>
        <time :datetime="field.value">{{ format(field.value) }}</time>
      </dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.content-editorial-dates {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2) var(--space-6);
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.content-editorial-dates__item {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
}

.content-editorial-dates dt {
  font-weight: var(--font-weight-semibold);
}
.content-editorial-dates dd {
  margin: 0;
}
</style>
