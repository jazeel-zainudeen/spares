"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload"
import { CompanyRow } from "@/lib/services/companies"

interface CompanyFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: CompanyRow | null
}

export function CompanyFormModal({ isOpen, onClose, onSave, initialData }: CompanyFormModalProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "")
      setSlug(initialData?.slug || "")
      setLogoUrl(initialData?.logo_url || "")
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
    if (!name || !slug) {
      setError("Name and slug are required")
      return
    }

    setLoading(true)
    setError("")
    try {
      await onSave({ name, slug, logo_url: logoUrl || null })
      onClose()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Company" : "Add Company"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Company Name *
          </label>
          <Input
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Toyota"
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Slug *
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. toyota"
            disabled={loading}
            required
          />
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
