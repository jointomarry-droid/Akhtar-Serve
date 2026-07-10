import { ChatCategory } from "@/types/chat";
import {
  searchKnowledge,
  fallbackResponses,
  getGreetingResponse,
} from "./knowledge-base";
import { filterContent, classifyTopic, type FilterResult } from "./rules";

// ==================== RESPONSE GENERATOR ====================

export interface GeneratedResponse {
  content: string;
  category: ChatCategory;
  confidence: number;
  filtered: boolean;
  filterReason?: string;
  sources?: string[];
}

// Greeting patterns
const greetingPatterns = [
  /\b(hello|hi|hey|greetings|good\s+(morning|afternoon|evening)|howdy|sup|what's\s+up)\b/i,
  /\b(how\s+are\s+you|how's\s+it\s+going|what's\s+new)\b/i,
];

// Thank you patterns
const thankPatterns = [
  /\b(thanks?|thank\s+you|thx|appreciate|helpful)\b/i,
];

// Goodbye patterns
const goodbyePatterns = [
  /\b(bye|goodbye|see\s+you|later|have\s+a\s+good\s+day|take\s+care)\b/i,
];

function isGreeting(input: string): boolean {
  return greetingPatterns.some((pattern) => pattern.test(input));
}

function isThankYou(input: string): boolean {
  return thankPatterns.some((pattern) => pattern.test(input));
}

function isGoodbye(input: string): boolean {
  return goodbyePatterns.some((pattern) => pattern.test(input));
}

// ==================== MAIN RESPONSE FUNCTION ====================

export function generateResponse(userMessage: string): GeneratedResponse {
  // Step 1: Content filtering
  const filterResult: FilterResult = filterContent(userMessage);

  if (filterResult.isBlocked) {
    return {
      content: filterResult.message,
      category: "general",
      confidence: 1.0,
      filtered: true,
      filterReason: filterResult.rule?.name || "Content policy violation",
    };
  }

  // Step 2: Check for greetings
  if (isGreeting(userMessage)) {
    return {
      content: getGreetingResponse(),
      category: "general",
      confidence: 1.0,
      filtered: false,
    };
  }

  // Step 3: Check for thank you
  if (isThankYou(userMessage)) {
    return {
      content:
        "You're welcome! I'm glad I could help. Is there anything else you'd like to know about managing your eCommerce business?",
      category: "general",
      confidence: 1.0,
      filtered: false,
    };
  }

  // Step 4: Check for goodbye
  if (isGoodbye(userMessage)) {
    return {
      content:
        "Goodbye! Have a great day and happy selling! Feel free to come back anytime you need help.",
      category: "general",
      confidence: 1.0,
      filtered: false,
    };
  }

  // Step 5: Classify the topic
  const category: ChatCategory = classifyTopic(userMessage);

  // Step 6: Search knowledge base
  const matches = searchKnowledge(userMessage, category);

  if (matches.length > 0) {
    const bestMatch = matches[0];
    const confidence = Math.min(matches.length / 3, 1.0);

    // Build response with follow-up suggestions
    let response = bestMatch.answer;

    if (bestMatch.followUp && bestMatch.followUp.length > 0) {
      response += "\n\n**Related Topics:**\n";
      bestMatch.followUp.forEach((topic) => {
        response += `• ${topic}\n`;
      });
    }

    return {
      content: response,
      category: bestMatch.category,
      confidence,
      filtered: false,
      sources: [`Knowledge Base: ${bestMatch.question}`],
    };
  }

  // Step 7: Use fallback response for the category
  const fallback = fallbackResponses[category] || fallbackResponses.general;

  return {
    content: fallback,
    category,
    confidence: 0.3,
    filtered: false,
  };
}

// ==================== QUICK RESPONSES ====================

export const quickResponses: { label: string; message: string }[] = [
  { label: "How do I add a product?", message: "How do I add a new product?" },
  { label: "Pricing strategies", message: "What are the best pricing strategies?" },
  { label: "Connect Amazon", message: "How do I connect my Amazon account?" },
  { label: "Connect eBay", message: "How do I connect my eBay account?" },
  { label: "Inventory management", message: "How do I manage my inventory?" },
  { label: "Order tracking", message: "How do I track my orders?" },
  { label: "Shipping options", message: "What shipping options are available?" },
  { label: "Tax compliance", message: "How do I handle taxes for my sales?" },
  { label: "Team management", message: "How do I manage my team members?" },
  { label: "Profit calculator", message: "How do I calculate my profit margins?" },
];
