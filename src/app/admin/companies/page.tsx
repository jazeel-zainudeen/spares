import { CompanyList } from "@/components/admin/CompanyList"
import { fetchCompaniesAction } from "@/app/actions/companies"

export default async function CompaniesPage() {
  const { data: initialCompanies = [], error } = await fetchCompaniesAction()

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Failed to load companies</h2>
        <p>{error}</p>
      </div>
    )
  }

  return <CompanyList initialCompanies={initialCompanies} />
}
