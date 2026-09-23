import { ModelList } from "@/components/admin/ModelList"
import { fetchModelsAction } from "@/app/actions/models"
import { fetchCompaniesAction } from "@/app/actions/companies"

export default async function ModelsPage() {
  const [{ data: initialModels = [], error: modelsError }, { data: companies = [], error: companiesError }] = await Promise.all([
    fetchModelsAction(),
    fetchCompaniesAction()
  ])

  if (modelsError || companiesError) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Failed to load data</h2>
        <p>{modelsError || companiesError}</p>
      </div>
    )
  }

  return <ModelList initialModels={initialModels} companies={companies} />
}
