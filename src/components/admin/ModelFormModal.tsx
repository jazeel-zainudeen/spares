"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import type { ModelRow } from "@/lib/services/models"
import type { CompanyRow } from "@/lib/services/companies"
import { Plus } from "lucide-react"
import { CompanyFormModal } from "./CompanyFormModal"
import { createCompanyAction } from "@/app/actions/companies"

interface ModelFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: ModelRow | null
  companies: CompanyRow[]
}

export function ModelFormModal({ isOpen, onClose, onSave, initialData, companies }: ModelFormModalProps) {
  const [name, setName] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "")
      setCompanyId(initialData?.company_id || "")
      setError("")
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !companyId) {
      setError("Name and company are required")
      return
    }

    setLoading(true)
    setError("")
    try {
      await onSave({
        name,
        company_id: companyId,
      })
      onClose()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const companyOptions = companies.map(c => ({
    label: c.name,
    value: c.id
  }))

  const handleSaveCompany = async (data: any) => {
    const res = await createCompanyAction(data)
    if (res.error) throw new Error(res.error)
    setIsCompanyModalOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Model" : "Add Model"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Company *</label>
          <div className="flex items-center gap-2">
            <Select 
              options={[{ label: "Select a company...", value: "" }, ...companyOptions]}
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsCompanyModalOpen(true)}
              className="h-9 w-9 shrink-0"
              title="Add New Company"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Model Name *</label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Corolla"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>

      <CompanyFormModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSave={handleSaveCompany}
      />
    </Modal>
  )
}
