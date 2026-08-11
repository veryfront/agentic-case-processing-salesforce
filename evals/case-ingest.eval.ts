import { datasets, evalAgent, metrics } from "veryfront/eval";
import { getCase, listCaseActivity, listCases } from "./mock-tools";

export default evalAgent({
  name: "Case Ingest redacts PII",
  target: "agent:case-ingest",
  dataset: datasets.inline([
    {
      id: "redact-case",
      input: "Fetch and redact Salesforce case 500000000000001.",
    },
  ]),
  mockTools: {
    salesforce__get_case: getCase,
    salesforce__list_case_activity: listCaseActivity,
    salesforce__list_cases: listCases,
  },
  metrics: [
    metrics.agent.calledTool("salesforce__get_case").gate(),
    metrics.agent.calledTool("salesforce__list_case_activity").gate(),
    metrics.agent.noFailedTools().gate(),
    metrics.answer.contains({ text: "[EMAIL]" }).gate(),
    metrics.answer.contains({ text: "[PHONE]" }).gate(),
  ],
});
