<template>
  <div class="form-disclosure flow">
    <p>
      Fields marked * are required. Online submission is not enabled yet, so the
      information entered here is not sent or saved.
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
