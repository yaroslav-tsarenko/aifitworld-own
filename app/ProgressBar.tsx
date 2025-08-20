"use client";

import { useState, useEffect } from "react";
import { THEME } from "@/lib/theme";

export default function ProgressBar() {
  const [scrollPercentage, setScrollPercentage] = useState("0%");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      
      const scrolled = winHeightPx > 0 ? `${(scrollPx / winHeightPx) * 100}%` : "0%";
      setScrollPercentage(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Устанавливаем начальное значение

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
      <div
        className="h-full transition-all duration-150"
        style={{ width: scrollPercentage, background: THEME.accent }}
      />
    </div>
  );
}
