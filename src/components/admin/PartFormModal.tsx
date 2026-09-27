"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import type { PartRow } from "@/lib/services/parts"
import { getPartImages, getPartPublicIds } from "@/lib/utils/images"
import type { CategoryRow } from "@/lib/services/categories"
import type { CompanyRow } from "@/lib/services/companies"
import type { ModelRow } from "@/lib/services/models"
import { CloudinaryMultiUpload, ImageItem } from "@/components/ui/CloudinaryMultiUpload"

interface PartFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: PartRow | null
  categories: CategoryRow[]
  companies: CompanyRow[]
  models: ModelRow[]
}

export function PartFormModal({ isOpen, onClose, onSave, initialData, categories, companies, models }: PartFormModalProps) {
  const [categoryId, setCategoryId] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [modelId, setModelId] = useState("")
  const [refNumber, setRefNumber] = useState("")
  const [oemNumber, setOemNumber] = useState("")
  const [item, setItem] = useState("")
  const [description, setDescription] = useState("")
  
  // Cloudinary multi-images state
  const [imagesList, setImagesList] = useState<ImageItem[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const model = models.find(m => m.id === initialData.model_id)
        setCategoryId(initialData.category_id || "")
        setCompanyId(model?.company_id || "")
        setModelId(initialData.model_id)
        setRefNumber(initialData.ref_number)
        setOemNumber(initialData.oem_number || "")
        setItem(initialData.item)
        setDescription(initialData.description || "")

        const urls = getPartImages(initialData)
        const publicIds = getPartPublicIds(initialData)
        const combinedImages: ImageItem[] = urls.map((url, idx) => ({
          url,
          publicId: publicIds[idx] || "",
        }))
        setImagesList(combinedImages)
      } else {
        setCategoryId("")
        setCompanyId("")
        setModelId("")
        setRefNumber("")
        setOemNumber("")
        setItem("")
        setDescription("")
        setImagesList([])
      }
      setError("")
    }
  }, [isOpen, initialData, models])

  // Dependent dropdown models
  const availableModels = models.filter(m => m.company_id === companyId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modelId || !refNumber || !item) {
      setError("Model, Reference Number, and Item Name are required")
      return
    }

    setLoading(true)
    setError("")
    try {
      const imageUrls = imagesList.map((img) => img.url).filter(Boolean)
      const cloudinaryPublicIds = imagesList.map((img) => img.publicId).filter(Boolean)

      await onSave({
        category_id: categoryId || null,
        model_id: modelId,
        ref_number: refNumber,
        oem_number: oemNumber || null,
        item,
        description: description || null,
        image_url: imageUrls[0] || null,
        cloudinary_public_id: cloudinaryPublicIds[0] || null,
        image_urls: imageUrls,
        cloudinary_public_ids: cloudinaryPublicIds,
      })
      onClose()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleCompanyChange = (val: string) => {
    setCompanyId(val)
    setModelId("") // reset model when company changes
  }

  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }))
  const companyOptions = companies.map(c => ({ label: c.name, value: c.id }))
  const modelOptions = availableModels.map(m => ({ label: m.name, value: m.id }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Part" : "Add Part"}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Category</label>
          <Select 
            options={[{ label: "Select Category...", value: "" }, ...categoryOptions]}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Company</label>
            <Select 
              options={[{ label: "Select Company...", value: "" }, ...companyOptions]}
              value={companyId}
              onChange={(e) => handleCompanyChange(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Model</label>
            <Select 
              options={[{ label: "Select Model...", value: "" }, ...modelOptions]}
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              disabled={loading || !companyId}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Ref Number *</label>
            <Input 
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. REF-12345"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">OEM Number</label>
            <Input 
              value={oemNumber}
              onChange={(e) => setOemNumber(e.target.value)}
              placeholder="e.g. OEM-67890"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Item Name *</label>
          <Input 
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. Front Brake Pad"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Description</label>
          <Input 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item description..."
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Part Images</label>
          <CloudinaryMultiUpload 
            images={imagesList}
            folder={`spare-parts/${companyId || "general"}/${modelId || "general"}`}
            onChange={(newImages) => setImagesList(newImages)}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background/95 backdrop-blur py-2">
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
