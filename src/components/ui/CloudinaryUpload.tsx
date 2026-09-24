"use client"

import { useState } from "react"
import { UploadCloud, Loader2 } from "lucide-react"
import { getCloudinarySignature, deleteCloudinaryImageAction } from "@/app/actions/parts"
import { Button } from "@/components/ui/Button"

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Upload preview" className="max-h-full object-contain" loading="lazy" decoding="async" />

            {/* Desktop hover overlay */}
            <div className="hidden sm:flex absolute inset-0 items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
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
          <div className="flex sm:hidden items-center justify-between gap-2 border-t border-border/60 bg-card p-2.5">
            <label className="cursor-pointer flex-1">
              <Button asChild size="sm" variant="secondary" className="w-full" disabled={isUploading}>
                <span>Replace Image</span>
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
    </div>
  )
}
