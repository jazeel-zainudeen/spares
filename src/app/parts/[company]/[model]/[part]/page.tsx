import Link from "next/link"
import Image from "next/image"
import { getPartById } from "@/lib/services/parts"
import { Image as ImageIcon, ArrowLeft, CheckCircle2, Factory, Hash, FileText } from "lucide-react"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { company: string, model: string, part: string } }): Promise<Metadata> {
  try {
    const part: any = await getPartById(params.part)
    return {
      title: `${part.item} - ${part.car_models.car_companies.name} ${part.car_models.name} Parts`,
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
  params: { company: string, model: string, part: string }
}) {
  try {
    const part: any = await getPartById(params.part)
    
    if (part.car_models.slug !== params.model || part.car_models.car_companies.slug !== params.company) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/parts" className="hover:text-primary transition-colors">Catalog</Link>
            <span>/</span>
            <Link href={`/parts/${params.company}`} className="hover:text-primary transition-colors">{part.car_models.car_companies.name}</Link>
            <span>/</span>
            <Link href={`/parts/${params.company}/${params.model}`} className="hover:text-primary transition-colors">{part.car_models.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{part.item}</span>
          </div>
          
          <Link href={`/parts/${params.company}/${params.model}`} className="inline-flex items-center text-muted-foreground hover:text-primary text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {part.car_models.name} Parts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square glass rounded-3xl overflow-hidden flex items-center justify-center p-8 bg-white/5 relative group">
              {part.image_url ? (
                <Image 
                  src={part.image_url} 
                  alt={part.item} 
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-110" 
                />
              ) : (
                <ImageIcon className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-medium mb-2">
                <Factory className="h-4 w-4" />
                {part.car_models.car_companies.name} {part.car_models.name}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {part.item}
              </h1>
            </div>

            <div className="glass p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-5 w-5" />
                  <span>Reference Number</span>
                </div>
                <span className="font-mono font-bold text-lg">{part.ref_number}</span>
              </div>
              
              {part.oem_number && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>OEM Number</span>
                  </div>
                  <span className="font-mono font-bold text-lg">{part.oem_number}</span>
                </div>
              )}
            </div>

            {part.description && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <FileText className="h-5 w-5 text-primary" />
                  Description
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {part.description}
                </p>
              </div>
            )}
            
            <div className="pt-8 flex gap-4">
              <button className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20">
                Inquire About Part
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
