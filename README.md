# Salesforce Case Triage

## Architecture

```mermaid
flowchart TD
  Chat["Chat interface"] --> Triage["Case Triage"]
  Triage -->|invoke_agent| Ingest["Case Ingest"]
  Ingest -->|PII-redacted case| Classify["Case Classify"]
  Classify -->|classification verdict| Dispose["Case Dispose"]

  Ingest -.-> SalesforceRead["Salesforce read tools"]
  Classify -.-> Taxonomy["Project taxonomy"]
  Dispose -.-> SalesforceWrite["Salesforce write tools"]
```

The orchestrator has no direct Salesforce access. Salesforce tools run on the hosted runtime with the project's service account, and case data is PII-redacted before classification.

## User flow

1. Install dependencies with `npm install`.
2. Configure the hosted control plane:

   ```bash
   export VERYFRONT_API_TOKEN="<your-token>"
   export VERYFRONT_PROJECT_SLUG="agentic-case-processing"
   export VERYFRONT_API_BASE_URL="https://api.veryfront.org"
   export VERYFRONT_API_URL="https://api.veryfront.org"
   export VERYFRONT_HOST_ALLOW_INTERNAL_EGRESS=1
   ```

3. Push the current project files for hosted child runs:

   ```bash
   npx veryfront push
   ```

4. Run `npm run dev` and open <http://veryfront.me:3000>.
5. Select **Triage latest open cases**.

`npm run dev` serves the app and parent agent runtime locally. In this setup,
`invoke_agent` creates child runs through the hosted control plane. Child agents
use the pushed project files, while integrations and their service identities
execute hosted. Keep both API URL variables set to `https://api.veryfront.org`,
and push again after changing files that a child agent must use.
