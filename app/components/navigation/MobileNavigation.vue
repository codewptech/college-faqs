<script setup lang="ts">
import type { NavigationGroup, NavigationItem } from '~~/app/data/navigation'

const props = defineProps<{
  open: boolean
  primaryItems: NavigationItem[]
  groups: NavigationGroup[]
}>()

const emit = defineEmits<{
  close: []
}>()

const expandedGroup = ref<string | null>(null)
const route = useRoute()
const groupId = (label: string) => `mobile-nav-${label.toLowerCase().replace(/\s+/g, '-')}`

function toggleGroup(label: string) {
  expandedGroup.value = expandedGroup.value === label ? null : label
}

watch(
  () => props.open,
  (open) => {
    if (!open) expandedGroup.value = null
  },
)
</script>

<template>
  <div v-show="open" id="mobile-site-navigation" class="mobile-nav">
    <nav class="container mobile-nav__inner" aria-label="Mobile navigation">
      <NuxtLink
        v-for="item in primaryItems"
        :key="item.to"
        class="mobile-nav__link"
        :to="item.to"
        @click="emit('close')"
      >
        {{ item.label }}
      </NuxtLink>

      <div v-for="group in groups" :key="group.label" class="mobile-nav__group">
        <button
          class="mobile-nav__link mobile-nav__toggle"
          type="button"
          :aria-expanded="expandedGroup === group.label"
          :aria-controls="groupId(group.label)"
          @click="toggleGroup(group.label)"
        >
          <span>{{ group.label }}</span>
          <svg
            class="mobile-nav__chevron"
            :class="{ 'mobile-nav__chevron--open': expandedGroup === group.label }"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="m5.5 7.5 4.5 4.5 4.5-4.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
          </svg>
        </button>

        <div v-show="expandedGroup === group.label" :id="groupId(group.label)" class="mobile-nav__submenu">
          <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            class="mobile-nav__sublink"
            :to="item.to"
            :class="{ 'router-link-active': route.path === item.to || route.path.startsWith(`${item.to}/`) }"
            @click="emit('close')"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>
