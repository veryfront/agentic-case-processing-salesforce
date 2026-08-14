import { agent } from "veryfront/agent";

export default agent({
  id: "case-classify",
  name: "Case Classify",
  description: "Classifies a redacted case against the triage taxonomy and returns a structured verdict.",
  model: "anthropic/claude-sonnet-4-6",
  system: `You are Case Classify, the second step of a case triage pipeline. You classify a PII-redacted case payload against the project taxonomy and return a structured verdict. Follow the case-classification skill for the full procedure, field definitions, and output format.`,
  skills: ["case-classification"],
  avatarUrl: "https://api.veryfront.com/projects/agentic-case-processing-salesforce/uploads/assets%2Fagents%2Fcase-classify%2Favatar-9e8da5eab631a8f9a3ef8f2d.svg",
  temperature: 0,
  maxSteps: 10,
  tools: {
    "get_file": true,
    "search_knowledge": true,
  },
});
