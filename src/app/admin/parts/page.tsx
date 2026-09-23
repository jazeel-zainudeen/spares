import { PartList } from "@/components/admin/PartList"
import { fetchPartsAction } from "@/app/actions/parts"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchModelsAction } from "@/app/actions/models"

export default async function PartsPage() {
  const [
    { data: initialParts = [], error: partsError }, 
    { data: categories = [], error: categoriesError },
    { data: companies = [], error: companiesError },
    { data: models = [], error: modelsError }
  ] = await Promise.all([
    fetchPartsAction(),
    fetchCategoriesAction(),
    fetchCompaniesAction(),
    fetchModelsAction()
  ])

  if (partsError || categoriesError || companiesError || modelsError) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Failed to load data</h2>
        <p>{partsError || categoriesError || companiesError || modelsError}</p>
      </div>
    )
  }

  return <PartList initialParts={initialParts} categories={categories} companies={companies} models={models} />
}
