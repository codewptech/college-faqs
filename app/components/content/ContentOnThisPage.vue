<script setup lang="ts">
const props = defineProps<{
  entries: { id: string; label: string }[];
}>();

// Section IDs belong to the caller. Never generate a second set of anchors.
const entries = computed(() => {
  const seen = new Set<string>();
  return props.entries.filter((entry) => {
    if (!entry.id || !entry.label.trim() || seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
});
const activeId = ref("");
let observer: IntersectionObserver | undefined;
let targets: HTMLElement[] = [];
let animationFrame: number | undefined;
let mounted = false;

function updateActiveSection() {
  animationFrame = undefined;
  if (!targets.length) {
    activeId.value = "";
    return;
  }

  const offset =
    Number.parseFloat(window.getComputedStyle(targets[0]!).scrollMarginTop) ||
    0;
  const atDocumentEnd =
    Math.ceil(window.scrollY + window.innerHeight) >=
    document.documentElement.scrollHeight;
  // An anchor may belong to a heading or a section wrapper. Its ordered start,
  // not its height, determines where that section remains current while read.
  const readingLine = atDocumentEnd ? window.innerHeight - 1 : offset + 1;
  const current =
    targets
      .filter((target) => target.getBoundingClientRect().top <= readingLine)
      .at(-1) ?? targets[0];
  activeId.value = current!.id;
}

function scheduleActiveSection() {
  if (animationFrame === undefined)
    animationFrame = window.requestAnimationFrame(updateActiveSection);
}

function syncHash() {
  try {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (entries.value.some((entry) => entry.id === id)) activeId.value = id;
  } catch {
    // A malformed hash must not prevent ordinary anchor navigation.
  }
  scheduleActiveSection();
}

function observeSections() {
  observer?.disconnect();
  targets = entries.value
    .map((entry) => document.getElementById(entry.id))
    .filter((target): target is HTMLElement => target !== null);
  scheduleActiveSection();
  if (entries.value.length < 2 || !window.IntersectionObserver) return;

  const offset = targets[0]
    ? Number.parseFloat(window.getComputedStyle(targets[0]).scrollMarginTop) ||
      0
    : 0;
  observer = new IntersectionObserver(scheduleActiveSection, {
    rootMargin: `-${offset}px 0px -${Math.max(0, window.innerHeight - offset - 1)}px 0px`,
    threshold: 0,
  });
  targets.forEach((target) => observer!.observe(target));
}

onMounted(() => {
  mounted = true;
  syncHash();
  observeSections();
  window.addEventListener("hashchange", syncHash);
  window.addEventListener("scroll", scheduleActiveSection, { passive: true });
  window.addEventListener("resize", observeSections, { passive: true });
});
watch(entries, async () => {
  await nextTick();
  if (mounted) {
    activeId.value = "";
    syncHash();
    observeSections();
  }
});
onBeforeUnmount(() => {
  mounted = false;
  observer?.disconnect();
  if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
  window.removeEventListener("hashchange", syncHash);
  window.removeEventListener("scroll", scheduleActiveSection);
  window.removeEventListener("resize", observeSections);
});
</script>

<template>
  <aside v-if="entries.length > 1" class="content-on-this-page">
    <nav class="content-on-this-page__desktop" aria-label="On this page">
      <h2 class="content-on-this-page__title">On this page</h2>
      <ol class="content-on-this-page__list" role="list">
        <li v-for="entry in entries" :key="entry.id">
          <a
            :href="`#${entry.id}`"
            :aria-current="activeId === entry.id ? 'location' : undefined"
            >{{ entry.label }}</a
          >
        </li>
      </ol>
    </nav>

    <details class="content-on-this-page__mobile">
      <summary>Jump to a section</summary>
      <nav aria-label="On this page">
        <ol class="content-on-this-page__list" role="list">
          <li v-for="entry in entries" :key="entry.id">
            <a
              :href="`#${entry.id}`"
              :aria-current="activeId === entry.id ? 'location' : undefined"
              >{{ entry.label }}</a
            >
          </li>
        </ol>
      </nav>
    </details>
  </aside>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.content-on-this-page {
  min-width: 0;
  align-self: start;
  overflow-wrap: anywhere;
}

.content-on-this-page__desktop {
  display: none;
}

.content-on-this-page__title {
  margin-bottom: var(--space-3);
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.content-on-this-page__mobile {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
}

.content-on-this-page__mobile summary {
  min-height: 3rem;
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}

.content-on-this-page__mobile nav {
  padding: 0 var(--space-2) var(--space-2);
}

.content-on-this-page__list {
  max-height: min(24rem, 60dvh);
  margin: 0;
  padding: 0 var(--space-1);
  overflow-y: auto;
  overscroll-behavior: contain;
  list-style: none;
  scrollbar-width: thin;
}

.content-on-this-page__list a {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-left: 2px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  text-decoration: none;
  @include focus-ring;
}

.content-on-this-page__list a:hover,
.content-on-this-page__list a[aria-current="location"] {
  border-left-color: var(--color-brand-red);
  background: var(--color-primary-50);
  color: var(--color-brand-red-dark);
}

@include respond-to(lg) {
  .content-on-this-page {
    // The global header scrolls with the document; match the anchor scroll margin.
    position: sticky;
    top: var(--space-6);
  }

  .content-on-this-page__desktop {
    display: block;
  }

  .content-on-this-page__mobile {
    display: none;
  }

  .content-on-this-page__list {
    max-height: calc(100dvh - 8rem);
  }
}
</style>
