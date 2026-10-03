import Link from "next/link"
import { getPartById, getPartImages } from "@/lib/services/parts"
import { PartImageGallery } from "@/components/public/PartImageGallery"
import { ArrowLeft, CheckCircle2, Factory, Hash, FileText, Layers, Calendar, Car } from "lucide-react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PartShareButton } from "@/components/public/PartShareButton"
import { SavePartButton } from "@/components/public/SavePartButton"
import { TrackPartView } from "@/components/public/TrackPartView"
import { formatDate } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ category: string, company: string, model: string, part: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const part: any = await getPartById(resolvedParams.part)
    const images = getPartImages(part)
    return {
      title: `${part.item} - ${part.car_models?.car_companies?.name || ''} ${part.car_models?.name || ''} | AutoPartsPro`,
      description: part.description || `Buy ${part.item} for ${part.car_models?.car_companies?.name || ''} ${part.car_models?.name || ''}. Reference: ${part.ref_number}`,
      openGraph: {
        images: images.length > 0 ? images : [],
      }
    }
  } catch (e) {
    return { title: 'Part Not Found' }
  }
}

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ category: string, company: string, model: string, part: string }>
}) {
  try {
    const resolvedParams = await params
    const part: any = await getPartById(resolvedParams.part)

    const catSlug = part.categories?.slug || "uncategorized"
    const compSlug = part.car_models?.car_companies?.slug || "unknown"
    const modSlug = part.car_models?.slug || "model"

    if (modSlug !== resolvedParams.model || compSlug !== resolvedParams.company || catSlug !== resolvedParams.category) {
      notFound()
    }

    const catalogFilterUrl = `/spare-parts?brand=${resolvedParams.company}&model=${resolvedParams.model}`

    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <TrackPartView part={{
          id: part.id,
          name: part.item,
          categorySlug: catSlug,
          companySlug: compSlug,
          modelSlug: modSlug,
          imageUrl: getPartImages(part)[0] || undefined
        }} />
        {/* Navigation Breadcrumb */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <Link href="/spare-parts" className="hover:text-foreground transition-colors">Catalog</Link>
            <span>/</span>
            <Link href={`/spare-parts?category=${resolvedParams.category}`} className="hover:text-foreground transition-colors">
              {part.categories?.name || 'Category'}
            </Link>
            <span>/</span>
            <Link href={`/spare-parts?brand=${resolvedParams.company}`} className="hover:text-foreground transition-colors">
              {part.car_models?.car_companies?.name || 'Brand'}
            </Link>
            <span>/</span>
            <Link href={catalogFilterUrl} className="hover:text-foreground transition-colors">
              {part.car_models?.name || 'Model'}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-50">{part.item}</span>
          </div>

          <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs text-muted-foreground hover:text-foreground">
            <Link href={catalogFilterUrl}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to {part.car_models?.name || 'Catalog'} Parts
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Part Image Gallery Card */}
          <PartImageGallery
            images={getPartImages(part)}
            title={part.item}
            categoryName={part.categories?.name}
          />

          {/* Details & Specs Card */}
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                  <Factory className="h-3.5 w-3.5" />
                  <span>{part.car_models?.car_companies?.name} {part.car_models?.name}</span>
                </div>
                <h1 className="break-words text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground [overflow-wrap:anywhere]">
                  {part.item}
                </h1>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <SavePartButton part={{
                  id: part.id,
                  name: part.item,
                  categorySlug: catSlug,
                  companySlug: compSlug,
                  modelSlug: modSlug,
                  imageUrl: getPartImages(part)[0] || undefined
                }} />
                <PartShareButton />
              </div>
            </div>

            <Card>
              <CardContent className="p-4 sm:p-5 divide-y divide-border/60">
                <div className="flex items-center justify-between pb-3.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="h-4 w-4 text-primary" />
                    <span>Catalog Reference</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-foreground bg-muted px-2 py-0.5 rounded-sm">
                    {part.ref_number}
                  </span>
                </div>

                {part.oem_number && (
                  <div className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Factory OEM Number</span>
                    </div>
                    <span className="font-mono font-bold text-sm text-foreground bg-muted px-2 py-0.5 rounded-sm">
                      {part.oem_number}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Layers className="h-4 w-4 text-primary" />
                    <span>Component Category</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {part.categories?.name || 'General Auto Part'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Car className="h-4 w-4 text-primary" />
                    <span>Compatibility</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {part.car_models?.car_companies?.name} {part.car_models?.name}
                  </span>
                </div>

                {part.created_at && (
                  <div className="flex items-center justify-between pt-3.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Catalog Date</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatDate(part.created_at)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {part.description && (
              <Card>
                <CardContent className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>Technical Notes & Description</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {part.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  } catch (e) {
    notFound()
  }
}
