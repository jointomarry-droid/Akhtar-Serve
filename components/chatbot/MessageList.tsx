"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import { format } from "date-fns";
import { Bot, User, AlertTriangle, ExternalLink } from "lucide-react";

// ==================== MESSAGE LIST COMPONENT ====================

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Akhtar-Serve Assistant</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Ask me anything about managing your Amazon and eBay selling business.
          I can help with products, orders, inventory, pricing, and more.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="bg-card border rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

// ==================== MESSAGE BUBBLE ====================

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isFiltered = message.metadata?.filtered;

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-primary/10"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>

      {/* Message content */}
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Filtered warning */}
        {isFiltered && (
          <div className="flex items-center gap-1 text-xs text-amber-600 mb-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Message filtered by content policy</span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border rounded-tl-sm"
          }`}
        >
          <div className="text-sm whitespace-pre-wrap break-words">
            {renderMarkdown(message.content)}
          </div>
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs text-muted-foreground mt-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {format(message.timestamp, "HH:mm")}
        </div>
      </div>
    </div>
  );
}

// ==================== SIMPLE MARKDOWN RENDERER ====================

function renderMarkdown(text: string): React.ReactNode {
  // Simple markdown rendering for bold, bullet points, and code
  const lines = text.split("\n");

  return lines.map((line, index) => {
    // Bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      // Add bold text
      parts.push(<strong key={`bold-${index}-${match.index}`}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    // Bullet point
    if (line.trimStart().startsWith("•") || line.trimStart().startsWith("-")) {
      return (
        <div key={index} className="flex gap-2 ml-2">
          <span className="text-primary">•</span>
          <span>{parts.length > 0 ? parts : line.replace(/^[\s•-]+/, "")}</span>
        </div>
      );
    }

    // Numbered list
    const numberMatch = line.trimStart().match(/^(\d+)\.\s/);
    if (numberMatch) {
      return (
        <div key={index} className="flex gap-2 ml-2">
          <span className="text-primary font-medium">{numberMatch[1]}.</span>
          <span>{parts.length > 0 ? parts : line.replace(/^\s*\d+\.\s/, "")}</span>
        </div>
      );
    }

    // Empty line
    if (line.trim() === "") {
      return <div key={index} className="h-2" />;
    }

    // Regular line
    return (
      <div key={index}>
        {parts.length > 0 ? parts : line}
      </div>
    );
  });
}
