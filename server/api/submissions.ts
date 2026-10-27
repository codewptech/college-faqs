import { createSubmissionHandler } from "../utils/submission-http";
import { createSubmissionService } from "../utils/submission-service";
import { persistSubmission } from "../utils/submission-storage";

// One allowlisted entry point; there is deliberately no enquiry retrieval API.
export default createSubmissionHandler(
  createSubmissionService({
    persist: persistSubmission,
    expectedOrigin: () => process.env.SUBMISSIONS_ORIGIN,
  }),
);
