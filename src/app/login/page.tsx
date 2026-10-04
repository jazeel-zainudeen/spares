import { LoginForm } from "@/components/admin/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <header className="w-full px-4 sm:px-6 py-6 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
            <Image
              src="/logo-mark.png"
              alt=""
              width={192}
              height={192}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">
            AutoParts <span className="text-primary">Pro</span>
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-muted/50 hover:bg-muted border border-border backdrop-blur-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10 w-full max-w-md mx-auto mt-[-5vh]">
        <div className="w-full">
          <div className="text-center mb-6 sm:mb-8">
            <span className="mx-auto mb-4 relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(var(--primary),0.2)]">
              <Image
                src="/logo-mark.png"
                alt=""
                width={192}
                height={192}
                className="h-full w-full object-contain"
              />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground px-4">
              Sign in with your verified credentials to access the dashboard.
            </p>
          </div>

          <div className="bg-card border border-border p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl">
            <LoginForm />
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-[10px] sm:text-xs text-muted-foreground z-20">
        &copy; {new Date().getFullYear()} AutoPartsPro. Secure Admin Portal.
      </footer>
    </div>
  );
}
