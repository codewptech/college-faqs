<script setup lang="ts">
import ProgramCard from "~~/app/components/home/ProgramCard.vue";

useSeoMeta({
  title: "College FAQs | MBA, Engineering & Study Abroad Guidance",
  description:
    "Explore practical guidance for MBA, Engineering, and Study Abroad decisions with College FAQs — Your College Repository.",
});

const programs = [
  {
    title: "MBA",
    description:
      "Explore MBA options, admission support, application guidance, and resources for making a confident management education decision.",
    to: "/programs/mba",
    image: "/placeholders/program-mba.svg",
    imageAlt: "",
  },
  {
    title: "Engineering",
    description:
      "Understand engineering pathways, compare options, and explore the information you need before making an admission decision.",
    to: "/programs/engineering",
    image: "/placeholders/program-engineering.svg",
    imageAlt: "",
  },
  {
    title: "Study Abroad",
    description:
      "Start with practical guidance on destinations, profile evaluation, applications, and planning your study abroad journey.",
    to: "/programs/study-abroad",
    image: "/placeholders/program-study-abroad.svg",
    imageAlt: "",
  },
];

const supportItems = [
  {
    number: "01",
    title: "Understand your options",
    description:
      "Start with clear information that helps you make sense of programs, colleges, and the decisions ahead.",
  },
  {
    number: "02",
    title: "Get personal guidance",
    description:
      "When information alone is not enough, connect with a mentor and discuss your situation more directly.",
  },
  {
    number: "03",
    title: "Navigate applications",
    description:
      "Use practical support for application forms, documentation, and the steps involved in the admission process.",
  },
  {
    number: "04",
    title: "Stay informed",
    description:
      "Use guides, updates, FAQs, and related resources to keep important admission information within reach.",
  },
];

const resources = [
  {
    title: "Admission Guide",
    description:
      "A practical starting point for understanding the admission journey and the decisions involved.",
    to: "/explore/admission-guide",
  },
  {
    title: "Education Loan",
    description:
      "Explore the role of education loans and the key points to consider while planning your finances.",
    to: "/explore/education-loan",
  },
  {
    title: "FAQs",
    description:
      "Find clear answers to common questions students and families ask during the admission process.",
    to: "/explore/faqs",
  },
];
</script>

<template>
  <div class="home-page">
    <section class="home-hero section">
      <div class="container home-hero__grid">
        <div class="home-hero__content flow">
          <p class="home-eyebrow">Your College Repository</p>

          <h1>Practical guidance for your next college decision.</h1>

          <p class="home-hero__lead">
            Explore MBA, Engineering, and Study Abroad pathways, understand your
            options, and get support when you need help moving forward.
          </p>

          <div class="home-hero__actions">
            <a class="btn btn--primary btn--lg" href="#programs">
              Explore programs
            </a>

            <NuxtLink class="btn btn--secondary btn--lg" to="/about">
              About College FAQs
            </NuxtLink>
          </div>

          <p class="home-hero__note">
            Information first. Personal guidance when you need it.
          </p>
        </div>

        <div class="home-hero__visual" aria-hidden="true">
          <img
            src="/placeholders/home-hero.svg"
            alt=""
            width="760"
            height="600"
          />
        </div>
      </div>
    </section>

    <section
      id="programs"
      class="section home-programs"
      aria-labelledby="programs-title"
    >
      <div class="container">
        <div class="home-section-heading">
          <div class="flow">
            <p class="home-eyebrow">Explore programs</p>
            <h2 id="programs-title">Choose the path you want to explore.</h2>
          </div>

          <p>
            Start with the area that matches your current goal. Each program
            section will bring together guidance, tools, and relevant admission
            support.
          </p>
        </div>

        <div class="home-programs__grid">
          <ProgramCard
            v-for="program in programs"
            :key="program.to"
            v-bind="program"
          />
        </div>
      </div>
    </section>

    <section class="section home-support" aria-labelledby="support-title">
      <div class="container home-support__layout">
        <div class="home-support__intro flow">
          <p class="home-eyebrow">How College FAQs helps</p>
          <h2 id="support-title">
            Useful information, followed by practical support.
          </h2>
          <p>
            College decisions often involve more than finding a list of
            institutions. The aim is to make the process easier to understand
            and easier to act on.
          </p>
        </div>

        <ol class="home-support__list" role="list">
          <li
            v-for="item in supportItems"
            :key="item.number"
            class="home-support__item"
          >
            <span
              class="home-support__number number-badge"
              aria-hidden="true"
              >{{ item.number }}</span
            >
            <div class="flow">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section home-resources" aria-labelledby="resources-title">
      <div class="container">
        <div class="home-section-heading">
          <div class="flow">
            <p class="home-eyebrow">Explore resources</p>
            <h2 id="resources-title">
              Start with the question in front of you.
            </h2>
          </div>

          <p>
            Use the Explore section when you need focused information beyond a
            single program.
          </p>
        </div>

        <div class="home-resources__grid">
          <NuxtLink
            v-for="resource in resources"
            :key="resource.to"
            class="home-resource-card"
            :to="resource.to"
          >
            <div class="flow">
              <h3>{{ resource.title }}</h3>
              <p>{{ resource.description }}</p>
            </div>
            <span class="home-resource-card__arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section home-cta" aria-labelledby="home-cta-title">
      <div class="container">
        <div class="home-cta__panel">
          <div class="flow">
            <p class="home-eyebrow home-eyebrow--light">
              Not sure where to begin?
            </p>
            <h2 id="home-cta-title">
              Start with the program closest to your current goal.
            </h2>
            <p>
              You can explore first and move toward personal guidance when you
              are ready.
            </p>
          </div>

          <div class="home-cta__actions">
            <a class="btn btn--secondary btn--lg" href="#programs">
              Browse programs
            </a>
            <NuxtLink class="home-cta__text-link" to="/about">
              Learn about College FAQs
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.home-page {
  overflow: clip;
}

