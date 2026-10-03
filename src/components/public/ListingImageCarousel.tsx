"use client"

import { useState, useEffect, useRef } from "react"
import { Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/Badge"

interface ListingImageCarouselProps {
  images: string[]
  title: string
  categoryName?: string
  aspectRatio?: string
}

export function ListingImageCarousel({
  images,
  title,
  categoryName,
  aspectRatio = "aspect-16/10",
}: ListingImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const hasMultiple = images.length > 1
  const mainImage = images[currentIndex] || images[0]

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    
    if (isLeftSwipe && hasMultiple) {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    } else if (isRightSwipe && hasMultiple) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  useEffect(() => {
    if (isHovered && hasMultiple) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, 1100)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setCurrentIndex(0)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, hasMultiple, images.length])

  return (
    <div
      className={`${aspectRatio} bg-muted/40 relative flex items-center justify-center p-3 border-b border-border/60 overflow-hidden select-none touch-pan-y`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Active Image */}
      {mainImage ? (
         
        <img
          src={mainImage}
          alt={`${title} - image ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
      )}

      {/* Category Badge */}
      {categoryName && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 shadow-xs">
            {categoryName}
          </Badge>
        </div>
      )}

      {/* Carousel Indicators for Multiple Images */}
      {hasMultiple && (
        <>
          {/* Bottom Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 px-2 py-1 rounded-full bg-black/40 backdrop-blur-xs transition-opacity duration-200 opacity-80 group-hover:opacity-100">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Top-Right Counter Badge */}
          <div className="absolute top-2 right-2 z-10">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0.2 font-mono transition-all duration-200 ${
                isHovered
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/85 text-foreground backdrop-blur-xs"
              }`}
            >
              {currentIndex + 1}/{images.length}
            </Badge>
          </div>
        </>
      )}
    </div>
  )
}
