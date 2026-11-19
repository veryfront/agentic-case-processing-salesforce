import { datasets, evalAgent, metrics } from "veryfront/eval";
import { invokeAgentAlreadyTriaged } from "./mock-tools";

export default evalAgent({
  name: "Case Triage skips a case that is already triaged",
  target: "agent:case-triage",
  dataset: datasets.inline([
    {
      id: "scheduled-run-skips-triaged",
      input: "Triage the open cases that have not been triaged yet.",
    },
  ]),
  mockTools: { invoke_agent: invokeAgentAlreadyTriaged },
  metrics: [
    metrics.agent.toolCallCount("invoke_agent", { exact: 2 }).gate(),
    metrics.agent.noFailedTools().gate(),
    metrics.answer.contains({ text: "already triaged" }).gate(),
  ],
});
