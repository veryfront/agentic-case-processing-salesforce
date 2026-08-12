---
name: triage-run-loop
description: Orchestrate the Ingest → Classify → Dispose pipeline by delegating each step to a specialist sub-agent.
allowed-tools:
  - invoke_agent
---

# Triage Run Loop

Use this skill to coordinate the three-step case triage pipeline. You do NOT
access Salesforce or the knowledge base directly — you delegate each phase to a
specialist sub-agent using `invoke_agent`.

## GDPR

- You never see raw case data. The Ingest agent redacts all PII before returning.
- Never ask a sub-agent to skip redaction or return PII.
- Never log, repeat, or surface PII in your responses.

## Pipeline

### Step 1 — Ingest (invoke `case-ingest`)

Pass the case reference (ID, CaseNumber, or search terms). It fetches the case,
redacts all PII, and returns a clean JSON payload.

Invoke with: "Fetch and redact Salesforce case {reference}"

### Step 2 — Classify (invoke `case-classify`)

Pass the full redacted JSON payload from Step 1. It reads the taxonomy from the
knowledge base, classifies the case, and returns a structured verdict JSON.

Invoke with the full redacted payload JSON, prefixed with:
"Classify this redacted case payload:"

### Step 3 — Dispose (invoke `case-dispose`)

Pass the classification verdict JSON from Step 2. It sets the case fields, posts
the triage comment, and returns the posted comment text.

Invoke with the full verdict JSON, prefixed with:
"Post triage comment for this verdict:"

## How to invoke sub-agents

Use `invoke_agent` for every phase and set `agent_id` to the exact specialist:
`case-ingest`, `case-classify`, `case-dispose`.

Each invocation must include `agent_id`, a short `description`, a complete
standalone `prompt` containing all payload data the specialist needs, and a
structured `context` object. Use `{}` when there is no additional structured
context. Never omit `context`.

Always wait for each step to complete before starting the next. The output of
each step is the input for the next.

## Output

After all three steps complete, show the user:

1. The classification result (category, subcategory, reason, confidence, team).
2. Confirmation that the comment was posted.
3. The full comment text.

## Rules

- Make exactly one `invoke_agent` call in each assistant turn. Wait for its tool
  result before making another call.
- Execute steps sequentially — never skip or parallelise. For multiple cases,
  fully ingest, classify, and dispose one case before starting the next.
- If any step fails, stop the pipeline and report the error. Do not proceed.
- Never call Salesforce tools or knowledge tools directly — use only `invoke_agent`.
- If asked to triage multiple cases, run the full pipeline for each case sequentially.
