"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { CompanyRow } from "@/lib/services/companies"

interface DeleteCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
  company: CompanyRow | null
}

export function DeleteCompanyModal({ isOpen, onClose, onConfirm, company }: DeleteCompanyModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConfirm = async () => {
    if (!company) return
    setLoading(true)
    setError("")
    try {
      await onConfirm(company.id)
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to delete company")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Company">
      <div className="space-y-4 pt-2">
        {error && <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete <strong>{company?.name}</strong>? This action cannot be undone.
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
