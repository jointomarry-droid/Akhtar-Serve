"use client";

import { useState, useCallback } from "react";
import { ChatMessage, ChatConversation } from "@/types/chat";

// ==================== CHAT HOOK ====================

interface UseChatReturn {
  messages: ChatMessage[];
  conversations: ChatConversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  createNewConversation: () => void;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setIsLoading(true);
      setError(null);

      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        conversationId: currentConversationId || "",
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch("/api/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            conversationId: currentConversationId,
          }),
        });

        if (!response.ok) throw new Error("Failed to send message");

        const data = await response.json();

        if (!data.success) throw new Error(data.error || "Failed to send message");

        // Update conversation ID
        if (!currentConversationId && data.data.conversationId) {
          setCurrentConversationId(data.data.conversationId);
        }

        // Add assistant message
        const assistantMessage: ChatMessage = {
          ...data.data.message,
          timestamp: new Date(data.data.message.timestamp),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversationId, isLoading]
  );

  // Load conversations (optional - Firebase)
  const loadConversations = useCallback(async () => {
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, query, orderBy, limit, getDocs } = await import("firebase/firestore");
      const conversationsRef = collection(db, "chatConversations");
      const q = query(conversationsRef, orderBy("updatedAt", "desc"), limit(20));
      const snapshot = await getDocs(q);
      const convs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as ChatConversation[];
      setConversations(convs);
    } catch {
      // Firebase not configured
    }
  }, []);

  // Load a conversation (optional - Firebase)
  const loadConversation = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    try {
      setCurrentConversationId(conversationId);
      const { db } = await import("@/lib/firebase");
      const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore");
      const messagesRef = collection(db, "chatMessages");
      const q = query(messagesRef, where("conversationId", "==", conversationId), orderBy("timestamp", "asc"));
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as ChatMessage[];
      setMessages(msgs);
    } catch {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewConversation = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    error,
    sendMessage,
    loadConversations,
    loadConversation,
    createNewConversation,
    clearError,
  };
}
