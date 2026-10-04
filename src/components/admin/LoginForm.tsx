"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-semibold text-foreground"
        >
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="admin@example.com"
            className="pl-10 h-11 bg-background border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-xs font-semibold text-foreground"
        >
          Password
        </label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="pl-10 pr-10 h-11 bg-background border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl font-semibold shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-transform active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Authenticating...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
