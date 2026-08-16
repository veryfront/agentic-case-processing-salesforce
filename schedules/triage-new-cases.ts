import { schedule } from "veryfront/schedule";

// Runs the case-triage agent unattended so new open cases are triaged without a
// person kicking off each run. Adjust the cron expression or timezone to fit
// your support hours; push the project to activate it.
//
// case-triage delegates each pipeline step with `invoke_agent`, which pauses the
// parent run against its conversation. A run created without one cannot be
// paused, so `conversationMode` must open a conversation or every occurrence
// fails on the first delegation.
export default schedule({
  id: "triage-new-cases",
  name: "Triage new cases",
  schedule: "*/10 * * * *",
  timezone: "Europe/Berlin",
  target: { kind: "agent", id: "case-triage", conversationMode: "create_new" },
  agentMessage: { prompt: "Triage every open case created since the last run." },
});
