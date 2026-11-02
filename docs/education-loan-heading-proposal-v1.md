# Education Loan heading proposal V1

Status: **APPROVED AND IMPLEMENTED — 1 November 2026 (Asia/Kolkata).** The user explicitly approved these exact five heading/paragraph splits in this remediation session. Only the five `title` and paragraph `text` pairs below were changed in the Education Loan data; the original source text is retained here as approval evidence.

At audit time, the five guidance cards in `app/data/content/explore/educationLoan.ts:89–139` repeated a combined heading/explanation as both their H3 and paragraph. The approved split keeps each explanation verbatim once, uses the existing short phrase as its heading, and retains every existing card ID and ordering. Numbering remains supplied by the existing list/marker, rather than being repeated in each paragraph. The generic content renderer was not changed.

| Card | Proposed exact heading       | Proposed exact paragraph                                                                                                                                                       |
| ---- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Understand Your Loan Options | Explore suitable loan options based on your course, college, admission status and estimated education cost.                                                                    |
| 2    | Check Basic Eligibility      | Understand common requirements such as academic records, admission confirmation, co-applicant details and applicable lender criteria.                                          |
| 3    | Prepare Your Documents       | Get guidance on commonly required documents such as admission letter, fee structure, academic certificates, identity/address proof and income documents.                       |
| 4    | Understand the Process       | Get clarity on application, document submission, verification, sanction and disbursement stages.                                                                               |
| 5    | Compare Before You Decide    | Understand key factors such as interest rate, processing charges, collateral requirements, repayment period, moratorium period and applicable terms before selecting a lender. |

## Original source text and preserved anchors

Each original paragraph is shown exactly as stored. Its original `title` is the same text after removing the leading number and period. The table above separates that existing short phrase from the explanation; it does not add a new claim.

1. Source `educationLoan.ts:89–95`; ID `understand-your-loan-options-explore-suitable-loan-options-based-on-your-course-college-admission-status-and-estimated-education-cost`:

   > 1. Understand Your Loan Options Explore suitable loan options based on your course, college, admission status and estimated education cost.

2. Source `educationLoan.ts:100–106`; ID `check-basic-eligibility-understand-common-requirements-such-as-academic-records-admission-confirmation-co-applicant-details-and-applicable-lender-criteria`:

   > 2. Check Basic Eligibility Understand common requirements such as academic records, admission confirmation, co-applicant details and applicable lender criteria.

3. Source `educationLoan.ts:111–117`; ID `prepare-your-documents-get-guidance-on-commonly-required-documents-such-as-admission-letter-fee-structure-academic-certificates-identity-address-proof-and-income-documents`:

   > 3. Prepare Your Documents Get guidance on commonly required documents such as admission letter, fee structure, academic certificates, identity/address proof and income documents.

4. Source `educationLoan.ts:122–128`; ID `understand-the-process-get-clarity-on-application-document-submission-verification-sanction-and-disbursement-stages`:

   > 4. Understand the Process Get clarity on application, document submission, verification, sanction and disbursement stages.

5. Source `educationLoan.ts:133–139`; ID `compare-before-you-decide-understand-key-factors-such-as-interest-rate-processing-charges-collateral-requirements-repayment-period-moratorium-period-and-applicable-terms-before-selecting-a-lender`:

   > 5. Compare Before You Decide Understand key factors such as interest rate, processing charges, collateral requirements, repayment period, moratorium period and applicable terms before selecting a lender.

## Approval and subsequent verification

The remediation prompt required content-owner approval for the exact five heading/paragraph pairs above. Explicit approval was received in this session on 1 November 2026; it was not inferred from permission to perform other remediation work.

The implementation is limited to these five `title` and paragraph `text` values. Compiled rendering and browser verification at 390px and 1440px must confirm that each explanation renders once and each concise heading remains semantic H3, with all five existing IDs unchanged. Verification results belong in the final remediation report. The original independent audit remains a historical record.
