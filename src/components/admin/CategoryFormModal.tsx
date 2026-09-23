"use client"

import { useState, useEffect } from "react"
import { CategoryRow } from "@/lib/services/categories"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: CategoryRow | null
}

export function CategoryFormModal({ isOpen, onClose, onSave, initialData }: CategoryFormModalProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name)
        setSlug(initialData.slug)
        setDescription(initialData.description || "")
        setImageUrl(initialData.image_url || "")
      } else {
        setName("")
        setSlug("")
        setDescription("")
        setImageUrl("")
      }
      setError("")
    }
  }, [isOpen, initialData])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!initialData) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await onSave({
        name,
        slug,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={handleNameChange}
              placeholder="e.g. Compressor"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input 
              id="slug" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. compressor"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input 
              id="image_url" 
              type="url"
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
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
      </DialogContent>
    </Dialog>
  )
}
