# Agentic Case Processing

A [Veryfront](https://veryfront.com) template that triages new Salesforce cases with an agentic
workforce, on a schedule. For each new case it assigns a category and type from your service
taxonomy, names the team that should own it, sets the case `Reason` and `Type` fields, and records
the verdict as a private case comment with a confidence score.

![Architecture Overview](https://veryfront.org/images/agentic-case-processing-in-salesforce-with-veryfront/architecture-light.png)

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
└── app/
    ├── page.tsx                          # chat UI
    ├── layout.tsx
    ├── markdown-renderer.tsx
    └── api/ag-ui/route.ts                # AG-UI route
```

## Prerequisites

- A Salesforce org with API access — a free
  [Developer Edition](https://developer.salesforce.com/signup) org works.
- A [Veryfront](https://veryfront.com) account.

## Getting started

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

## Evaluate

```bash
npm run eval
```

Evals target the same agent definitions and check tool behaviour and output shape for each step
(`evals/case-*.eval.ts`).
