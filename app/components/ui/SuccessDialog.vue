<script setup lang="ts">
import { useId } from "vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    message?: string;
    actionLabel?: string;
  }>(),
  {
    title: "Enquiry saved",
    message: "Your enquiry has been saved successfully.",
    actionLabel: "Done",
  },
);

const emit = defineEmits<{
  close: [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);
const dialogId = useId();
const titleId = `${dialogId}-title`;
const messageId = `${dialogId}-message`;
let returnFocus: HTMLElement | null = null;
let submitter: HTMLElement | null = null;

function rememberSubmitter(event: SubmitEvent) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.getAttribute("aria-busy") === "true") return;
  submitter = event.submitter instanceof HTMLElement ? event.submitter : null;
}

function forgetSubmitter(event: Event) {
  if (event.target !== submitter) submitter = null;
}

function syncDialog() {
  const dialog = dialogRef.value;

  if (!dialog) return;

  if (props.open && !dialog.open) {
    returnFocus =
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
        ? document.activeElement
        : submitter;
    submitter = null;
    dialog.showModal();
    document.body.classList.add("dialog-open");
    return;
  }

  if (!props.open && dialog.open) {
    dialog.close();
  }
}

function closeDialog() {
  if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
}

function handleNativeClose() {
  document.body.classList.remove("dialog-open");
  if (!document.querySelector("dialog[open]") && returnFocus?.isConnected) {
    returnFocus.focus();
  }
  returnFocus = null;
  emit("close");
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    closeDialog();
  }
}

watch(
  () => props.open,
  () => {
    nextTick(syncDialog);
  },
);

onMounted(() => {
  document.addEventListener("submit", rememberSubmitter, true);
  document.addEventListener("focusin", forgetSubmitter, true);
  document.addEventListener("pointerdown", forgetSubmitter, true);
  syncDialog();
});

onBeforeUnmount(() => {
  document.removeEventListener("submit", rememberSubmitter, true);
  document.removeEventListener("focusin", forgetSubmitter, true);
  document.removeEventListener("pointerdown", forgetSubmitter, true);
  submitter = null;
  if (dialogRef.value?.open) dialogRef.value.close();
  document.body.classList.remove("dialog-open");
});
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="success-dialog"
      :aria-labelledby="titleId"
      :aria-describedby="messageId"
      @close="handleNativeClose"
      @click="handleBackdropClick"
    >
      <div class="success-dialog__panel">
        <button
          class="success-dialog__close"
          type="button"
          aria-label="Close dialog"
          @click="closeDialog"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div class="success-dialog__icon" aria-hidden="true">✓</div>

        <div class="success-dialog__content">
          <h2 :id="titleId">
            {{ title }}
          </h2>

          <p :id="messageId">
            {{ message }}
          </p>
        </div>

        <div class="success-dialog__actions">
          <button class="btn btn--primary" type="button" @click="closeDialog">
            {{ actionLabel }}
          </button>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
