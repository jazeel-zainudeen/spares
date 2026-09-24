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
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen w-full pb-16 lg:pb-0">
        
        {/* Top header for mobile - minimal logo */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-card/95 backdrop-blur-md px-4 shadow-sm lg:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg tracking-tight">AutoParts<span className="text-primary">Admin</span></span>
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>

        <main className="flex-1 w-full flex-grow">
          {/* We ensure div occupies top of main by not using justify-center */}
          <div className="p-4 sm:p-6 lg:p-8 mx-auto max-w-7xl w-full h-full flex flex-col justify-start items-stretch">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (App-like) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/60 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        <nav className="flex items-center justify-around h-16 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-[10px] font-medium leading-none">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
