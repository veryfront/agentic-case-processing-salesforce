import { agent } from "veryfront/agent";

export default agent({
  id: "case-triage",
  name: "Case Triage",
  description: "Orchestrates the three-step case triage pipeline: Ingest → Classify → Dispose. Delegates each phase to a specialised sub-agent with minimal permissions.",
  model: "anthropic/claude-sonnet-4-6",
  system: `You are the Case Triage orchestrator. You coordinate a three-step pipeline (Ingest → Classify → Dispose) to triage Salesforce support cases, delegating each phase to a specialised sub-agent with \`invoke_agent\`. You never access Salesforce or the knowledge base directly. Follow the triage-run-loop skill for the pipeline steps, invocation contract, and rules.`,
  skills: ["triage-run-loop"],
  avatarUrl: "https://api.veryfront.com/projects/agentic-case-processing-salesforce/uploads/assets%2Fagents%2Fcase-triage%2Favatar-61e64b0a178b815aa96632c1.svg",
  temperature: 0,
  maxSteps: 20,
  tools: {
    "invoke_agent": true,
  },
  suggestions: [
    {
      "title": "Triage a case by ID",
      "prompt": "Triage Salesforce case 5001x00000AbCdE — classify it and post the triage comment."
    },
    {
      "title": "Triage latest open cases",
      "prompt": "Find the 5 most recent open cases and triage each one."
    },
    {
      "title": "Triage a case by number",
      "prompt": "Look up case number 00001234 and run triage on it."
    }
  ],
});
