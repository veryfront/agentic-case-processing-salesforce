---
name: case-classification
description: Classify a redacted case against the project taxonomy and return a structured verdict.
allowed-tools:
  - search_knowledge
  - get_file
---

# Case Classification

Use this skill to classify a PII-redacted case payload against the project
taxonomy — the second step of the case triage pipeline.

## Process

1. Receive the redacted case JSON.
2. Use `search_knowledge` in the current project with a query for the case
   triage taxonomy. Search results contain paths and frontmatter metadata only,
   not the taxonomy contents.
3. Use `get_file` with the exact canonical `path` returned by `search_knowledge`.
   Read that checked-in file before classifying; it is the authoritative taxonomy.
4. Compare the case subject, description, and comments against the taxonomy
   categories and subcategories.
5. Assign the best-fit category, subcategory, team, and a confidence score
   (0.00–1.00).
6. Assign the Salesforce Reason API name from §2 of the taxonomy — it maps 1:1
   from the category.
7. Assign the Salesforce Type API name from §2b of the taxonomy. Follow the type
   selection rules and the per-category type mapping in §4. Choose the single most
   appropriate equipment domain. When uncertain, use `Other`.
8. If confidence is below 0.50, classify as category "Other" with subcategory
   "Uncategorised" and team "General Support".

## Output

Return ONLY a JSON block with this structure (no prose before or after):

```json
{
  "case_id": "...",
  "case_number": "...",
  "category": "...",
  "subcategory": "...",
  "reason_api_name": "...",
  "type_api_name": "...",
  "confidence": 0.87,
  "team": "...",
  "summary": "One-sentence plain-English summary of the customer issue, no PII.",
  "taxonomy_version": "v6"
}
```

### Field definitions

- `category`: The top-level taxonomy category (e.g. "Installation", "Breakdown", "Performance").
- `subcategory`: The specific subcategory within that category.
- `reason_api_name`: The exact Salesforce Reason picklist API name from §2. Must be
  one of: Installation, Equipment Complexity, Performance, Breakdown, Equipment
  Design, Feedback, Other.
- `type_api_name`: The exact Salesforce Type picklist API name from §2b. Must be one
  of: Mechanical, Electrical, Electronic, Structural, Other. Follow the per-category
  type mapping in §4 to determine the correct value.
- `confidence`: Float 0.00–1.00 reflecting classification certainty.
- `team`: The suggested support team from the taxonomy.
- `summary`: A brief factual description of the issue with NO PII.

## Guardrails

- You have NO Salesforce access. Do not attempt to read or write Salesforce data.
- You operate only on the redacted payload you receive. If it still contains PII,
  flag it but proceed.
- Do not fabricate taxonomy categories or type values. Use only categories and
  types defined in the taxonomy file.
- Do not add commentary. Return only the JSON payload.
- If the case data is insufficient, return category "Other", type_api_name "Other",
  confidence 0.00, and note the gap in the summary.
- Both `reason_api_name` and `type_api_name` are mandatory in every output. Never
  omit either field.
