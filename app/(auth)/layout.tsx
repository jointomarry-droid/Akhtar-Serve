"use client";

import { AuthProvider } from "@/contexts/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="text-center text-primary-foreground">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 font-bold text-3xl">
                AS
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold">Akhtar Serve</h1>
            <p className="text-lg text-primary-foreground/80">
              Enterprise eCommerce Management Platform
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <div className="w-full max-w-md px-4">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
