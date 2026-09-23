"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { ModelRow } from "@/lib/services/models"

interface DeleteModelModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
  model: ModelRow | null
}

export function DeleteModelModal({ isOpen, onClose, onConfirm, model }: DeleteModelModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConfirm = async () => {
    if (!model) return
    setLoading(true)
    setError("")
    try {
      await onConfirm(model.id)
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to delete model")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Model">
      <div className="space-y-4 pt-2">
        {error && <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete <strong>{model?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
