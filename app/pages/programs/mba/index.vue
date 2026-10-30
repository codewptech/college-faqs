<script setup lang="ts">
import MbaToolCard from "~~/app/components/mba/MbaToolCard.vue";

useSeoMeta({
  title: "MBA Admission Guidance & Tools | College FAQs",
  description:
    "Explore MBA admission guidance, mentor support, college predictor, applications, college updates, coupons, and GDPI preparation with College FAQs.",
});

const quickActions = [
  {
    title: "Talk to Mentor",
    description: "Discuss your MBA plans and questions with a mentor.",
    to: "/programs/mba/talk-to-mentor",
    icon: "💬",
  },
  {
    title: "College Predictor",
    description: "Organize your entrance exam results and college preferences.",
    to: "/programs/mba/college-predictor",
    icon: "◎",
  },
  {
    title: "Application Form",
    description:
      "Start or share the information required for MBA applications.",
    to: "/programs/mba/application-form",
    icon: "▤",
  },
  {
    title: "Coupons",
    description:
      "Open the offers area for any verified items that are published.",
    to: "/programs/mba/coupons",
    icon: "%",
  },
  {
    title: "College Updates",
    description:
      "Open the updates area for verified admission notices when published.",
    to: "/programs/mba/college-updates",
    icon: "↗",
  },
];

const admissionTools = [
  ...quickActions,
  {
    title: "GDPI Preparation",
    description:
      "Prepare for group discussions, personal interviews, and selection rounds.",
    to: "/programs/mba/gdpi-preparation",
    icon: "✦",
    featured: true,
  },
];

const decisionPoints = [
  "Program fit and specialization options",
  "Fees, financing, and expected return on investment",
  "Location, campus environment, and peer group",
  "Placement context and career opportunities",
];
</script>

<template>
  <div class="mba-page">
    <section class="mba-hero section">
      <div class="container mba-hero__grid">
        <div class="mba-hero__content flow">
          <p class="mba-eyebrow">MBA admissions</p>
          <h1>Make your MBA admission journey easier to understand.</h1>
          <p class="mba-hero__lead">
            Explore practical MBA guidance, admission tools, application
            support, college updates, and personal counselling when you need it.
          </p>
          <div class="mba-hero__actions">
            <NuxtLink
              class="btn btn--primary btn--lg"
              to="/programs/mba/talk-to-mentor"
            >
              Talk to a mentor
            </NuxtLink>
            <a class="btn btn--secondary btn--lg" href="#mba-tools"
              >Explore MBA tools</a
            >
          </div>
          <p class="mba-hero__note">
            Explore first. Discuss your situation when you need personal
            guidance.
          </p>
        </div>

        <div class="mba-hero__visual" aria-hidden="true">
          <img
            src="https://assets.collegefaqs.com/mba/hero-image.png"
            alt=""
            width="760"
            height="600"
          />
        </div>
      </div>
    </section>

    <section
      class="mba-quick section section--compact"
      aria-labelledby="quick-actions-title"
    >
      <div class="container">
        <div class="mba-section-heading mba-section-heading--compact">
          <div class="flow">
            <p class="mba-eyebrow">Start here</p>
            <h2 id="quick-actions-title">What would you like help with?</h2>
          </div>
          <p>
            Jump directly to the MBA tool or support area that matches your
            current need.
          </p>
        </div>

        <div class="mba-quick__grid">
          <NuxtLink
            v-for="item in quickActions"
            :key="item.to"
            class="mba-quick-link"
            :to="item.to"
          >
            <span class="mba-quick-link__icon" aria-hidden="true">{{
              item.icon
            }}</span>
            <span>{{ item.title }}</span>
            <span class="mba-quick-link__arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section
      id="mba-tools"
      class="section mba-tools"
      aria-labelledby="mba-tools-title"
    >
      <div class="container">
        <div class="mba-section-heading">
          <div class="flow">
            <p class="mba-eyebrow">Counselling & admission tools</p>
            <h2 id="mba-tools-title">
              Practical support across different stages of MBA admission.
            </h2>
          </div>
          <p>
            You do not need every tool at once. Use the one that helps with the
            decision or task currently in front of you.
          </p>
        </div>

        <div class="mba-tools__grid">
          <MbaToolCard
            v-for="tool in admissionTools"
            :key="tool.to"
            v-bind="tool"
          />
        </div>
      </div>
    </section>

    <section class="section mba-choice" aria-labelledby="mba-choice-title">
      <div class="container mba-choice__panel">
        <div class="mba-choice__content flow">
          <p class="mba-eyebrow">Choosing the right college</p>
          <h2 id="mba-choice-title">
            A college decision deserves more than one ranking or one
            recommendation.
          </h2>
          <p>
            The right MBA option depends on your goals, budget, exam
            performance, preferred specialization, location, and the kind of
            outcome you expect from the program.
          </p>
          <NuxtLink
            class="btn btn--primary btn--lg"
            to="/programs/mba/start-your-application"
          >
            Let’s start your application
          </NuxtLink>
        </div>

        <ul class="mba-choice__list" role="list">
          <li v-for="point in decisionPoints" :key="point">
            <span aria-hidden="true">✓</span>
            {{ point }}
          </li>
        </ul>
      </div>
    </section>

    <section
      class="section mba-final-cta"
      aria-labelledby="mba-final-cta-title"
    >
      <div class="container">
        <div class="mba-final-cta__panel">
          <div class="flow">
            <p class="mba-eyebrow mba-eyebrow--light">
              Need personal guidance?
            </p>
            <h2 id="mba-final-cta-title">
              Discuss your MBA questions with a mentor.
            </h2>
            <p>
              Start with the questions you already have. You can explore your
              options before deciding what to do next.
            </p>
          </div>
          <div class="mba-final-cta__actions">
            <NuxtLink
              class="btn btn--secondary btn--lg"
              to="/programs/mba/talk-to-mentor"
              >Talk to Mentor</NuxtLink
            >
            <NuxtLink
              class="mba-final-cta__link"
              to="/programs/mba/college-predictor"
              >Open College Predictor
              <span aria-hidden="true">→</span></NuxtLink
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "~~/app/assets/scss/abstracts/mixins" as *;

