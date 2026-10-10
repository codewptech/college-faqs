<script setup lang="ts">
import type { NavigationItem } from '~~/app/data/navigation'

const props = defineProps<{
  label: string
  items: NavigationItem[]
  open: boolean
}>()

const emit = defineEmits<{
  toggle: [label: string]
  close: []
}>()

const menuId = computed(() => `nav-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
const triggerRef = ref<HTMLButtonElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const route = useRoute()
const active = computed(() => props.items.some((item) => route.path === item.to || route.path.startsWith(`${item.to}/`)))

function handleFocusOut(event: FocusEvent) {
  if (!dropdownRef.value?.contains(event.relatedTarget as Node | null)) emit('close')
}

async function focusFirstLink() {
  if (!props.open) emit('toggle', props.label)
  await nextTick()
  dropdownRef.value?.querySelector<HTMLAnchorElement>('.nav-dropdown__item')?.focus()
}

function closeAndRestoreFocus() {
  emit('close')
  nextTick(() => triggerRef.value?.focus())
}
</script>

<template>
  <div ref="dropdownRef" class="nav-dropdown" :class="{ 'nav-dropdown--open': open }" @focusout="handleFocusOut">
    <button
      ref="triggerRef"
      class="site-nav__link nav-dropdown__trigger"
      :class="{ 'site-nav__link--active': active }"
      type="button"
      :aria-expanded="open"
      :aria-controls="menuId"
      @click="emit('toggle', label)"
      @keydown.esc.stop="closeAndRestoreFocus"
      @keydown.down.prevent="focusFirstLink"
    >
      <span>{{ label }}</span>
      <svg class="nav-dropdown__chevron" viewBox="0 0 20 20" aria-hidden="true">
        <path d="m5.5 7.5 4.5 4.5 4.5-4.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" />
      </svg>
    </button>

    <div v-show="open" :id="menuId" class="nav-dropdown__menu" @keydown.esc.stop="closeAndRestoreFocus">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        class="nav-dropdown__item"
        :to="item.to"
        :class="{ 'router-link-active': route.path === item.to || route.path.startsWith(`${item.to}/`) }"
        @click="emit('close')"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </div>
</template>
