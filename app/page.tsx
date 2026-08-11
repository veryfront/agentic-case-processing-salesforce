"use client";

import { Chat } from "veryfront/chat";
import { MarkdownRendererProvider } from "veryfront/markdown";
import { MarkdownRenderer } from "./markdown-renderer.tsx";

export default function ChatPage(): React.JSX.Element {
  return (
    <MarkdownRendererProvider renderer={MarkdownRenderer}>
      <Chat agentId="case-triage" className="h-screen" />
    </MarkdownRendererProvider>
  );
}
