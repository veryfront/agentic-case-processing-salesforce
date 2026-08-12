---
name: case-comment-writer
description: Update the Salesforce case Reason and Type and post a structured triage comment from a classification verdict.
allowed-tools:
  - salesforce__update_case
  - salesforce__add_case_comment
---

# Case Comment Writer

Use this skill to record a classification verdict on a Salesforce case — the
final step of the case triage pipeline.

## Process

1. Receive the classification JSON containing: case_id, case_number, category,
   subcategory, reason_api_name, type_api_name, confidence, team, summary,
   taxonomy_version.
2. Update BOTH case fields in a SINGLE `salesforce__update_case` call. You MUST
   pass ALL of these fields together:
   - `Reason` → set to the `reason_api_name` value from the classification
   - `Type` → set to the `type_api_name` value from the classification

   CRITICAL: Both `Reason` and `Type` must be included as top-level field
   parameters in the SAME update_case call. Do NOT omit `Type`. Do NOT pass it as
   a nested object or under a different key. The Salesforce API field name is
   exactly `Type` (capital T).

   Example: if reason_api_name is "Performance" and type_api_name is "Mechanical",
   pass both `Reason: "Performance"` AND `Type: "Mechanical"` as fields in the
   update call.

   If type_api_name is missing or null, default to "Other". Never skip setting the
   Type field.

3. Format the triage comment using the exact template below.
4. Post the comment to the case using `salesforce__add_case_comment`.
5. Return confirmation with the case_id and case_number.

## Comment template

Use this EXACT format. Replace placeholders with values from the classification
JSON. Use the current UTC timestamp for the agent field.

```
[Triage] {category} → {subcategory}
{summary}
Suggested team: {team}

---
category:    {category}
subcategory: {subcategory}
reason:      {reason_api_name}
type:        {type_api_name}
confidence:  {confidence}
team:        {team}
taxonomy:    {taxonomy_version}
agent:       case-triage/{UTC timestamp in ISO 8601 format}
```

## Output

After posting, return ONLY a JSON block:

```json
{
  "case_id": "...",
  "case_number": "...",
  "comment_posted": true,
  "fields_updated": {
    "Reason": "...",
    "Type": "..."
  },
  "category": "...",
  "team": "..."
}
```

## Verification

Before returning, verify in your reasoning that you passed BOTH `Reason` AND
`Type` as field parameters to `salesforce__update_case`. If you only passed one,
call `salesforce__update_case` again with the missing field. Both fields MUST be set.

## GDPR

- The comment must NEVER contain PII. Use "Customer" to refer to the person.
- The summary must be factual and PII-free. If the summary you received contains
  any residual PII, strip it before posting.
- Do not reference contact names, emails, phone numbers, or addresses.

## Guardrails

- You can ONLY add case comments and update the Reason and Type fields. Do not
  update status, priority, owner, or any other field.
- You cannot read cases. You operate solely on the classification payload.
- Do not alter the classification. Post it exactly as received (except PII stripping).
- Do not add commentary. Return only the JSON confirmation.
