"use client";

import { useState, useCallback } from "react";
import { ChatMessage, ChatConversation } from "@/types/chat";

// ==================== CHAT HOOK ====================
// Works independently of Firebase - Firestore operations are optional

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
      if (!content.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // Create user message
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}_user`,
          conversationId: currentConversationId || "",
          role: "user",
          content: content.trim(),
          timestamp: new Date(),
        };

        // Add user message to state immediately
        setMessages((prev) => [...prev, userMessage]);

        // Call API
        const response = await fetch("/api/v1/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            conversationId: currentConversationId,
            userId: "anonymous",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to send message");
        }

        // Update conversation ID if new
        if (!currentConversationId && data.data.conversationId) {
          setCurrentConversationId(data.data.conversationId);
        }

        // Add assistant message to state
        const assistantMessage: ChatMessage = {
          ...data.data.message,
          timestamp: new Date(data.data.message.timestamp),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Try to save to Firestore (optional - don't fail if Firebase isn't configured)
        try {
          await saveToFirestore(userMessage, assistantMessage, data.data.conversationId);
        } catch (firestoreError) {
          // Firestore save failed - that's okay, chat still works
          console.log("Firestore save skipped:", firestoreError instanceof Error ? firestoreError.message : "Not configured");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversationId]
  );

  // Save to Firestore (optional)
  const saveToFirestore = async (
    userMessage: ChatMessage,
    assistantMessage: ChatMessage,
    conversationId: string
  ) => {
    // Dynamically import Firebase to avoid errors if not configured
    const { db } = await import("@/lib/firebase");
    const {
      collection,
      addDoc,
      Timestamp,
    } = await import("firebase/firestore");

    // Save user message
    await addDoc(collection(db, "chatMessages"), {
      ...userMessage,
      timestamp: Timestamp.fromDate(userMessage.timestamp),
      createdAt: Timestamp.now(),
    });

    // Save assistant message
    await addDoc(collection(db, "chatMessages"), {
      ...assistantMessage,
      timestamp: Timestamp.fromDate(assistantMessage.timestamp),
      createdAt: Timestamp.now(),
    });
  };

  // Load conversations (optional)
  const loadConversations = useCallback(async () => {
    // Optional - only works if Firebase is configured
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
      // Firebase not configured - that's okay
    }
  }, []);

  // Load a specific conversation (optional)
  const loadConversation = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    try {
      setCurrentConversationId(conversationId);

      const { db } = await import("@/lib/firebase");
      const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore");

      const messagesRef = collection(db, "chatMessages");
      const q = query(
        messagesRef,
        where("conversationId", "==", conversationId),
        orderBy("timestamp", "asc")
      );

      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as ChatMessage[];

      setMessages(msgs);
    } catch {
      // Firebase not configured - show empty conversation
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new conversation
  const createNewConversation = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  // Clear error
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
