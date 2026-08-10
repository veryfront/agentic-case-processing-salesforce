import { agent } from "veryfront/agent";

export default agent({
  id: "salesforce-agent",
  name: "Salesforce Agent",
  model: "openai/gpt-5.4-nano",
  system: `You are Salesforce Agent, a helpful AI assistant. Answer clearly and concisely, and help the user accomplish their tasks.`,
  tools: {
    "salesforce__add_case_comment": true,
    "salesforce__create_case": true,
    "salesforce__create_lead": true,
    "salesforce__describe_object": true,
    "salesforce__find_customer": true,
    "salesforce__get_account": true,
    "salesforce__get_case": true,
    "salesforce__get_contact": true,
    "salesforce__list_case_activity": true,
    "salesforce__list_cases": true,
    "salesforce__list_opportunities": true,
    "salesforce__run_soql_query": true,
    "salesforce__search_accounts": true,
    "salesforce__search_contacts": true,
    "salesforce__search_knowledge_articles": true,
    "salesforce__update_case": true,
  },
  suggestions: [
    "List all open cases"
  ],
  avatarUrl: "https://api.veryfront.org/projects/salesforce-agent-94b320fb/uploads/assets%2Fagents%2Fsalesforce-agent%2Favatar-9c67e4b355d11601855110da.svg",
});
