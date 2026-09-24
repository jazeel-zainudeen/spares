"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Car,
  Settings,
  LogOut,
  Wrench,
  Tags
} from "lucide-react"
import { logout } from "@/app/actions/auth"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Models', href: '/admin/models', icon: Car },
  { name: 'Parts', href: '/admin/parts', icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background flex flex-col lg:flex-row w-full">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-border/60 bg-card">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/40 justify-between">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">AutoParts<span className="text-primary">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <item.icon className={`mr-3 h-5 w-5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border/40 p-4">
          <form action={logout}>
            <button
              type="submit"
              className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" />
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen w-full pb-24 lg:pb-0">

        {/* Mobile Top App Bar (iOS / Android Native Look) */}
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 lg:hidden">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform active:scale-95"
              title="Visit Storefront"
            >
              <Wrench className="h-4 w-4" />
            </Link>
            <div>
              <div className="text-xs font-semibold leading-tight text-foreground tracking-tight">
                AutoParts <span className="text-primary font-bold">Admin</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-medium capitalize leading-tight">
                {navigation.find(n => n.href === pathname)?.name || "Control Center"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
            >
              Storefront
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all active:scale-95 hover:bg-destructive/10 hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 w-full grow">
          <div className="p-3.5 sm:p-6 lg:p-8 mx-auto max-w-7xl w-full h-full flex flex-col justify-start items-stretch">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Island App Dock (Native Mobile App Experience) */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="lg:hidden fixed bottom-3 inset-x-3 z-50 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl shadow-black/10 px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="flex items-center justify-between">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 active:scale-90",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/75 hover:text-foreground"
                )}
              >
                <div className={cn(
                  "relative flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200",
                  isActive && "bg-primary/15 text-primary shadow-xs"
                )}>
                  <item.icon className="h-4.5 w-4.5" />
                  {isActive && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] tracking-tight leading-none mt-1 font-medium",
                  isActive && "font-semibold text-primary"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
