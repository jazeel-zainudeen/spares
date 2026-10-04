"use client"

import { useState } from "react"
import { UploadCloud, Loader2, X } from "lucide-react"
import { getCloudinarySignature, deleteCloudinaryImageAction } from "@/app/actions/parts"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/Dialog"

interface CloudinaryUploadProps {
  value?: string | null
  publicId?: string | null
  onChange: (url: string, publicId: string) => void
  onRemove: () => void
  folder: string
}

export function CloudinaryUpload({ value, publicId, onChange, onRemove, folder }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("File must be an image")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const { timestamp, signature, cloudName, apiKey } = await getCloudinarySignature(folder)
      const effectiveCloudName = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

      if (!effectiveCloudName) {
        throw new Error("Cloudinary cloud_name is missing. Please configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", (apiKey || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)!)
      formData.append("timestamp", timestamp.toString())
      formData.append("signature", signature)
      formData.append("folder", folder)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${effectiveCloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed")
      }

      if (publicId) {
        await deleteCloudinaryImageAction(publicId)
      }

      onChange(data.secure_url, data.public_id)
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!publicId) return
    setIsUploading(true)
    try {
      await deleteCloudinaryImageAction(publicId)
      onRemove()
    } catch (err: any) {
      setError("Failed to remove image")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full">
      {error && <p className="mb-2 text-xs font-medium text-destructive">{error}</p>}

      {value ? (
        <div className="group relative w-full overflow-hidden rounded-lg border border-border bg-muted/40">
          <div className="relative aspect-video w-full flex items-center justify-center p-2">
            { }
            <img src={value} alt="Upload preview" className="max-h-full object-contain" loading="lazy" decoding="async" />

            {/* Desktop hover overlay */}
            <div className="hidden sm:flex absolute inset-0 items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
                type="button"
              >
                Preview
              </Button>
              <label className="cursor-pointer">
                <Button asChild size="sm" variant="secondary" disabled={isUploading}>
                  <span>Replace</span>
                </Button>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                Remove
              </Button>
            </div>
          </div>

          {/* Mobile action bar (always visible below image preview on mobile) */}
          <div className="flex sm:hidden flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-card p-2.5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-[30%]"
              onClick={() => setIsPreviewOpen(true)}
              type="button"
            >
              Preview
            </Button>
            <label className="cursor-pointer flex-1 min-w-[30%]">
              <Button asChild size="sm" variant="secondary" className="w-full" disabled={isUploading}>
                <span>Replace</span>
              </Button>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Remove
            </Button>
          </div>

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xs">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <label className="relative block w-full cursor-pointer">
          <div className="flex h-44 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:bg-accent/40">
            <UploadCloud className="mb-2 h-9 w-9 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-muted-foreground/75">PNG, JPG or WEBP (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-xs">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          )}
        </label>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent 
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-4xl w-[90vw] bg-transparent border-none p-0 shadow-none [&>button.absolute]:hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div 
            className="relative w-full h-[80vh] flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsPreviewOpen(false)}
          >
            <div className="relative min-w-[200px] min-h-[200px] max-w-full max-h-full flex items-center justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
              <img 
                src={value || ""} 
                alt="Full Preview" 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
              />
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute -right-3 -top-3 rounded-full bg-background/90 backdrop-blur-sm p-1.5 text-foreground shadow-md border border-border/50 z-50 transition-all hover:scale-110 hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