.home-eyebrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-eyebrow--light {
  color: var(--color-primary-100);
}

.home-hero {
  background:
    radial-gradient(
      circle at 85% 15%,
      rgb(219 234 254 / 0.9),
      transparent 32rem
    ),
    linear-gradient(180deg, var(--color-white), var(--color-gray-50));
}

.home-hero__grid {
  display: grid;
  align-items: center;
  gap: var(--space-10);
}

.home-hero__content {
  --flow-space: var(--space-6);
  max-width: 44rem;
}

.home-hero__lead {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.home-hero__note {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.home-hero__visual {
  max-width: 38rem;
  justify-self: center;
}

.home-hero__visual img {
  width: 100%;
  height: auto;
}

.home-section-heading {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}

.home-section-heading > p {
  color: var(--color-text-muted);
}

.home-programs__grid,
.home-resources__grid {
  display: grid;
  gap: var(--space-6);
}

.home-support {
  background: var(--color-surface-subtle);
}

.home-support__layout {
  display: grid;
  gap: var(--space-10);
}

.home-support__intro {
  --flow-space: var(--space-5);
}

.home-support__intro p:last-child,
.home-support__item p,
.home-resource-card p,
.home-cta p {
  color: var(--color-text-muted);
}

.home-support__list {
  display: grid;
  gap: var(--space-4);
  list-style: none;
}

.home-support__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.home-support__number {
  align-self: start;
}

.home-support__item h3,
.home-resource-card h3 {
  font-size: var(--font-size-xl);
}

.home-resource-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-5);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text);
  text-decoration: none;
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);
}

.home-resource-card:hover {
  border-color: var(--color-gray-400);
  color: var(--color-text);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.home-resource-card__arrow {
  color: var(--color-primary-700);
  font-size: var(--font-size-2xl);
  line-height: 1;
}

.home-cta {
  padding-top: 0;
}

.home-cta__panel {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  background: var(--color-gray-900);
  color: var(--color-white);
  box-shadow: var(--shadow-lg);
}

.home-cta__panel h2,
.home-cta__panel p {
  color: inherit;
}

.home-cta__panel p {
  opacity: 0.78;
}

.home-cta__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-5);
}

.home-cta__text-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}

.home-cta__text-link:hover {
  color: var(--color-primary-100);
  text-decoration: underline;
}

@include respond-to(md) {
  .home-section-heading {
    grid-template-columns: minmax(0, 1.4fr) minmax(16rem, 0.6fr);
    align-items: end;
  }

  .home-programs__grid,
  .home-resources__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .home-cta__panel {
    grid-template-columns: minmax(0, 1.4fr) auto;
    align-items: center;
    padding: var(--space-10);
  }

  .home-cta__actions {
    justify-content: flex-end;
  }
}

@include respond-to(lg) {
  .home-hero__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(24rem, 0.95fr);
    gap: var(--space-16);
  }

  .home-support__layout {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-16);
  }

  .home-support__intro {
    position: sticky;
    top: calc(var(--header-height) + var(--space-8));
    align-self: start;
  }
}
</style>
