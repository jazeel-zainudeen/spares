"use client"

import { useState, useRef, MouseEvent, useEffect } from "react"
import Image from "next/image"
import { Image as ImageIcon, ChevronLeft, ChevronRight, ZoomIn, Maximize2, X } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

interface PartImageGalleryProps {
  images: string[]
  title: string
  categoryName?: string
}

export function PartImageGallery({ images, title, categoryName }: PartImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalZoomed, setIsModalZoomed] = useState(false)
  const [modalZoomPos, setModalZoomPos] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const modalContainerRef = useRef<HTMLDivElement>(null)

  const hasImages = images.length > 0
  const activeImage = hasImages ? images[selectedIndex] || images[0] : null

  // Close modal on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false)
    }
    if (isModalOpen) {
      window.addEventListener("keydown", onKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [isModalOpen])

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomPos({ x, y })
  }

  const handleModalMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!modalContainerRef.current) return
    const rect = modalContainerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setModalZoomPos({ x, y })
  }

  return (
    <>
      <Card className="overflow-hidden border border-border/80 shadow-2xs">
        {/* Main Image Display */}
        <div
          ref={containerRef}
          onMouseEnter={() => hasImages && setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => hasImages && setIsModalOpen(true)}
          className={`aspect-square bg-muted/30 relative flex items-center justify-center p-6 group select-none overflow-hidden ${
            hasImages ? "cursor-zoom-in" : ""
          }`}
        >
          {activeImage ? (
            <div
              className="relative w-full h-full transition-transform duration-100 ease-out will-change-transform"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZoomed ? "scale(2.4)" : "scale(1)",
              }}
            >
              <Image
                src={activeImage}
                alt={`${title} - Image ${selectedIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4 pointer-events-none"
                priority
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
              <ImageIcon className="h-16 w-16" />
              <span className="text-xs">No preview diagram available</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            {categoryName && (
              <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-background/85">
                {categoryName}
              </Badge>
            )}
          </div>

          {/* Hover zoom hint / Fullscreen action */}
          {hasImages && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
                className="flex items-center gap-1.5 text-xs font-medium bg-background/90 text-foreground backdrop-blur-md px-2.5 py-1 rounded-md border border-border/70 shadow-xs hover:bg-background transition-colors"
                title="Open fullscreen view"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Enlarge</span>
              </button>
            </div>
          )}

          {/* Zoom guide badge (bottom left) */}
          {hasImages && !isZoomed && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-muted-foreground bg-background/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-border/40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="h-3.5 w-3.5 text-primary" />
              <span>Hover to zoom • Click to expand</span>
            </div>
          )}

          {/* Navigation Arrows for Multiple Images */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-xs opacity-0 group-hover:opacity-90 hover:opacity-100! hover:scale-110 transition-all shadow-md z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-xs opacity-0 group-hover:opacity-90 hover:opacity-100! hover:scale-110 transition-all shadow-md z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs z-10 pointer-events-none">
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

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/80 text-white border border-white/30 shadow-2xl hover:bg-black hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Title & Counter */}
          <div className="absolute top-4 left-4 z-50 flex flex-col gap-0.5 text-white pointer-events-none">
            <span className="text-sm font-semibold max-w-[70vw] truncate">{title}</span>
            {images.length > 1 && (
              <span className="text-xs text-white/70">
                Image {selectedIndex + 1} of {images.length}
              </span>
            )}
          </div>

          {/* Modal Main Image Display */}
          <div
            ref={modalContainerRef}
            className={`relative w-full max-w-5xl h-[80vh] flex items-center justify-center overflow-hidden rounded-lg ${isModalZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={(e) => {
              e.stopPropagation()
              setIsModalZoomed(!isModalZoomed)
            }}
            onMouseMove={handleModalMouseMove}
          >
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out will-change-transform"
              style={{
                transformOrigin: `${modalZoomPos.x}% ${modalZoomPos.y}%`,
                transform: isModalZoomed ? "scale(2.5)" : "scale(1)",
              }}
            >
              <img
                src={activeImage}
                alt={`${title} - Expanded Image`}
                className="max-h-full max-w-full object-contain select-none shadow-2xl rounded-lg pointer-events-none"
              />
            </div>

            {/* Modal Prev / Next Navigation */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/75 hover:bg-black text-white border border-white/30 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-7 w-7 drop-shadow-sm" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/75 hover:bg-black text-white border border-white/30 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-7 w-7 drop-shadow-sm" />
                </button>
              </>
            )}
          </div>

          {/* Modal Bottom Thumbnails */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={`modal-${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-12 w-14 rounded-md overflow-hidden border p-0.5 transition-all shrink-0 ${
                    idx === selectedIndex
                      ? "border-primary ring-2 ring-primary scale-105"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
