<script setup lang="ts">
import MobileNavigation from "~~/app/components/navigation/MobileNavigation.vue";
import NavDropdown from "~~/app/components/navigation/NavDropdown.vue";
import { navigationGroups, primaryNavigation } from "~~/app/data/navigation";

const route = useRoute();

const headerRef = ref<HTMLElement | null>(null);
const mobileTriggerRef = ref<HTMLButtonElement | null>(null);
const activeDropdown = ref<string | null>(null);
const mobileOpen = ref(false);

let desktopMediaQuery: MediaQueryList | null = null;

function toggleDropdown(label: string) {
  activeDropdown.value = activeDropdown.value === label ? null : label;
}

function closeDropdowns() {
  activeDropdown.value = null;
}

function closeMobileNavigation(restoreFocus = false) {
  const wasOpen = mobileOpen.value;
  mobileOpen.value = false;

  if (restoreFocus && wasOpen) {
    nextTick(() => {
      mobileTriggerRef.value?.focus();
    });
  }
}

function toggleMobileNavigation() {
  closeDropdowns();
  mobileOpen.value = !mobileOpen.value;
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!headerRef.value?.contains(event.target as Node)) {
    closeDropdowns();
    closeMobileNavigation();
  }
}

function handleFocusIn(event: FocusEvent) {
  if (!headerRef.value?.contains(event.target as Node)) {
    closeDropdowns();
    closeMobileNavigation();
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key !== "Escape") return;

  closeDropdowns();

  if (mobileOpen.value) {
    closeMobileNavigation(true);
  }
}

function handleDesktopBreakpoint(event: MediaQueryListEvent | MediaQueryList) {
  if (!event.matches) return;

  // The browser may blur a link as soon as the mobile menu becomes hidden.
  // Capture the open state so focus still reaches visible navigation.
  const focusWasInMobile = mobileOpen.value;
  closeDropdowns();
  closeMobileNavigation();
  if (focusWasInMobile)
    nextTick(() =>
      headerRef.value?.querySelector<HTMLAnchorElement>(".site-brand")?.focus(),
    );
}

watch(
  () => route.fullPath,
  () => {
    closeDropdowns();
    closeMobileNavigation();
  },
);

watch(mobileOpen, (open) => {
  document.body.classList.toggle("nav-open", open);
});

onMounted(() => {
  document.addEventListener("pointerdown", handleDocumentPointerDown);
  document.addEventListener("keydown", handleEscape);
  document.addEventListener("focusin", handleFocusIn);

  desktopMediaQuery = window.matchMedia("(min-width: 64rem)");
  desktopMediaQuery.addEventListener("change", handleDesktopBreakpoint);

  handleDesktopBreakpoint(desktopMediaQuery);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handleDocumentPointerDown);
  document.removeEventListener("keydown", handleEscape);
  document.removeEventListener("focusin", handleFocusIn);
  desktopMediaQuery?.removeEventListener("change", handleDesktopBreakpoint);
  document.body.classList.remove("nav-open");
});
</script>

<template>
  <header ref="headerRef" class="site-header">
    <div class="container site-header__inner">
      <NuxtLink
        class="site-brand"
        to="/"
        aria-label="College FAQs home"
        @click="closeDropdowns"
      >
        <span class="site-brand__mark" aria-hidden="true">
          <img
            class="site-brand__logo"
            src="https://assets.collegefaqs.com/header/logo.jpeg"
            alt="CF"
            width="40"
            height="40"
          />
        </span>

        <span class="site-brand__text">
          <span class="site-brand__name">College FAQs</span>
          <span class="site-brand__tagline">Your College Repository</span>
        </span>
      </NuxtLink>

      <nav class="site-nav" aria-label="Primary navigation">
        <NuxtLink
          v-for="item in primaryNavigation"
          :key="item.to"
          class="site-nav__link"
          :to="item.to"
          :exact-active-class="
            item.to === '/' ? 'site-nav__link--active' : undefined
          "
          active-class="site-nav__link--active"
          @click="closeDropdowns"
        >
          {{ item.label }}
        </NuxtLink>

        <NavDropdown
          v-for="group in navigationGroups"
          :key="group.label"
          :label="group.label"
          :items="group.items"
          :open="activeDropdown === group.label"
          @toggle="toggleDropdown"
          @close="closeDropdowns"
        />
      </nav>

      <button
        ref="mobileTriggerRef"
        class="mobile-nav-trigger"
        type="button"
        aria-controls="mobile-site-navigation"
        :aria-expanded="mobileOpen"
        :aria-label="
          mobileOpen ? 'Close navigation menu' : 'Open navigation menu'
        "
        @click="toggleMobileNavigation"
      >
        <span class="mobile-nav-trigger__bar" />
        <span class="mobile-nav-trigger__bar" />
        <span class="mobile-nav-trigger__bar" />
      </button>
    </div>

    <MobileNavigation
      :open="mobileOpen"
      :primary-items="primaryNavigation"
      :groups="navigationGroups"
      @close="closeMobileNavigation()"
    />
  </header>
</template>
