<template>
  <div class="form-disclosure flow">
    <p>
      Fields marked * are required. Submitting this form sends your information
      to College FAQs and saves it so your enquiry can be reviewed.
    </p>
    <p>
      Please read our
      <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink> and
      <NuxtLink to="/terms-and-conditions">Terms &amp; Conditions</NuxtLink>.
    </p>
  </div>
</template>

<style scoped lang="scss">
.form-disclosure {
  --flow-space: var(--space-2);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.form-disclosure a {
  color: inherit;
  text-decoration: underline;
}
</style>
