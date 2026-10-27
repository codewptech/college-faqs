import { ref } from "vue";
import type { SubmissionIssue } from "../../shared/submission-contracts";

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Shared native validation and accessible focus handling for the existing forms. */
export function useFormPreview() {
  const formRef = ref<HTMLFormElement | null>(null);
  const errors = ref<Record<string, string>>({});

  function controls() {
    return Array.from(
      formRef.value?.querySelectorAll<FormControl>("input, select, textarea") ??
        [],
    );
  }

  function clearErrors(...ids: string[]) {
    const nextErrors = { ...errors.value };

    for (const id of ids) {
      delete nextErrors[id];
      controls()
        .find((control) => control.id === id)
        ?.setCustomValidity("");
    }

    errors.value = nextErrors;
  }

  function clearError(event: Event) {
    const target = event.target;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    ) {
      clearErrors(target.id);
    }
  }

  function validate(customErrors: Record<string, string> = {}) {
    const form = formRef.value;
    if (!form) return false;

    const nextErrors: Record<string, string> = {};
    let firstInvalid: FormControl | undefined;

    for (const control of controls()) {
      const blankRequiredText =
        control.required && control.type !== "file" && !control.value.trim();
      control.setCustomValidity(
        customErrors[control.id] ||
          (blankRequiredText ? "Please complete this field." : ""),
      );

      if (!control.validity.valid) {
        nextErrors[control.id] = control.validationMessage;
        firstInvalid ??= control;
      }
    }

    errors.value = nextErrors;

    if (firstInvalid) {
      firstInvalid.focus();
      form.reportValidity();
      return false;
    }

    return true;
  }

  function applyIssues(issues: SubmissionIssue[]) {
    const customErrors: Record<string, string> = {};
    const available = controls();
    for (const issue of issues) {
      const fieldName = issue.field.replace(/\.([^.[\]]+)/g, "[$1]");
      const control =
        available.find((item) => item.name === fieldName) ??
        available.find((item) => item.name.startsWith(`${fieldName}[`));
      if (control?.id && !customErrors[control.id]) {
        customErrors[control.id] = issue.message;
      }
    }
    validate(customErrors);
  }

  return { formRef, errors, validate, clearError, clearErrors, applyIssues };
}

export function hasNumericValue(value: string | number | null | undefined) {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "" &&
    Number.isFinite(Number(value))
  );
}
