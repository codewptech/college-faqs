<script setup lang="ts">
import type { SubmissionIssue } from "../../../shared/submission-contracts";

defineProps<{
  pending: boolean;
  error: string;
  issues: SubmissionIssue[];
}>();
</script>

<template>
  <div class="submission-feedback">
    <div hidden aria-hidden="true">
      <label
        >Leave this field empty
        <input
          name="submissionTrap"
          type="text"
          tabindex="-1"
          autocomplete="off"
      /></label>
    </div>
    <p v-if="pending" role="status">Saving your enquiry…</p>
    <div v-if="error" class="form-error" role="alert">
      <p>{{ error }}</p>
      <ul v-if="issues.length">
        <li v-for="(issue, index) in issues" :key="index">
          {{ issue.message }}
        </li>
      </ul>
    </div>
  </div>
</template>
