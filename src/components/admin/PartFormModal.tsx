"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import type { PartRow } from "@/lib/services/parts"
import { getPartImages, getPartPublicIds } from "@/lib/utils/images"
import { trackAction } from "@/lib/tracking"
import type { CategoryRow } from "@/lib/services/categories"
import type { CompanyRow } from "@/lib/services/companies"

import type { ModelRow } from "@/lib/services/models"
import { CloudinaryMultiUpload, ImageItem } from "@/components/ui/CloudinaryMultiUpload"
import { Plus } from "lucide-react"
import { CategoryFormModal } from "./CategoryFormModal"
import { CompanyFormModal } from "./CompanyFormModal"
import { ModelFormModal } from "./ModelFormModal"
import { createCategoryAction } from "@/app/actions/categories"
import { createCompanyAction } from "@/app/actions/companies"
import { createModelAction } from "@/app/actions/models"

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [isModelModalOpen, setIsModelModalOpen] = useState(false)

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
      setFieldErrors({})
    }
  }, [isOpen, initialData, models])

  // Dependent dropdown models
  const availableModels = companyId ? models.filter(m => m.company_id === companyId) : models

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors: Record<string, string> = {}
    if (!companyId) errors.companyId = "Company is required"
    if (!modelId) errors.modelId = "Model is required"
    if (!refNumber) errors.refNumber = "Ref Number is required"
    if (!item) errors.item = "Item Name is required"

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
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
      trackAction(`🛠️ *Admin ${initialData ? 'updated' : 'created'} part:* \`${item}\` (Ref: ${refNumber})`)
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

  const handleSaveCategory = async (data: any) => {
    const res = await createCategoryAction(data)
    if (res.error) throw new Error(res.error)
    setIsCategoryModalOpen(false)
  }

  const handleSaveCompany = async (data: any) => {
    const res = await createCompanyAction(data)
    if (res.error) throw new Error(res.error)
    setIsCompanyModalOpen(false)
  }

  const handleSaveModel = async (data: any) => {
    const res = await createModelAction(data)
    if (res.error) throw new Error(res.error)
    setIsModelModalOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Part" : "Add Part"}>
      <form onSubmit={handleSubmit} className="flex max-h-[70vh] min-h-0 flex-col" noValidate>
        <div className="min-h-0 space-y-4 overflow-y-auto pr-2 pb-4">
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Category</label>
            <div className="flex items-center gap-2">
              <Select
                options={[{ label: "Select Category...", value: "" }, ...categoryOptions]}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsCategoryModalOpen(true)}
                className="h-9 w-9 shrink-0"
                title="Add New Category"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Company *</label>
              <div className="flex items-center gap-2">
                <Select
                  options={[{ label: "Select Company...", value: "" }, ...companyOptions]}
                  value={companyId}
                  onChange={(e) => {
                    handleCompanyChange(e.target.value)
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
              <label className="text-sm font-medium leading-none">Model *</label>
              <div className="flex items-center gap-2">
                <Select
                  options={[{ label: "Select Model...", value: "" }, ...modelOptions]}
                  value={modelId}
                  onChange={(e) => {
                    const newModelId = e.target.value
                    setModelId(newModelId)
                    if (fieldErrors.modelId) setFieldErrors(prev => ({ ...prev, modelId: "" }))

                    // Auto-fill company if a model is selected and company is empty
                    if (newModelId && !companyId) {
                      const modelObj = models.find(m => m.id === newModelId)
                      if (modelObj?.company_id) setCompanyId(modelObj.company_id)
                    }
                  }}
                  disabled={loading}
                  className={fieldErrors.modelId ? "flex-1 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : "flex-1"}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsModelModalOpen(true)}
                  disabled={loading}
                  className="h-9 w-9 shrink-0"
                  title="Add New Model"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {fieldErrors.modelId && <p className="text-xs text-red-500 mt-1">{fieldErrors.modelId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Ref Number *</label>
              <Input
                value={refNumber}
                onChange={(e) => {
                  setRefNumber(e.target.value)
                  if (fieldErrors.refNumber) setFieldErrors(prev => ({ ...prev, refNumber: "" }))
                }}
                placeholder="e.g. REF-12345"
                disabled={loading}
                className={fieldErrors.refNumber ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : ""}
              />
              {fieldErrors.refNumber && <p className="text-xs text-red-500 mt-1">{fieldErrors.refNumber}</p>}
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
              onChange={(e) => {
                setItem(e.target.value)
                if (fieldErrors.item) setFieldErrors(prev => ({ ...prev, item: "" }))
              }}
              placeholder="e.g. Front Brake Pad"
              disabled={loading}
              className={fieldErrors.item ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : ""}
            />
            {fieldErrors.item && <p className="text-xs text-red-500 mt-1">{fieldErrors.item}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Description</label>
            <Textarea
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
        </div>

        <div className="flex shrink-0 justify-end space-x-2 border-t bg-background/95 py-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
      
      <CompanyFormModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSave={handleSaveCompany}
      />

      <ModelFormModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        onSave={handleSaveModel}
        companies={companies}
      />
    </Modal>
  )
}
