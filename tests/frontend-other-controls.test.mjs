/**
 * Lightweight source-structure checks only, not an end-to-end browser test.
 * Guards against accidentally dropping the three conditional Other inputs.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const predictor = readFileSync(
  new URL("../app/pages/programs/mba/college-predictor.vue", import.meta.url),
  "utf8",
);
const abroad = readFileSync(
  new URL("../app/pages/programs/study-abroad/index.vue", import.meta.url),
  "utf8",
);

test("predictor exam rows include a named and required Other exam field", () => {
  assert.match(predictor, /v-if="entry\.exam === 'other'"/);
  assert.match(predictor, /:name="`exams\[\$\{index\}\]\[otherExamName\]`"/);
  assert.match(predictor, /function onExamChange\(entry: ExamEntry\)/);
  assert.match(predictor, /otherExamName: string/);
  assert.match(predictor, /id="`exam-other-\$\{entry\.id\}`"/);
});

test("predictor separates Other and Undecided and requires the Other detail", () => {
  assert.match(predictor, /<option value="other">Other<\/option>/);
  assert.match(predictor, /<option value="undecided">Undecided<\/option>/);
  assert.doesNotMatch(predictor, /other-undecided/);
  assert.match(predictor, /v-if="specialization === 'other'"/);
  assert.match(predictor, /name="otherSpecialization"/);
});

test("Study Abroad profile has a conditional and named Other study-level field", () => {
  assert.match(abroad, /v-if="studyLevel === 'other'"/);
  assert.match(abroad, /name="otherStudyLevel"/);
  assert.match(abroad, /function onStudyLevelChange\(\)/);
});
