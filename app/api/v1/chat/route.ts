import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateResponse } from "@/lib/chatbot/responses";

// ==================== VALIDATION SCHEMA ====================

const chatRequestSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000, "Message too long"),
  conversationId: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
});

// ==================== RATE LIMITING ====================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 30; // 30 requests per minute

  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

// ==================== POST HANDLER ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = chatRequestSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validatedData.error.issues,
        },
        { status: 400 }
      );
    }

    const { message, conversationId, userId } = validatedData.data;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Generate response
    const response = generateResponse(message);

    // Generate conversation ID if not provided
    const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create message objects
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      conversationId: convId,
      role: "user" as const,
      content: message,
      timestamp: new Date(),
      metadata: {
        category: response.category,
      },
    };

    const assistantMessage = {
      id: `msg_${Date.now()}_assistant`,
      conversationId: convId,
      role: "assistant" as const,
      content: response.content,
      timestamp: new Date(),
      metadata: {
        category: response.category,
        confidence: response.confidence,
        filtered: response.filtered,
        filterReason: response.filterReason,
        sources: response.sources,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        message: assistantMessage,
        conversationId: convId,
        userMessage,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

// ==================== GET HANDLER (Chat History) ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const conversationId = searchParams.get("conversationId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // For now, return empty history
    // In production, this would fetch from Firestore
    return NextResponse.json({
      success: true,
      data: {
        conversations: [],
        messages: [],
      },
    });
  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch chat history",
      },
      { status: 500 }
    );
  }
}
