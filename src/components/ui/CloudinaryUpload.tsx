"use client"

import { useState } from "react"
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react"
import { getCloudinarySignature, deleteCloudinaryImageAction } from "@/app/actions/parts"
import { Box, Flex, Text, Button, IconButton } from "@radix-ui/themes"

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
    <Box width="100%">
      {error && <Text color="red" size="2" mb="2">{error}</Text>}
      
      {value ? (
        <Box position="relative" className="group" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-3)', overflow: 'hidden', border: '1px solid var(--gray-a5)', backgroundColor: 'var(--gray-a3)' }}>
          <Flex align="center" justify="center" height="100%">
            <img src={value} alt="Upload preview" style={{ maxHeight: '100%', objectFit: 'contain' }} />
          </Flex>
          <Flex 
            position="absolute" 
            inset="0" 
            align="center" 
            justify="center" 
            gap="4"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              opacity: 0, 
              backdropFilter: 'blur(2px)', 
              transition: 'opacity 0.2s ease'
            }}
            className="group-hover:opacity-100"
          >
            <label style={{ cursor: 'pointer' }}>
              <Button asChild size="2" disabled={isUploading}>
                <span>Replace</span>
              </Button>
              <input 
                type="file" 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
            <Button
              color="red"
              size="2"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Remove
            </Button>
          </Flex>
          {isUploading && (
            <Flex position="absolute" inset="0" align="center" justify="center" style={{ backgroundColor: 'var(--gray-a9)', backdropFilter: 'blur(2px)' }}>
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </Flex>
          )}
        </Box>
      ) : (
        <label style={{ display: 'block', width: '100%', cursor: 'pointer', position: 'relative' }}>
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            style={{ 
              height: '192px', 
              border: '2px dashed var(--gray-a6)', 
              borderRadius: 'var(--radius-3)', 
              transition: 'background-color 0.2s',
            }}
            className="hover:bg-gray-a3"
          >
            <UploadCloud className="w-10 h-10 mb-3" style={{ color: 'var(--gray-a9)' }} />
            <Text size="2" color="gray" mb="2">
              <Text weight="bold">Click to upload</Text> or drag and drop
            </Text>
            <Text size="1" color="gray">PNG, JPG or WEBP (MAX. 5MB)</Text>
          </Flex>
          <input 
            type="file" 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && (
            <Flex position="absolute" inset="0" align="center" justify="center" style={{ backgroundColor: 'var(--gray-a9)', borderRadius: 'var(--radius-3)', backdropFilter: 'blur(2px)' }}>
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </Flex>
          )}
        </label>
      )}
    </Box>
  )
}
