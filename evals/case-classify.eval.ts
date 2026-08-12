import { datasets, evalAgent, metrics } from "veryfront/eval";
import { getFile, searchKnowledge } from "./mock-tools";

export default evalAgent({
  name: "Case Classify applies the taxonomy",
  target: "agent:case-classify",
  dataset: datasets.inline([
    {
      id: "classify-breakdown",
      input: JSON.stringify({
        case_id: "500000000000001",
        case_number: "00001234",
        subject: "Generator stopped",
        description: "The generator is dead and will not restart.",
        comments: [],
      }),
    },
  ]),
  mockTools: {
    search_knowledge: searchKnowledge,
    get_file: getFile,
  },
  metrics: [
    metrics.agent.calledTool("search_knowledge").gate(),
    metrics.agent.calledTool("get_file").gate(),
    metrics.agent.noFailedTools().gate(),
    metrics.answer.contains({ text: "Breakdown" }).gate(),
    metrics.answer.contains({ text: "Field Engineering" }).gate(),
    metrics.answer.contains({ text: "type_api_name" }).gate(),
    metrics.answer.contains({ text: "Mechanical" }).gate(),
  ],
});
