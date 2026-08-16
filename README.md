# Agentic Case Processing

A [Veryfront](https://veryfront.com) template that triages new Salesforce cases with an agentic
workforce, on a schedule. For each new case it assigns a category and type from your service
taxonomy, names the team that should own it, sets the case `Reason` and `Type` fields, and records
the verdict as a private case comment with a confidence score.

![Architecture Overview](https://veryfront.com/images/agentic-case-processing-in-salesforce-with-veryfront/architecture-light.png)

## Project layout

```
.
├── agents/
│   ├── case-triage.ts                    # orchestrator
│   ├── case-ingest.ts                    # fetches the case, redacts PII
│   ├── case-classify.ts                  # classifies against the taxonomy
│   └── case-dispose.ts                   # sets Reason + Type, posts the comment
├── skills/                               # the procedures each agent follows
│   ├── triage-run-loop/SKILL.md
│   ├── case-normalise-redact/SKILL.md
│   ├── case-classification/SKILL.md
│   └── case-comment-writer/SKILL.md
├── knowledge/
│   └── case-triage-taxonomy.md           # the classification + routing spec
├── evals/
│   ├── case-triage.eval.ts
│   ├── case-ingest.eval.ts
│   ├── case-classify.eval.ts
│   ├── case-dispose.eval.ts
│   └── mock-tools.ts
├── schedules/
│   └── triage-new-cases.ts               # runs case-triage every 10 minutes
├── tests/
│   └── readme-contract.test.js            # guards the local and Cloud run paths
└── app/
    ├── page.tsx                          # chat UI
    ├── layout.tsx
    ├── markdown-renderer.tsx
    └── api/ag-ui/route.ts                # AG-UI route
```

## Run account-free local mock evals

Use the fixture-backed evals to inspect the four-agent pipeline without a
Salesforce org or Veryfront account. Set only a direct model provider key:

```bash
npm install
export ANTHROPIC_API_KEY=<API_KEY>
npm run eval
```

The evals use `evals/mock-tools.ts` to replace `invoke_agent`, the Salesforce
tools, and project knowledge reads with deterministic fixtures. They evaluate
the orchestrator contract and each specialist agent without `veryfront login`
or `veryfront push`.

This path tests the agent behavior. It does not start the chat app or connect
to Salesforce.

## Run the live Salesforce app

The live app requires:

- A Salesforce org with API access. A free
  [Developer Edition](https://developer.salesforce.com/signup) org works.
- A [Veryfront](https://veryfront.com) account for the integration and hosted
  run capabilities.

Install, authenticate, and push the project source:

```bash
npm install
npx veryfront login   # stores your token in ~/.config/veryfront/token
npx veryfront push    # push project files for hosted child runs
npm run dev           # serves the app + parent agent runtime locally
```

Open the app, connect Salesforce when prompted (OAuth, via the Veryfront Integrations panel), and
select **Triage latest open cases**.

To run it unattended, `schedules/triage-new-cases.ts` runs the `case-triage` agent every 10 minutes.
Adjust the cron expression or timezone, then push the project to activate it.

## Understand the standalone boundary

The checked-in live app is not a standalone Salesforce client. Its
`salesforce__*` tools are remote integration tools whose definitions,
credentials, and execution come from a backing API or service layer. A model
provider key does not supply those capabilities.

The account-free eval path uses local fixtures and does not make Salesforce
requests. Replacing the orchestrator's `invoke_agent` configuration and
run-loop skill with scoped `delegates` can also make agent delegation run
in-process, but it does not make the Salesforce tools local. To self-host the
live workflow, provide your own Salesforce tool implementation or backing
service and update the agent and skill tool IDs to use it.

See the Veryfront Code
[local quickstart](https://veryfront.com/docs/code/getting-started/quickstart) and
[self-hosting guide](https://veryfront.com/docs/code/guides/self-hosting) for
account-free delegation and deployment guidance.

## Run it without cloning

[Use this template in Veryfront Studio](https://new.veryfront.com/?template=agentic-case-processing-salesforce&agent=case-triage)
— creates a new project in the browser, connect Salesforce, turn on the schedule. No local setup.
