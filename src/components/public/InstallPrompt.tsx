"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useNotFound } from "@/components/public/NotFoundContext";

export function InstallPrompt() {
  const { isNotFound } = useNotFound();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Clean up any legacy permanent localStorage dismiss flag
    try {
      localStorage.removeItem("pwa_install_dismissed");
    } catch {}

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed for the current session
      try {
        const dismissed = sessionStorage.getItem("pwa_install_dismissed");
        if (!dismissed) {
          setShowPrompt(true);
        }
      } catch {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      sessionStorage.setItem("pwa_install_dismissed", "true");
    } catch {}
  };

  if (isNotFound || !showPrompt) return null;

  return (
    <div className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] inset-x-3 z-50 lg:left-auto lg:right-6 lg:bottom-6 lg:w-96 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-3 rounded-2xl border md:border-primary/30 bg-card/95 p-3.5 shadow lg:shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">
              Install AutoParts Pro
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Fast & quick access to parts catalog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleInstall}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
