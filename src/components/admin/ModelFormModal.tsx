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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "")
      setCompanyId(initialData?.company_id || "")
      setCompanyId(initialData?.company_id || "")
      setError("")
      setFieldErrors({})
    }
  }, [isOpen, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: Record<string, string> = {}
    if (!companyId) errors.companyId = "Company is required"
    if (!name) errors.name = "Model Name is required"

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
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Company *</label>
          <div className="flex items-center gap-2">
            <Select 
              options={[{ label: "Select a company...", value: "" }, ...companyOptions]}
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value)
                if (fieldErrors.companyId) setFieldErrors(prev => ({ ...prev, companyId: "" }))
              }}
              disabled={loading}
              className={fieldErrors.companyId ? "flex-1 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : "flex-1"}
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
          {fieldErrors.companyId && <p className="text-xs text-red-500 mt-1">{fieldErrors.companyId}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Model Name *</label>
          <Input 
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: "" }))
            }}
            placeholder="e.g. Corolla"
            disabled={loading}
            className={fieldErrors.name ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : ""}
          />
          {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
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
