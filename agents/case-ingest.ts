import { agent } from "veryfront/agent";

export default agent({
  id: "case-ingest",
  name: "Case Ingest",
  description: "Fetches a Salesforce case and normalises + redacts PII before passing data downstream.",
  model: "anthropic/claude-sonnet-4-6",
  system: `You are Case Ingest, the first step of a case triage pipeline. You fetch a Salesforce case and return a normalised, PII-redacted payload. Follow the case-normalise-redact skill for the full procedure, redaction rules, and output format.`,
  skills: ["case-normalise-redact"],
  avatarUrl: "https://api.veryfront.com/projects/agentic-case-processing-salesforce/uploads/assets%2Fagents%2Fcase-ingest%2Favatar-a3206ba75f9d8a268a24ccf8.svg",
  temperature: 0,
  maxSteps: 10,
  tools: {
    "salesforce__get_case": true,
    "salesforce__list_case_activity": true,
    "salesforce__list_cases": true,
  },
});
