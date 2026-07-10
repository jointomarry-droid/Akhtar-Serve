// ==================== CHAT TYPES ====================

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: ChatMessageMetadata;
}

export interface ChatMessageMetadata {
  category?: ChatCategory;
  confidence?: number;
  sources?: string[];
  filtered?: boolean;
  filterReason?: string;
}

export type ChatCategory =
  | "general"
  | "products"
  | "orders"
  | "inventory"
  | "pricing"
  | "analytics"
  | "integrations"
  | "account"
  | "billing"
  | "technical"
  | "marketplace_amazon"
  | "marketplace_ebay"
  | "shipping"
  | "returns"
  | "compliance";

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  status: "active" | "archived" | "deleted";
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
}

export interface ChatUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  userId: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    message: ChatMessage;
    conversationId: string;
  };
  error?: string;
}

// ==================== CHATBOT RULES ====================

export interface ChatRule {
  id: string;
  pattern: RegExp;
  response: string;
  category: ChatCategory;
  priority: number;
}

export interface ContentFilterRule {
  id: string;
  name: string;
  patterns: RegExp[];
  action: "block" | "warn" | "redirect";
  message: string;
}

// ==================== CHATBOT KNOWLEDGE ====================

export interface KnowledgeEntry {
  id: string;
  category: ChatCategory;
  keywords: string[];
  question: string;
  answer: string;
  followUp?: string[];
}

export interface ChatAnalytics {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  topCategories: { category: ChatCategory; count: number }[];
  filteredMessages: number;
}
