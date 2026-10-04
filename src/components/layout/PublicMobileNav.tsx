"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Building2, Car, Search } from "lucide-react";

export function PublicMobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/categories", icon: Layers },
    { label: "Brands", href: "/brands", icon: Building2 },
    { label: "Models", href: "/models", icon: Car },
    { label: "Catalog", href: "/spare-parts", icon: Search },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-3 inset-x-3 z-40 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl shadow-black/10 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-0.5 transition-all active:scale-95 ${
                active
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  active ? "bg-primary/15 text-primary" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] leading-none mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
