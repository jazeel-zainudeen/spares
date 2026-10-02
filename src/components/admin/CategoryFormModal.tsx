"use client"

import { useState, useEffect } from "react"
import type { CategoryRow } from "@/lib/services/categories"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload"

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: CategoryRow | null
}

export function CategoryFormModal({ isOpen, onClose, onSave, initialData }: CategoryFormModalProps) {
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name)
        setImageUrl(initialData.image_url || "")
      } else {
        setName("")
        setImageUrl("")
      }
      setError("")
      setFieldErrors({})
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Record<string, string> = {}
    if (!name) errors.name = "Name is required"

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setLoading(true)
    setError("")

    try {
      await onSave({
        name,
        image_url: imageUrl || null
      })
      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Category' : 'Add Category'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2" noValidate>
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name *</label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: "" }))
            }}
            placeholder="e.g. Compressor"
            required 
            disabled={loading}
            className={fieldErrors.name ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : ""}
          />
          {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category Icon / Image</label>
          <CloudinaryUpload
            value={imageUrl}
            folder="categories/images"
            onChange={(url) => setImageUrl(url)}
            onRemove={() => setImageUrl("")}
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
