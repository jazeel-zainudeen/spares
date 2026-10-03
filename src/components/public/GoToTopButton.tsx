"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function GoToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`fixed right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/5 backdrop-blur-xl shadow-xl shadow-black/5 text-primary transition-all duration-500 hover:bg-accent hover:scale-105 active:scale-95 lg:hidden ${
        isVisible
          ? "translate-y-0 opacity-100 bottom-[88px]"
          : "translate-y-8 opacity-0 pointer-events-none bottom-[88px]"
      }`}
      onClick={scrollToTop}
      aria-label="Go to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
