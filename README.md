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
└── app/
    ├── page.tsx                          # chat UI
    ├── layout.tsx
    ├── markdown-renderer.tsx
    └── api/ag-ui/route.ts                # AG-UI route
```

## Getting started

Install the dependencies and start the app locally.

```bash
npm i
npm run dev
```

## Eval

Evaluate the agents using the included mock Salesforce cases and tools.

```bash
npm run eval
```

## Deploy to Veryfront Cloud

Deploy the app to Veryfront Cloud to run the case-triage workflow on a schedule.

```bash
npm run deploy
```

Fork this template in [Veryfront Studio](https://new.veryfront.com/?template=agentic-case-processing-salesforce&agent=case-triage).
