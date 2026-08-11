import { datasets, evalAgent, metrics } from "veryfront/eval";
import { invokeAgent } from "./mock-tools";

export default evalAgent({
  name: "Case Triage runs all three agents",
  target: "agent:case-triage",
  dataset: datasets.inline([
    {
      id: "triage-case",
      input: "Triage Salesforce case 500000000000001.",
    },
  ]),
  mockTools: { invoke_agent: invokeAgent },
  metrics: [
    metrics.agent.toolCallCount("invoke_agent", { exact: 3 }).gate(),
    metrics.agent.noFailedTools().gate(),
    metrics.answer.contains({ text: "Breakdown" }).gate(),
    metrics.answer.contains({ text: "comment" }).gate(),
  ],
});
