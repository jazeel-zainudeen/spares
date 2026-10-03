"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import type { PartRow } from "@/lib/services/parts"
import { getPartPublicIds } from "@/lib/utils/images"
import { trackAction } from "@/lib/tracking"

interface DeletePartModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, cloudinaryPublicId?: string | string[] | null) => Promise<void>
  part: PartRow | null
}

export function DeletePartModal({ isOpen, onClose, onConfirm, part }: DeletePartModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const publicIds = getPartPublicIds(part)

  const handleConfirm = async () => {
    if (!part) return
    setLoading(true)
    setError("")
    try {
      await onConfirm(part.id, publicIds)
      trackAction(`🗑️ *Admin deleted part:* \`${part.item}\` (ID: ${part.id})`)
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to delete part")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Part">
      <div className="space-y-4 pt-2">
        {error && <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete <strong>{part?.item}</strong> ({part?.ref_number})? 
          {publicIds.length > 0 && ` This will also permanently delete the ${publicIds.length} associated ${publicIds.length === 1 ? 'image' : 'images'}.`}
          {" "}This action cannot be undone.
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
