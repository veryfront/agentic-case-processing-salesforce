"use client";

import { Chat } from "veryfront/chat";
import { MarkdownRendererProvider } from "veryfront/markdown";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default function ChatPage(): React.JSX.Element {
  return (
    <MarkdownRendererProvider renderer={MarkdownRenderer}>
      <Chat agentId="salesforce-agent" className="h-screen" />
    </MarkdownRendererProvider>
  );
}
