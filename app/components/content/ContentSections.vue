<script setup lang="ts">
import ContentText from "~~/app/components/content/ContentText.vue";
import { getRenderableSections, hasText } from "~~/app/data/content/helpers";
import type { ContentSection } from "~~/app/data/content/types";

const props = withDefaults(
  defineProps<{
    sections: ContentSection[];
    headingLevel?: number;
  }>(),
  { headingLevel: 2 },
);

// The guide TOC and every other consumer use the same section interpretation.
const entries = computed(() => getRenderableSections(props.sections));
const headingTag = computed(
  () => `h${Math.min(6, Math.max(2, props.headingLevel))}`,
);
</script>

<template>
  <div v-if="entries.length" class="content-sections editorial-prose">
    <section
      v-for="(entry, sectionIndex) in entries"
      :id="entry.anchorId"
      :key="entry.anchorId || sectionIndex"
      class="content-section flow"
    >
      <header
        v-if="entry.section.eyebrow?.trim() || entry.section.title?.trim()"
        class="content-section__header flow"
      >
        <p v-if="entry.section.eyebrow?.trim()" class="editorial-eyebrow">
          {{ entry.section.eyebrow }}
        </p>
        <component :is="headingTag" v-if="entry.section.title?.trim()">
          {{ entry.section.title }}
        </component>
      </header>

      <template v-for="(block, blockIndex) in entry.blocks" :key="blockIndex">
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
                  v-for="(header, index) in block.headers"
                  :key="index"
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

        <figure v-else-if="block.type === 'image'" class="content-figure">
          <img
            :src="block.src"
            :alt="block.alt"
            :width="block.width"
            :height="block.height"
            loading="lazy"
            decoding="async"
          />
          <figcaption v-if="block.caption?.trim()">
            {{ block.caption }}
          </figcaption>
        </figure>

        <aside v-else-if="block.type === 'note'" class="content-note">
          <ContentText :value="block.text" />
        </aside>
      </template>
    </section>
  </div>
</template>
