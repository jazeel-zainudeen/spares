"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { ModelRow } from "@/lib/services/models"
import { CompanyRow } from "@/lib/services/companies"

interface ModelFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: ModelRow | null
  companies: CompanyRow[]
}

export function ModelFormModal({ isOpen, onClose, onSave, initialData, companies }: ModelFormModalProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "")
      setSlug(initialData?.slug || "")
      setCompanyId(initialData?.company_id || "")
      setError("")
    }
  }, [isOpen, initialData])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (!initialData) {
      setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug || !companyId) {
      setError("Name, slug, and company are required")
      return
    }

    setLoading(true)
    setError("")
    try {
      await onSave({ name, slug, company_id: companyId })
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Model" : "Add Model"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Company</label>
          <Select 
            options={[{ label: "Select a company...", value: "" }, ...companyOptions]}
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Model Name</label>
          <Input 
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Corolla"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Slug</label>
          <Input 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. corolla"
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
    </Modal>
  )
}
