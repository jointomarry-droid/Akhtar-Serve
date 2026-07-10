"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-10 w-10">
        <span className="text-xl">☀️</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-10 w-10 text-xl transition-all duration-300 hover:scale-110"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className={`transition-transform duration-300 ${isDark ? "rotate-0" : "rotate-180"}`}>
        {isDark ? "🌙" : "☀️"}
      </span>
    </Button>
  );
}