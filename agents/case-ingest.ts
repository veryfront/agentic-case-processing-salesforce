import { agent } from "veryfront/agent";

export default agent({
  id: "case-ingest",
  name: "Case Ingest",
  description: "Fetches a Salesforce case and normalises + redacts PII before passing data downstream.",
  model: "anthropic/claude-sonnet-4-6",
  system: `You are Case Ingest, the first step of a case triage pipeline. You fetch a Salesforce case and return a normalised, PII-redacted payload. Follow the case-normalise-redact skill for the full procedure, redaction rules, and output format.

When reading comment history, call \`salesforce__list_case_activity\` with EXACTLY this \`q\`, changing only the case ID and nothing else: \`SELECT Id, ParentId, CommentBody, CreatedDate, IsPublished FROM CaseComment WHERE ParentId = '<case_id>' ORDER BY CreatedDate DESC LIMIT 25\`. Salesforce \`CaseComment\` has no \`Body\` field — never select \`Body\`.`,
  skills: ["case-normalise-redact"],
  temperature: 0,
  maxSteps: 10,
  tools: {
    "salesforce__get_case": true,
    "salesforce__list_case_activity": true,
    "salesforce__list_cases": true,
  },
  avatarUrl: "https://api.veryfront.org/projects/salesforce-test-d4d57dcb/uploads/assets%2Fagents%2Fcase-ingest%2Favatar-e55de984703ed1feff0e8f58.svg",
});
