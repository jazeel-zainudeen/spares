import Link from "next/link"
import { getPublicParts } from "@/lib/services/parts"
import { getModels } from "@/lib/services/models"
import { getCompanies } from "@/lib/services/companies"
import { SearchBar } from "@/components/public/SearchBar"
import { Image as ImageIcon, ChevronRight, ArrowLeft } from "lucide-react"

export default async function ModelCatalogPage({
  params,
  searchParams,
}: {
  params: { company: string, model: string }
  searchParams: { search?: string }
}) {
  const search = searchParams.search || ""
  const parts = await getPublicParts({ search, companySlug: params.company, modelSlug: params.model })
  
  const companies = await getCompanies()
  const currentCompany: any = companies.find((c: any) => c.slug === params.company)
  
  const models = currentCompany ? await getModels(currentCompany.id) : []
  const currentModel: any = models.find((m: any) => m.slug === params.model)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-6">
        <Link href={`/parts/${params.company}`} className="inline-flex items-center text-muted-foreground hover:text-primary text-sm font-medium transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {currentCompany?.name || 'Company'}
        </Link>
        <h1 className="text-4xl font-bold">
          {currentCompany?.name} {currentModel?.name || 'Model'} Parts
        </h1>
        <SearchBar initialValue={search} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="font-bold text-lg mb-4">{currentCompany?.name} Models</h2>
            <ul className="space-y-2">
              {models.map((model: any) => (
                <li key={model.id}>
                  <Link 
                    href={`/parts/${params.company}/${model.slug}`}
                    className={`flex items-center justify-between transition-colors ${
                      model.slug === params.model 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {model.name}
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">
              {search ? `Search Results for "${search}"` : `All ${currentModel?.name || ''} Parts`}
            </h2>
            <span className="text-muted-foreground text-sm">{parts.length} items found</span>
          </div>

          {parts.length === 0 ? (
            <div className="glass p-12 rounded-2xl text-center text-muted-foreground">
              No parts found for this model.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {parts.map((part: any) => (
                <Link 
                  key={part.id} 
                  href={`/parts/${part.car_models.car_companies.slug}/${part.car_models.slug}/${part.id}`}
                  className="glass rounded-2xl overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all"
                >
                  <div className="aspect-square bg-white/5 relative flex items-center justify-center p-4">
                    {part.image_url ? (
                      <img src={part.image_url} alt={part.item} className="max-h-full object-contain transition-transform group-hover:scale-105" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-4 space-y-2 border-t border-white/5">
                    <div className="text-xs text-primary font-medium">
                      {part.car_models.car_companies.name} • {part.car_models.name}
                    </div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {part.item}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-xs">REF: {part.ref_number}</span>
                      {part.oem_number && (
                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs">OEM: {part.oem_number}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
