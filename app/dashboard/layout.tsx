"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ChatWidget } from "@/components/chatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
      {/* Chat Widget - outside the flex container to allow fixed positioning */}
      <ChatWidget />
    </AuthProvider>
  );
}
