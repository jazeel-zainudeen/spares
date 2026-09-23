import { PartList } from "@/components/admin/PartList"
import { fetchPartsAction } from "@/app/actions/parts"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchModelsAction } from "@/app/actions/models"

export default async function PartsPage() {
  const [
    { data: initialParts = [], error: partsError }, 
    { data: companies = [], error: companiesError },
    { data: models = [], error: modelsError }
  ] = await Promise.all([
    fetchPartsAction(),
    fetchCompaniesAction(),
    fetchModelsAction()
  ])

  if (partsError || companiesError || modelsError) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Failed to load data</h2>
        <p>{partsError || companiesError || modelsError}</p>
      </div>
    )
  }

  return <PartList initialParts={initialParts} companies={companies} models={models} />
}
