<script setup lang="ts">
import { onMounted, ref } from "vue";

// Keep SSR and the first client render inactive until Vue owns form events.
const ready = ref(false);
onMounted(() => {
  ready.value = true;
});
</script>

<template>
  <fieldset class="form-availability" :disabled="!ready">
    <p v-if="!ready" class="form-help" role="status">
      This enquiry form becomes available when the page finishes loading.
    </p>
    <noscript>
      <p class="form-help">
        JavaScript is required to send an enquiry. Enable JavaScript and reload
        this page to use the form.
      </p>
    </noscript>
    <slot />
  </fieldset>
</template>

<style scoped>
.form-availability {
  display: grid;
  min-width: 0;
  gap: inherit;
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
