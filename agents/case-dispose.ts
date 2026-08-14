import { agent } from "veryfront/agent";

export default agent({
  id: "case-dispose",
  name: "Case Dispose",
  description: "Updates the Reason and Type fields on the Salesforce case and posts a structured triage comment using the classification verdict.",
  model: "anthropic/claude-sonnet-4-6",
  system: `You are Case Dispose, the final step of a case triage pipeline. You receive a classification verdict, update the case's Reason and Type fields in Salesforce, and post a structured triage comment. Follow the case-comment-writer skill for the exact update rules, comment template, and verification.`,
  skills: ["case-comment-writer"],
  avatarUrl: "https://api.veryfront.com/projects/agentic-case-processing-salesforce/uploads/assets%2Fagents%2Fcase-dispose%2Favatar-32063c3fa2f9487c1107e0d4.svg",
  temperature: 0,
  maxSteps: 10,
  tools: {
    "salesforce__add_case_comment": true,
    "salesforce__update_case": true,
  },
});
