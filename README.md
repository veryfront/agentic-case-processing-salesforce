# Agentic Case Processing

A [Veryfront](https://veryfront.com) template that triages new Salesforce cases with an agentic
workforce, on a schedule. For each new case it assigns a category and type from your service
taxonomy, names the team that should own it, sets the case `Reason` and `Type` fields, and records
the verdict as a private case comment with a confidence score.

![Architecture Overview](https://veryfront.com/images/agentic-case-processing-in-salesforce-with-veryfront/architecture-light.png)

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
