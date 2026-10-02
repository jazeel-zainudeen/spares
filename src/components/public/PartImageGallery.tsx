"use client"

import { useState } from "react"
import Image from "next/image"
import { Image as ImageIcon, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

interface PartImageGalleryProps {
  images: string[]
  title: string
  categoryName?: string
}

export function PartImageGallery({ images, title, categoryName }: PartImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const hasImages = images.length > 0
  const activeImage = hasImages ? images[selectedIndex] || images[0] : null

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  return (
    <Card className="overflow-hidden border border-border/80 shadow-2xs">
      {/* Main Image Display */}
      <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6 group">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={`${title} - Image ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-6 transition-all duration-300 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
            <ImageIcon className="h-16 w-16" />
            <span className="text-xs">No preview diagram available</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {categoryName && (
            <Badge variant="secondary" className="text-xs">
              {categoryName}
            </Badge>
          )}
          {selectedIndex === 0 && images.length > 1 && (
            <Badge variant="default" className="text-[10px] gap-1 bg-primary text-primary-foreground">
              <Star className="h-3 w-3 fill-current" />
              Listing Image
            </Badge>
          )}
        </div>

        {/* Navigation Arrows for Multiple Images */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-xs opacity-80 hover:opacity-100 hover:scale-110 transition-all shadow-md z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-xs opacity-80 hover:opacity-100 hover:scale-110 transition-all shadow-md z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs z-10">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 p-3 bg-card border-t border-border/60 overflow-x-auto">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex
            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border p-1 transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 bg-primary/5 scale-105"
                    : "border-border/70 bg-muted/20 opacity-70 hover:opacity-100"
                }`}
              >
                { }
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </button>
            )
          })}
        </div>
      )}
    </Card>
  )
}