.mba-page {
  overflow: clip;
}
.mba-eyebrow {
  color: var(--color-brand-red);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.mba-eyebrow--light {
  color: var(--color-gray-200);
}

.mba-hero {
  background: var(--color-white);
}
.mba-hero__grid {
  display: grid;
  align-items: center;
  gap: var(--space-10);
}
.mba-hero__content {
  --flow-space: var(--space-6);
  max-width: 46rem;
}
.mba-hero__lead {
  max-width: 42rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}
.mba-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
.mba-hero__note {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
.mba-hero__visual {
  max-width: 39rem;
  margin-inline: auto;
  background: var(--color-white);
}
.mba-hero__visual img {
  width: 100%;
  height: auto;
}

.mba-section-heading {
  display: grid;
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}
.mba-section-heading > div {
  max-width: 46rem;
}
.mba-section-heading > p {
  max-width: 40rem;
  color: var(--color-text-secondary);
}
.mba-section-heading--compact {
  margin-bottom: var(--space-8);
}

.mba-quick {
  background: var(--color-white);
}
.mba-quick__grid {
  display: grid;
  gap: var(--space-3);
}
.mba-quick-link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}
.mba-quick-link:hover,
.mba-quick-link:focus-visible {
  border-color: var(--color-primary-600);
  background: var(--color-primary-50);
  color: var(--color-text);
  text-decoration: none;
}
.mba-quick-link__icon {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border-radius: var(--radius-sm);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}
.mba-quick-link__arrow {
  color: var(--color-primary-700);
}

.mba-tools {
  background: var(--color-gray-50);
}
.mba-tools__grid {
  display: grid;
  gap: var(--space-5);
}

.mba-choice {
  background: var(--color-white);
}
.mba-choice__panel {
  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-gray-50);
  box-shadow: var(--shadow-sm);
}
.mba-choice__content {
  --flow-space: var(--space-5);
  max-width: 46rem;
}
.mba-choice__content p:not(.mba-eyebrow) {
  color: var(--color-text-secondary);
}
.mba-choice__list {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.mba-choice__list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
  align-items: start;
  color: var(--color-text-secondary);
}
.mba-choice__list span {
  display: grid;
  width: 1.5rem;
  height: 1.5rem;
  place-items: center;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-primary-800);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.mba-final-cta {
  padding-top: 0;
  background: var(--color-gray-50);
}
.mba-final-cta__panel {
  --color-focus: var(--color-gray-100);
  display: grid;
  gap: var(--space-8);
  padding: var(--space-8);
  border-top: 3px solid var(--color-brand-red);
  border-radius: var(--radius-xl);
  background: var(--color-surface-dark);
  color: var(--color-white);
}
.mba-final-cta__panel > div:first-child {
  max-width: 46rem;
}
.mba-final-cta__panel h2 {
  color: var(--color-white);
}
.mba-final-cta__panel p:not(.mba-eyebrow) {
  color: var(--color-gray-200);
}
.mba-final-cta__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-5);
}
.mba-final-cta__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
}
.mba-final-cta__link:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

@include respond-to(sm) {
  .mba-quick__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include respond-to(md) {
  .mba-hero__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.95fr);
  }
  .mba-section-heading {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.72fr);
    align-items: end;
  }
  .mba-tools__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .mba-choice__panel {
    grid-template-columns: minmax(0, 1.1fr) minmax(17rem, 0.7fr);
    align-items: center;
    padding: var(--space-10);
  }
  .mba-final-cta__panel {
    padding: var(--space-10);
  }
}

@include respond-to(lg) {
  .mba-final-cta__panel {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }

  .mba-hero__grid {
    gap: var(--space-16);
  }
  .mba-quick__grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .mba-quick-link {
    grid-template-columns: 1fr;
    align-content: start;
    min-height: 10rem;
  }
  .mba-quick-link__arrow {
    margin-top: auto;
  }
  .mba-tools__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
