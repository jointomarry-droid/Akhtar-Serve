"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { QuickReplies } from "./QuickReplies";
import { useChat } from "@/hooks/useChat";
import {
  MessageCircle,
  X,
  Minus,
  Bot,
  Trash2,
  History,
  Settings,
} from "lucide-react";

// ==================== CHAT WIDGET COMPONENT ====================

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    createNewConversation,
    clearError,
  } = useChat();

  // Show quick replies only when there are no messages
  useEffect(() => {
    setShowQuickReplies(messages.length === 0);
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setShowQuickReplies(false);
    await sendMessage(content);
  };

  const handleNewChat = () => {
    createNewConversation();
    setShowQuickReplies(true);
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-card rounded-2xl shadow-2xl border flex flex-col transition-all duration-300 ${
            isMinimized
              ? "bottom-6 right-6 w-80 h-14"
              : "bottom-6 right-6 w-[400px] h-[600px] max-h-[calc(100vh-48px)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Akhtar-Serve Assistant</h3>
                <p className="text-xs opacity-80">
                  {isLoading ? "Typing..." : "Online"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* New chat button */}
              {!isMinimized && (
                <button
                  onClick={handleNewChat}
                  className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                  title="New chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              {/* Minimize button */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minus className="h-4 w-4" />
              </button>

              {/* Close button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="p-1.5 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Error message */}
              {error && (
                <div className="mx-4 mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  <div className="flex items-center justify-between">
                    <p>{error}</p>
                    <button
                      onClick={clearError}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <MessageList messages={messages} isLoading={isLoading} />

              {/* Quick Replies */}
              {showQuickReplies && (
                <QuickReplies onSelect={handleSendMessage} disabled={isLoading} />
              )}

              {/* Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask about products, pricing, orders..."
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
