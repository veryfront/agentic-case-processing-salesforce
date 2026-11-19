import { datasets, evalAgent, metrics } from "veryfront/eval";
import { getCase, listCaseActivity, listUntriagedCases } from "./mock-tools";

export default evalAgent({
  name: "Case Ingest lists only untriaged open cases",
  target: "agent:case-ingest",
  dataset: datasets.inline([
    {
      id: "list-untriaged",
      input: "List the open cases that have not been triaged yet",
    },
  ]),
  mockTools: {
    salesforce__get_case: getCase,
    salesforce__list_case_activity: listCaseActivity,
    salesforce__list_cases: listUntriagedCases,
  },
  metrics: [
    metrics.agent.toolCallCount("salesforce__list_cases", { exact: 1 }).gate(),
    metrics.agent.notCalledTool("salesforce__get_case").gate(),
    metrics.agent.noFailedTools().gate(),
    metrics.answer.contains({ text: "500000000000002" }).gate(),
  ],
});
