---
name: case-normalise-redact
description: Fetch a Salesforce case, normalise it, and redact all PII before passing it downstream.
allowed-tools:
  - salesforce__get_case
  - salesforce__list_cases
  - salesforce__list_case_activity
---

# Case Normalise & Redact

Use this skill to fetch a Salesforce case and return a normalised,
PII-redacted payload — the first step of the case triage pipeline.

## Process

1. Receive a case identifier (Case ID, CaseNumber, or search criteria).
2. Fetch the case with your Salesforce tools. Given search criteria, use
   `list_cases` to find the right case, then `get_case` for full details.
3. Fetch the comment history with `list_case_activity`. Call it with EXACTLY
   this `q`, changing only the case ID — do not alter the SELECT list, reorder
   fields, or drop `CommentBody`:
   `SELECT Id, ParentId, CommentBody, CreatedDate, IsPublished FROM CaseComment WHERE ParentId = '<case_id>' ORDER BY CreatedDate DESC LIMIT 25`
   The query MUST select `CommentBody`. Salesforce `CaseComment` has no `Body`
   field — never select `Body`.
4. Normalise the data into a single structured block.
5. Redact all PII before returning.

## PII redaction rules — MANDATORY

Before returning any case data, replace every occurrence of the following with
type tokens:

| PII type | Token |
|---|---|
| Person names (contact, account owner, created-by) | [NAME] |
| Email addresses | [EMAIL] |
| Phone numbers | [PHONE] |
| Physical / mailing addresses | [ADDRESS] |
| Dates of birth | [DOB] |
| National ID / tax / passport numbers | [GOV_ID] |
| Credit card / bank account numbers | [FINANCIAL] |
| IP addresses | [IP] |
| Any other directly identifying information | [PII] |

Do NOT redact: CaseNumber, CaseId, Status, Priority, Reason, Subject, Origin,
CreatedDate, or other non-PII operational fields.

## Output

Return ONLY a JSON block with this structure (no prose before or after):

```json
{
  "case_id": "...",
  "case_number": "...",
  "status": "...",
  "priority": "...",
  "reason": "...",
  "origin": "...",
  "subject": "[redacted subject]",
  "description": "[redacted description]",
  "created_date": "...",
  "comments": [
    { "body": "[redacted comment]", "created_date": "...", "is_public": true }
  ]
}
```

## Guardrails

- You are READ-ONLY. Never update, create, or delete any Salesforce record.
- Never return raw PII. If in doubt, redact.
- Do not classify, triage, or suggest teams — that is not your job.
- Do not add commentary. Return only the JSON payload.
- Data minimisation: fetch only the fields needed. Do not pull contact records,
  account details, or attachments.
