# agentic-case-processing

Salesforce case routing with an LLM. Classifies incoming Cases and assigns the
responsible queue.

## Run locally

```bash
npm install

VERYFRONT_API_URL=https://api.veryfront.org \
VERYFRONT_PROJECT_SLUG=agentic-case-processing \
VERYFRONT_API_TOKEN=<token> \
npm run dev
```

The project lives on the staging control plane, so `VERYFRONT_API_URL` and
`VERYFRONT_PROJECT_SLUG` are both required — the CLI defaults to `.com`, where
this project does not exist.

If `api.veryfront.org` resolves to a private address on your network, also set
`VERYFRONT_HOST_ALLOW_INTERNAL_EGRESS=1` and
`VERYFRONT_WORKER_ALLOW_INTERNAL_EGRESS=1`.

## Salesforce

Call Salesforce from code:

```ts
import { executeRemoteIntegrationTool } from "veryfront/integrations";

const cases = await executeRemoteIntegrationTool("salesforce__list_cases", {
  q: "SELECT Id, CaseNumber, Subject, Status FROM Case LIMIT 10",
});
```

This works both locally and in the cloud.

**Agent tool calls do not work in local dev.** The platform only runs integration
tools for runs it started itself, and `veryfront dev` starts runs in-process. They
fail with `Run context is not authorized for this integration tool`. Test the chat
agent in Studio instead.

The connection exposes 10 read-only tools. Writing to Salesforce needs
`salesforce__update_case` added to the connection's `allowed_tools`.
