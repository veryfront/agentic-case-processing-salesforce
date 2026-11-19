import { schedule } from "veryfront/schedule";

export default schedule({
  id: "triage-new-cases",
  name: "Triage new cases",
  schedule: "*/10 * * * *",
  timezone: "Europe/Berlin",
  target: { kind: "agent", id: "case-triage", conversationMode: "create_new" },
  agentMessage: { prompt: "Triage the open cases that have not been triaged yet." },
  concurrencyPolicy: "Forbid",
  timeoutSeconds: 540,
  integrationRequirements: [{ integration: "salesforce" }],
});
