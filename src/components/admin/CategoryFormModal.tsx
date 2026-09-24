"use client"

import { useState, useEffect } from "react"
import { CategoryRow } from "@/lib/services/categories"
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
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name)
        setDescription(initialData.description || "")
        setImageUrl(initialData.image_url || "")
      } else {
        setName("")
        setDescription("")
        setImageUrl("")
      }
      setError("")
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await onSave({
        name,
        description: description || null,
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
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Compressor"
            required 
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Input 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description..."
            disabled={loading}
          />
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
