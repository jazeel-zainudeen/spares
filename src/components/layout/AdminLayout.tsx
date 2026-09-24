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
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  isActive 
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
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen w-full pb-20 lg:pb-0">
        
        {/* Top header for mobile - sticky with blur */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/85 backdrop-blur-md px-4 shadow-2xs lg:hidden">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">AutoParts<span className="text-primary">Admin</span></span>
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </header>

        <main className="flex-1 w-full grow">
          <div className="p-3.5 sm:p-6 lg:p-8 mx-auto max-w-7xl w-full h-full flex flex-col justify-start items-stretch">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (App-like sleek pill style) */}
      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border/80 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-center justify-around h-15 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 relative",
                  isActive 
                    ? "text-primary font-semibold" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                  isActive && "bg-primary/10 text-primary"
                )}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] tracking-tight leading-none mt-0.5">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
