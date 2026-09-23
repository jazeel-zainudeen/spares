import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowRight, Settings2, Shield, Search, Database, Factory, LayoutDashboard } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: companiesCount },
    { count: modelsCount },
    { count: partsCount },
    { data: recentParts }
  ] = await Promise.all([
    supabase.from('car_companies').select('*', { count: 'exact', head: true }),
    supabase.from('car_models').select('*', { count: 'exact', head: true }),
    supabase.from('parts').select('*', { count: 'exact', head: true }),
    supabase.from('parts')
      .select('id, item, ref_number, created_at, image_url, car_models(name, car_companies(name))')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your catalog and recent activity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-primary">
            <Factory className="h-32 w-32" />
          </div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Total Companies
            </h3>
            <p className="text-4xl font-bold">{companiesCount || 0}</p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-primary">
            <Database className="h-32 w-32" />
          </div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Database className="h-4 w-4" />
              Total Models
            </h3>
            <p className="text-4xl font-bold">{modelsCount || 0}</p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 text-primary">
            <Settings2 className="h-32 w-32" />
          </div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Total Parts
            </h3>
            <p className="text-4xl font-bold">{partsCount || 0}</p>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recently Added Parts</h2>
          <Link href="/admin/parts" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {recentParts && recentParts.length > 0 ? (
          <div className="space-y-4">
            {recentParts.map((part: any) => (
              <div key={part.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border/40">
                <div className="flex items-center gap-4">
                  {part.image_url ? (
                    <img src={part.image_url} alt={part.item} className="h-12 w-12 object-contain bg-white/10 rounded-lg p-1" />
                  ) : (
                    <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <Settings2 className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{part.item}</h4>
                    <p className="text-sm text-muted-foreground">
                      {part.car_models.car_companies.name} {part.car_models.name} • {part.ref_number}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(part.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No parts added yet.
          </div>
        )}
      </div>
    </div>
  )
}
