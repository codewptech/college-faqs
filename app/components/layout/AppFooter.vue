<script setup lang="ts">
import {
  legalNavigation,
  navigationGroups,
  primaryNavigation,
} from "~~/app/data/navigation";

// Change only this URL when you want to replace the footer logo.
// The initial URL matches the current Header logo.
const footerLogoUrl = "https://assets.collegefaqs.com/logo.jpeg";

// Keep the brand usable if the image URL fails to load.
const footerLogoFailed = ref(false);

const currentYear = new Date().getFullYear();

const programs = computed(() => {
  return (
    navigationGroups.find((group) => group.label === "Programs")?.items ?? []
  );
});

const explore = computed(() => {
  return (
    navigationGroups.find((group) => group.label === "Explore")?.items ?? []
  );
});
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__main">
      <div class="site-footer__brand-column">
        <NuxtLink
          class="site-footer__brand"
          to="/"
          aria-label="College FAQs home"
        >
          <span
            class="site-footer__brand-mark"
            :class="{ 'site-footer__brand-mark--fallback': footerLogoFailed }"
            aria-hidden="true"
          >
            <span v-if="footerLogoFailed" class="site-footer__brand-fallback">
              CF
            </span>
            <img
              v-else
              class="site-footer__brand-logo"
              :src="footerLogoUrl"
              alt=""
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
              @error="footerLogoFailed = true"
            />
          </span>

          <span class="site-footer__brand-text">
            <span class="site-footer__brand-name">College FAQs</span>
            <span class="site-footer__brand-tagline">
              Your College Repository
            </span>
          </span>
        </NuxtLink>

        <p class="site-footer__description">
          Explore practical information and guidance for MBA, Engineering, and
          Study Abroad decisions.
        </p>
      </div>

      <div class="site-footer__navigation">
        <nav class="site-footer__group" aria-labelledby="footer-programs-title">
          <h2 id="footer-programs-title" class="site-footer__heading">
            Programs
          </h2>

          <ul class="site-footer__links" role="list">
            <li v-for="item in programs" :key="item.to">
              <NuxtLink class="site-footer__link" :to="item.to">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav class="site-footer__group" aria-labelledby="footer-explore-title">
          <h2 id="footer-explore-title" class="site-footer__heading">
            Explore
          </h2>

          <ul class="site-footer__links" role="list">
            <li v-for="item in explore" :key="item.to">
              <NuxtLink class="site-footer__link" :to="item.to">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav class="site-footer__group" aria-labelledby="footer-company-title">
          <h2 id="footer-company-title" class="site-footer__heading">
            College FAQs
          </h2>

          <ul class="site-footer__links" role="list">
            <li v-for="item in primaryNavigation" :key="item.to">
              <NuxtLink class="site-footer__link" :to="item.to">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="site-footer__bottom">
      <div class="container site-footer__bottom-inner">
        <p class="site-footer__copyright">
          © {{ currentYear }} College FAQs. All rights reserved.
        </p>

        <nav aria-label="Legal navigation">
          <ul class="site-footer__legal" role="list">
            <li v-for="item in legalNavigation" :key="item.to">
              <NuxtLink class="site-footer__legal-link" :to="item.to">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="site-footer__credit">
      <div class="container site-footer__credit-inner">
        <p class="site-footer__credit-text">
          Designed &amp; developed by
          <a
            class="site-footer__credit-link"
            href="https://www.webphin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Webphin
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>
