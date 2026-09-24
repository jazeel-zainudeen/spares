import Link from "next/link"
import Image from "next/image"
import { getPartById } from "@/lib/services/parts"
import { Image as ImageIcon, ArrowLeft, CheckCircle2, Factory, Hash, FileText } from "lucide-react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

export async function generateMetadata({ params }: { params: Promise<{ category: string, company: string, model: string, part: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const part: any = await getPartById(resolvedParams.part)
    return {
      title: `${part.item} - ${part.car_models.car_companies.name} ${part.car_models.name} | AutoPartsPro`,
      description: part.description || `Buy ${part.item} for ${part.car_models.car_companies.name} ${part.car_models.name}. Reference: ${part.ref_number}`,
      openGraph: {
        images: part.image_url ? [part.image_url] : [],
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

    if (part.car_models.slug !== resolvedParams.model || part.car_models.car_companies.slug !== resolvedParams.company || part.categories?.slug !== resolvedParams.category) {
      notFound()
    }

    const backUrl = `/spare-parts/${resolvedParams.category}/${resolvedParams.company}/${resolvedParams.model}`

    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <Link href="/spare-parts" className="hover:text-foreground transition-colors">Catalog</Link>
            <span>/</span>
            <Link href={`/spare-parts/${resolvedParams.category}`} className="hover:text-foreground transition-colors">
              {part.categories?.name || 'Category'}
            </Link>
            <span>/</span>
            <Link href={`/spare-parts/${resolvedParams.category}/${resolvedParams.company}`} className="hover:text-foreground transition-colors">
              {part.car_models.car_companies.name}
            </Link>
            <span>/</span>
            <Link href={backUrl} className="hover:text-foreground transition-colors">
              {part.car_models.name}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{part.item}</span>
          </div>

          <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-xs text-muted-foreground hover:text-foreground">
            <Link href={backUrl}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to {part.car_models.name} Parts
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Part Image Card */}
          <Card className="overflow-hidden">
            <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6">
              {part.image_url ? (
                <Image
                  src={part.image_url}
                  alt={part.item}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-6 transition-transform duration-300 hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
                  <ImageIcon className="h-16 w-16" />
                  <span className="text-xs">No preview diagram available</span>
                </div>
              )}
              {part.categories?.name && (
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="text-xs">
                    {part.categories.name}
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Details & Specs Card */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                <Factory className="h-3.5 w-3.5" />
                <span>{part.car_models.car_companies.name} {part.car_models.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {part.item}
              </h1>
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

                <div className="flex items-center justify-between pt-3.5">
                  <span className="text-xs text-muted-foreground">Compatibility</span>
                  <span className="text-xs font-medium text-foreground">
                    {part.car_models.car_companies.name} {part.car_models.name}
                  </span>
                </div>
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
