"use client";

import { quickResponses } from "@/lib/chatbot/responses";

// ==================== QUICK REPLIES COMPONENT ====================

interface QuickRepliesProps {
  onSelect: (message: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ onSelect, disabled = false }: QuickRepliesProps) {
  return (
    <div className="px-4 pb-2">
      <div className="flex flex-wrap gap-2">
        {quickResponses.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect(item.message)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
