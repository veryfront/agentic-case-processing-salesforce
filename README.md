# agentic-case-processing

Salesforce case routing with an LLM. See `agents/salesforce-agent.ts`.

## Local development

The project lives on the **staging** control plane (`api.veryfront.org`), not the
`.com` default the CLI ships with. Four environment variables are required:

```bash
VERYFRONT_API_URL=https://api.veryfront.org \
VERYFRONT_PROJECT_SLUG=agentic-case-processing \
VERYFRONT_HOST_ALLOW_INTERNAL_EGRESS=1 \
VERYFRONT_WORKER_ALLOW_INTERNAL_EGRESS=1 \
VERYFRONT_API_TOKEN=<token> \
npm run dev
```

Why each one:

| Variable | Without it |
|---|---|
| `VERYFRONT_API_URL` | CLI talks to `api.veryfront.com`, where this project does not exist |
| `VERYFRONT_PROJECT_SLUG` | integration API returns `400 slug: Required` |
| `*_ALLOW_INTERNAL_EGRESS` | `Outbound network egress blocked for host: api.veryfront.org` |
| `VERYFRONT_API_TOKEN` | unauthenticated |

## Salesforce access from local dev

Two paths, and only one of them works locally.

**Agent tool calls do not work locally.** The runtime sends a `run_id` with every
integration tool call. The API resolves that id against persisted runs and
refuses anything it does not recognise, so a locally-started run gets
`Run context is not authorized for this integration tool`. Agent tool calls need
a run created by the deployed project.

**Direct calls from app code do work.** `executeRemoteIntegrationTool` sends no
`run_id`, so the same tool succeeds against real Salesforce data:

```ts
import { executeRemoteIntegrationTool } from "veryfront/integrations";

const cases = await executeRemoteIntegrationTool("salesforce__list_cases", {
  q: "SELECT Id, CaseNumber, Subject, Status FROM Case ORDER BY CreatedDate DESC LIMIT 2",
});
```

## Available Salesforce tools

The project connection exposes 10 read-only tools:

```
describe_object  find_customer   get_account   get_case      get_contact
list_case_activity  list_cases   search_accounts  search_contacts
search_knowledge_articles
```

Six catalog tools are **not** exposed and calling them fails the entire run:

| Tool | Why it is missing |
|---|---|
| `create_case`, `update_case`, `add_case_comment`, `create_lead` | `requires_write: true` — explicit opt-in via the connection's `allowedTools` |
| `run_soql_query` | explicit opt-in, same mechanism |
| `list_opportunities` | filtered by the connection's allowed-object set |

`update_case` is required to write `OwnerId` and the `AI_*__c` fields back to a
Case. Until it is added to `allowedTools`, this project can classify but cannot
route.
