"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/Card"
import { ListingImageCarousel } from "@/components/public/ListingImageCarousel"
import { getPartImages } from "@/lib/utils/images"
import { getPublicPartsAction } from "@/app/actions/parts"
import { Loader2 } from "lucide-react"
import { SavePartButton } from "@/components/public/SavePartButton"
import { HighlightText } from "@/components/ui/HighlightText"

export function InfinitePartList({ 
  initialParts, 
  initialPage, 
  totalPages, 
  fetchParams,
  categorySlug,
  companySlug
}: any) {
  const [parts, setParts] = useState(initialParts)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPage < totalPages)
  
  const observerTarget = useRef(null)

  // Reset state if initialParts or fetchParams changes
  useEffect(() => {
    setParts(initialParts)
    setPage(initialPage)
    setHasMore(initialPage < totalPages)
  }, [initialParts, initialPage, totalPages, fetchParams])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = page + 1
    
    const res = await getPublicPartsAction({ ...fetchParams, page: nextPage })
    if (res.data) {
      setParts((prev: any) => {
        // Prevent duplicates in StrictMode
        const existingIds = new Set(prev.map((p: any) => p.id))
        const newParts = res.data.data.filter((p: any) => !existingIds.has(p.id))
        return [...prev, ...newParts]
      })
      setPage(nextPage)
      setHasMore(nextPage < res.data.totalPages)
    }
    setLoading(false)
  }, [page, hasMore, loading, fetchParams])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {parts.map((part: any, index: number) => {
          const catSlug = part.categories?.slug || categorySlug || "uncategorized"
          const compSlug = part.car_models?.car_companies?.slug || companySlug || "unknown"
          const modSlug = part.car_models?.slug || "model"
          const href = `/spare-parts/${catSlug}/${compSlug}/${modSlug}/${part.id}`
          const images = getPartImages(part)

          return (
            <Card key={part.id} className="relative group h-full overflow-hidden transition-all hover:border-primary/40 hover:shadow-xs">
              <div className="relative">
                <Link href={href} className="block">
                  <ListingImageCarousel
                    images={images}
                    title={part.item}
                    categoryName={part.categories?.name || "Auto Part"}
                  />
                </Link>
                <div className="absolute bottom-3 right-3 z-20">
                  <SavePartButton 
                    display="icon" 
                    part={{ 
                      id: part.id, 
                      name: part.item, 
                      categorySlug: catSlug, 
                      companySlug: compSlug, 
                      modelSlug: modSlug, 
                      imageUrl: images[0] 
                    }} 
                  />
                </div>
              </div>
              <Link href={href} className="block h-full flex flex-col flex-1">
                <CardContent className="p-3.5 space-y-2">
                  <div className="text-[11px] font-medium text-primary truncate">
                    {part.car_models?.car_companies?.name} • {part.car_models?.name}
                  </div>
                  <h3 className="font-semibold text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors text-foreground">
                    <HighlightText text={part.item} highlight={fetchParams?.search || ""} />
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-muted-foreground font-mono">
                    <span className="rounded-sm bg-muted px-1.5 py-0.5">
                      REF: <HighlightText text={part.ref_number || ""} highlight={fetchParams?.search || ""} />
                    </span>
                    {part.oem_number && (
                      <span className="rounded-sm bg-muted px-1.5 py-0.5">
                        OEM: <HighlightText text={part.oem_number} highlight={fetchParams?.search || ""} />
                      </span>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
      
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more parts...
            </div>
          ) : (
            <div className="h-10 w-full" />
          )}
        </div>
      )}
    </>
  )
}
