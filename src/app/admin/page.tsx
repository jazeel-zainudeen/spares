import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowRight, Settings2, Database, Factory, Tags } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: categoriesCount },
    { count: companiesCount },
    { count: modelsCount },
    { count: partsCount },
    { data: recentParts }
  ] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('car_companies').select('*', { count: 'exact', head: true }),
    supabase.from('car_models').select('*', { count: 'exact', head: true }),
    supabase.from('parts').select('*', { count: 'exact', head: true }),
    supabase.from('parts')
      .select('id, item, ref_number, created_at, image_url, car_models(name, car_companies(name))')
      .order('created_at', { ascending: false })
      .limit(6)
  ])

  const stats = [
    {
      title: "Total Categories",
      value: categoriesCount || 0,
      icon: Tags,
      desc: "Organized classifications",
      href: "/admin/categories"
    },
    {
      title: "Total Companies",
      value: companiesCount || 0,
      icon: Factory,
      desc: "Auto manufacturers",
      href: "/admin/companies"
    },
    {
      title: "Total Models",
      value: modelsCount || 0,
      icon: Database,
      desc: "Supported car models",
      href: "/admin/models"
    },
    {
      title: "Total Parts",
      value: partsCount || 0,
      icon: Settings2,
      desc: "Active inventory items",
      href: "/admin/parts"
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your spare parts catalog and system activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-colors hover:border-primary/50 hover:bg-accent/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recently Added Parts</CardTitle>
            <CardDescription>Latest additions to your catalog inventory</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-primary hover:text-primary">
            <Link href="/admin/parts">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentParts && recentParts.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {recentParts.map((part: any) => (
                <div key={part.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-3">
                    {part.image_url ? (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={part.image_url} alt={part.item} className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30">
                        <Settings2 className="h-5 w-5 text-muted-foreground/60" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{part.item}</p>
                      <p className="text-xs text-muted-foreground">
                        {part.car_models?.car_companies?.name} {part.car_models?.name} • <span className="font-mono">{part.ref_number}</span>
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(part.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No parts added yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
