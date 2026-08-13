import { schedule } from "veryfront/schedule";

// Runs the case-triage agent unattended so new open cases are triaged without a
// person kicking off each run. Adjust the cron expression or timezone to fit
// your support hours; push the project to activate it.
export default schedule({
  id: "triage-new-cases",
  name: "Triage new cases",
  schedule: "*/10 * * * *",
  timezone: "Europe/Berlin",
  target: { kind: "agent", id: "case-triage" },
});
