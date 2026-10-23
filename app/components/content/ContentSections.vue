<script setup lang="ts">
import ContentText from "~~/app/components/content/ContentText.vue";
import {
  hasBlockContent,
  hasSectionContent,
  hasText,
} from "~~/app/data/content/helpers";
import type { ContentSection } from "~~/app/data/content/types";

const props = withDefaults(
  defineProps<{
    sections: ContentSection[];
    headingLevel?: number;
  }>(),
  {
    headingLevel: 2,
  },
);

const visibleSections = computed(() =>
  props.sections.filter(hasSectionContent),
);
const headingTag = computed(
  () => `h${Math.min(6, Math.max(2, props.headingLevel))}`,
);
</script>

<template>
  <div class="content-sections">
    <section
      v-for="(section, sectionIndex) in visibleSections"
      :id="section.id"
      :key="section.id || sectionIndex"
      class="content-section flow"
    >
      <header
        v-if="section.eyebrow?.trim() || section.title?.trim()"
        class="content-section__header flow"
      >
        <p v-if="section.eyebrow?.trim()" class="content-section__eyebrow">
          {{ section.eyebrow }}
        </p>
        <component :is="headingTag" v-if="section.title?.trim()">{{
          section.title
        }}</component>
      </header>

      <template
        v-for="(block, blockIndex) in section.blocks.filter(hasBlockContent)"
        :key="blockIndex"
      >
        <p v-if="block.type === 'paragraph'">
          <ContentText :value="block.text" />
        </p>

        <component
          :is="block.ordered ? 'ol' : 'ul'"
          v-else-if="block.type === 'list'"
          class="content-list"
        >
          <li
            v-for="(item, itemIndex) in block.items.filter(hasText)"
            :key="itemIndex"
          >
            <ContentText :value="item" />
          </li>
        </component>

        <div
          v-else-if="block.type === 'table'"
          class="content-table-wrap"
          tabindex="0"
        >
          <table class="content-table">
            <caption v-if="block.caption?.trim()">
              {{
                block.caption
              }}
            </caption>
            <thead v-if="block.headers.some(hasText)">
              <tr>
                <th
                  v-for="(header, cellIndex) in block.headers"
                  :key="cellIndex"
                  scope="col"
                >
                  <ContentText v-if="hasText(header)" :value="header" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                  <ContentText v-if="hasText(cell)" :value="cell" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <aside v-else-if="block.type === 'note'" class="content-note">
          <ContentText :value="block.text" />
        </aside>
      </template>
    </section>
  </div>
</template>

<style scoped lang="scss">
.content-sections,
.content-section {
  display: grid;
  min-width: 0;
  gap: var(--space-8);
}

.content-section__header {
  --flow-space: var(--space-3);
}

.content-section__eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.content-section > p,
.content-list,
.content-note {
  color: var(--color-text-secondary);
}

.content-list {
  display: grid;
  gap: var(--space-3);
  max-width: var(--content-max);
  margin: 0;
  padding-left: var(--space-6);
}

.content-note {
  max-width: var(--content-max);
  padding: var(--space-4) var(--space-5);
  border-left: 3px solid var(--color-primary-600);
  background: var(--color-primary-50);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.content-table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.content-table-wrap:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

.content-table {
  width: 100%;
  min-width: 36rem;
  border-collapse: collapse;
  background: var(--color-white);
}

.content-table caption {
  padding: var(--space-4);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-semibold);
  text-align: left;
}

.content-table th,
.content-table td {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
  vertical-align: top;
  text-align: left;
}

.content-table th {
  background: var(--color-gray-50);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}
</style>
