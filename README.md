# Salesforce Case Triage

## Architecture

<table>
  <tr>
    <td colspan="5" align="center"><strong>Chat interface</strong><br><code>Find the 5 most recent open cases and triage each one.</code></td>
  </tr>
  <tr>
    <td colspan="5" align="center">↓</td>
  </tr>
  <tr>
    <td colspan="5" align="center"><strong>case-triage</strong><br>Runs each specialist sequentially with <code>invoke_agent</code></td>
  </tr>
  <tr>
    <td colspan="5" align="center">↓ <code>invoke_agent</code></td>
  </tr>
  <tr>
    <td align="center"><strong>case-ingest</strong><br>Fetches cases and redacts PII</td>
    <td align="center">→</td>
    <td align="center"><strong>case-classify</strong><br>Applies the triage taxonomy</td>
    <td align="center">→</td>
    <td align="center"><strong>case-dispose</strong><br>Updates Reason and posts a comment</td>
  </tr>
  <tr>
    <td align="center">Salesforce<br><code>read tools</code></td>
    <td></td>
    <td align="center">Project knowledge<br><code>taxonomy</code></td>
    <td></td>
    <td align="center">Salesforce<br><code>write tools</code></td>
  </tr>
</table>

The orchestrator has no direct Salesforce access. Salesforce tools run on the hosted runtime with the project's service account, and case data is PII-redacted before classification.

## User flow

1. Install dependencies with `npm install`.
2. Configure the hosted runtime:

   ```bash
   export VERYFRONT_API_TOKEN="<your-token>"
   export VERYFRONT_PROJECT_SLUG="agentic-case-processing"
   export VERYFRONT_API_BASE_URL="https://api.veryfront.org"
   export VERYFRONT_API_URL="https://api.veryfront.org"
   export VERYFRONT_HOST_ALLOW_INTERNAL_EGRESS=1
   ```

3. Run `npm run dev` and open <http://veryfront.me:3000>.
4. Select **Triage latest open cases**.

The chat and agents run locally. Salesforce tools run on the hosted Veryfront API using the project's configured service account.
