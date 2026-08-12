import { defineSchema } from "veryfront/schemas";
import { tool } from "veryfront/tool";

const anyInput = defineSchema((v) => v.record(v.string(), v.unknown()))();

export const getCase = tool({
  id: "salesforce__get_case",
  description: "Get a Salesforce case fixture.",
  inputSchema: anyInput,
  execute: async () => ({
    Id: "500000000000001",
    CaseNumber: "00001234",
    Status: "New",
    Priority: "High",
    Origin: "Web",
    Subject: "Generator stopped for Jane Doe",
    Description: "Jane Doe at jane@example.com reports the generator is dead. Call +1 415 555 0100.",
    CreatedDate: "2026-08-11T12:00:00Z",
  }),
});

export const listCaseActivity = tool({
  id: "salesforce__list_case_activity",
  description: "List Salesforce CaseComment fixtures using CommentBody (not Body).",
  inputSchema: defineSchema((v) =>
    v.object({
      q: v.string(),
    })
  )(),
  execute: async ({ q }) => {
    if (!q.includes("CommentBody") || /(?:^|[\s,])Body(?:[\s,]|$)/.test(q)) {
      throw new Error("CaseComment queries must select CommentBody, not Body.");
    }

    return {
      comments: [
        {
          body: "Jane Doe confirmed via jane@example.com that the unit will not restart.",
          created_date: "2026-08-11T12:05:00Z",
          is_public: true,
        },
      ],
    };
  },
});

export const listCases = tool({
  id: "salesforce__list_cases",
  description: "List Salesforce case fixtures.",
  inputSchema: anyInput,
  execute: async () => ({
    cases: [{ Id: "500000000000001", CaseNumber: "00001234" }],
  }),
});

export const searchKnowledge = tool({
  id: "search_knowledge",
  description: "Discover the canonical case triage taxonomy fixture.",
  inputSchema: defineSchema((v) =>
    v.object({
      query: v.string(),
    })
  )(),
  execute: async ({ query }) => {
    if (!query.toLowerCase().includes("taxonomy")) {
      throw new Error("The knowledge search must discover the case triage taxonomy.");
    }

    return {
      query,
      mode: "search",
      data: [
        {
          path: "knowledge/case-triage-taxonomy.md",
          matched_fields: ["title", "description"],
          frontmatter: [
            { key: "title", value: "Case Triage Taxonomy" },
            {
              key: "description",
              value: "Authoritative taxonomy for classifying and routing Salesforce cases.",
            },
          ],
        },
      ],
      page_info: { self: null, first: null, next: null, prev: null },
      returned: 1,
      total_matches: 1,
      shard: { shard_index: 0, shard_count: 1, total_items: 1 },
    };
  },
});

export const getFile = tool({
  id: "get_file",
  description: "Read the case triage taxonomy fixture.",
  inputSchema: defineSchema((v) =>
    v.object({
      path: v.string(),
    })
  )(),
  execute: async ({ path }) => {
    if (path !== "knowledge/case-triage-taxonomy.md") {
      throw new Error("The taxonomy must be read from its canonical path.");
    }

    return {
      path,
      content: [
        "Taxonomy version: v1",
        "Category: Breakdown",
        "Subcategory: Complete equipment failure",
        "Reason API name: Breakdown",
        "Type API name: Mechanical",
        "Team: Field Engineering",
        "Signals: stopped, won't start, dead, failed, broken, offline",
      ].join("\n"),
    };
  },
});

export const updateCase = tool({
  id: "salesforce__update_case",
  description: "Update a Salesforce case fixture.",
  inputSchema: anyInput,
  execute: async () => ({ success: true, case_id: "500000000000001" }),
});

export const addCaseComment = tool({
  id: "salesforce__add_case_comment",
  description: "Add a Salesforce case comment fixture.",
  inputSchema: anyInput,
  execute: async () => ({ success: true, comment_id: "comment-1" }),
});

export const invokeAgent = tool({
  id: "invoke_agent",
  description: "Invoke a case triage specialist fixture.",
  inputSchema: defineSchema((v) =>
    v.object({
      agent_id: v.string(),
      description: v.string(),
      prompt: v.string(),
      context: v.record(v.string(), v.unknown()),
    })
  )(),
  execute: async ({ agent_id }) => {
    if (agent_id === "case-ingest") {
      return {
        case_id: "500000000000001",
        case_number: "00001234",
        subject: "Generator stopped for [NAME]",
        description: "[NAME] at [EMAIL] reports the generator is dead. Call [PHONE].",
        comments: [],
      };
    }

    if (agent_id === "case-classify") {
      return {
        case_id: "500000000000001",
        case_number: "00001234",
        category: "Breakdown",
        subcategory: "Complete equipment failure",
        reason_api_name: "Breakdown",
        type_api_name: "Mechanical",
        confidence: 0.98,
        team: "Field Engineering",
        summary: "Customer generator stopped and will not restart.",
        taxonomy_version: "v1",
      };
    }

    return {
      case_id: "500000000000001",
      case_number: "00001234",
      comment_posted: true,
      fields_updated: { Reason: "Breakdown", Type: "Mechanical" },
      category: "Breakdown",
      team: "Field Engineering",
      comment: "[Triage] Breakdown → Complete equipment failure",
    };
  },
});
