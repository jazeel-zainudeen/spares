"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { trackAction } from "@/lib/tracking"
import { Input } from "@/components/ui/Input"
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload"
import type { CompanyRow } from "@/lib/services/companies"

interface CompanyFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: CompanyRow | null
}

export function CompanyFormModal({ isOpen, onClose, onSave, initialData }: CompanyFormModalProps) {
  const [name, setName] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "")
      setLogoUrl(initialData?.logo_url || "")
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
      await onSave({ name, logo_url: logoUrl || null })
      trackAction(`🏢 *Admin ${initialData ? 'updated' : 'created'} company:* \`${name}\``)
      onClose()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Company" : "Add Company"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Company Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: "" }))
            }}
            placeholder="e.g. Toyota"
            disabled={loading}
            required
            className={fieldErrors.name ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : ""}
          />
          {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Company Logo
          </label>
          <CloudinaryUpload
            value={logoUrl}
            folder="companies/logos"
            onChange={(url) => setLogoUrl(url)}
            onRemove={() => setLogoUrl("")}
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
