"use client"

import { useState } from "react"
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react"
import { getCloudinarySignature, deleteCloudinaryImageAction } from "@/app/actions/parts"

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

    // Basic validation
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
      // 1. Get signature from our secure server action
      const { timestamp, signature, cloudName, apiKey } = await getCloudinarySignature(folder)

      // 2. Upload directly to Cloudinary
      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey!)
      formData.append("timestamp", timestamp.toString())
      formData.append("signature", signature)
      formData.append("folder", folder)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed")
      }

      // If there was an existing image, we should probably delete it from Cloudinary
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
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border/40 bg-white/5 aspect-video flex items-center justify-center">
          <img src={value} alt="Upload preview" className="max-h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
            <label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Replace
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors"
            >
              Remove
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-white/5 border-border/40 transition-colors relative">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-xl backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </label>
      )}
    </div>
  )
}
