"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageList } from "@/components/chatbot";
import { useChat } from "@/hooks/useChat";
import {
  MessageSquare,
  Plus,
  Clock,
  Search,
  Trash2,
  Bot,
  User,
} from "lucide-react";
import { format } from "date-fns";

// ==================== CHAT HISTORY PAGE ====================

export default function ChatHistoryPage() {
  const {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    loadConversations,
    loadConversation,
    createNewConversation,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState("");

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Chat History
          </h1>
          <p className="text-muted-foreground">
            View and manage your conversations with the AI assistant
          </p>
        </div>
        <Button onClick={createNewConversation} className="gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Conversations List */}
        <Card className="h-[calc(100vh-280px)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">
                  Start a new chat with the AI assistant
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentConversationId === conv.id
                        ? "bg-primary/5 border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {conv.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {conv.lastMessage}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {conv.messageCount}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(conv.updatedAt, "MMM d, HH:mm")}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat View */}
        <Card className="h-[calc(100vh-280px)]">
          {currentConversationId ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {conversations.find((c) => c.id === currentConversationId)
                      ?.title || "Chat"}
                  </CardTitle>
                  <Badge variant="outline">
                    {messages.length} messages
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-65px)] overflow-hidden">
                <MessageList messages={messages} isLoading={isLoading} />
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                AI Assistant Chat History
              </h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Select a conversation from the list to view your chat history,
                or start a new conversation with the AI assistant.
              </p>
              <Button onClick={createNewConversation} className="gap-2">
                <Plus className="h-4 w-4" />
                Start New Conversation
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
