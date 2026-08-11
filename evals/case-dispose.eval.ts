import { datasets, evalAgent, metrics } from "veryfront/eval";
import { addCaseComment, updateCase } from "./mock-tools";

export default evalAgent({
  name: "Case Dispose updates and comments",
  target: "agent:case-dispose",
  dataset: datasets.inline([
    {
      id: "dispose-breakdown",
      input: JSON.stringify({
        case_id: "500000000000001",
        case_number: "00001234",
        category: "Breakdown",
        subcategory: "Complete equipment failure",
        reason_api_name: "Breakdown",
        confidence: 0.98,
        team: "Field Engineering",
        summary: "Customer generator stopped and will not restart.",
        taxonomy_version: "v5",
      }),
    },
  ]),
  mockTools: {
    salesforce__update_case: updateCase,
    salesforce__add_case_comment: addCaseComment,
  },
  metrics: [
    metrics.agent.calledTool("salesforce__update_case").gate(),
    metrics.agent.calledTool("salesforce__add_case_comment").gate(),
    metrics.agent.noFailedTools().gate(),
    metrics.answer.contains({ text: "comment_posted" }).gate(),
    metrics.answer.contains({ text: "Breakdown" }).gate(),
  ],
});
