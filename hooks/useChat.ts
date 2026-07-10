"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;

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
            userId: user.uid,
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

        // Save to Firestore
        await saveMessageToFirestore(userMessage);
        await saveMessageToFirestore(assistantMessage);

        // Update or create conversation in Firestore
        await saveConversationToFirestore(
          data.data.conversationId,
          content,
          assistantMessage.content
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [user, currentConversationId]
  );

  // Save a message to Firestore
  const saveMessageToFirestore = async (message: ChatMessage) => {
    if (!user) return;

    try {
      const messagesRef = collection(db, "chatMessages");
      await addDoc(messagesRef, {
        ...message,
        userId: user.uid,
        timestamp: Timestamp.fromDate(message.timestamp),
        createdAt: Timestamp.now(),
      });
    } catch (err) {
      console.error("Error saving message to Firestore:", err);
    }
  };

  // Save or update conversation in Firestore
  const saveConversationToFirestore = async (
    conversationId: string,
    lastUserMessage: string,
    lastAssistantMessage: string
  ) => {
    if (!user) return;

    try {
      const conversationsRef = collection(db, "chatConversations");
      const q = query(
        conversationsRef,
        where("id", "==", conversationId),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Create new conversation
        await addDoc(conversationsRef, {
          id: conversationId,
          userId: user.uid,
          title: lastUserMessage.slice(0, 50) + (lastUserMessage.length > 50 ? "..." : ""),
          status: "active",
          messageCount: 2,
          lastMessage: lastAssistantMessage.slice(0, 100),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      } else {
        // Update existing conversation
        const docRef = doc(db, "chatConversations", snapshot.docs[0].id);
        await updateDoc(docRef, {
          messageCount: increment(2),
          lastMessage: lastAssistantMessage.slice(0, 100),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (err) {
      console.error("Error saving conversation to Firestore:", err);
    }
  };

  // Load conversations from Firestore
  const loadConversations = useCallback(async () => {
    if (!user) return;

    try {
      const conversationsRef = collection(db, "chatConversations");
      const q = query(
        conversationsRef,
        where("userId", "==", user.uid),
        orderBy("updatedAt", "desc"),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const convs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as ChatConversation[];

      setConversations(convs);
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  }, [user]);

  // Load a specific conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      setCurrentConversationId(conversationId);

      // Load messages from Firestore
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
    } catch (err) {
      console.error("Error loading conversation:", err);
      setError("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
