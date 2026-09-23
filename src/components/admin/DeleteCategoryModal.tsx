"use client"

import { useState } from "react"
import { CategoryRow } from "@/lib/services/categories"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { AlertTriangle } from "lucide-react"

interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
  category: CategoryRow | null
}

export function DeleteCategoryModal({ isOpen, onClose, onConfirm, category }: DeleteCategoryModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    if (!category) return
    
    setLoading(true)
    setError("")
    
    try {
      await onConfirm(category.id)
      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting")
    } finally {
      setLoading(false)
    }
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{category.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mt-4">
            {error}
          </div>
        )}

        <div className="pt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
