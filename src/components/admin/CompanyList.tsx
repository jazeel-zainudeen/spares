"use client"

import { useState } from "react"
import { CompanyRow } from "@/lib/services/companies"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { CompanyFormModal } from "./CompanyFormModal"
import { DeleteCompanyModal } from "./DeleteCompanyModal"
import { createCompanyAction, updateCompanyAction, deleteCompanyAction } from "@/app/actions/companies"

export function CompanyList({ initialCompanies }: { initialCompanies: CompanyRow[] }) {
  const [companies, setCompanies] = useState<CompanyRow[]>(initialCompanies)
  const [search, setSearch] = useState("")
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<CompanyRow | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<CompanyRow | null>(null)

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setEditingCompany(null)
    setIsFormOpen(true)
  }

  const handleEdit = (company: CompanyRow) => {
    setEditingCompany(company)
    setIsFormOpen(true)
  }

  const handleDelete = (company: CompanyRow) => {
    setDeletingCompany(company)
    setIsDeleteOpen(true)
  }

  const onSaveCompany = async (data: any) => {
    if (editingCompany) {
      const res = await updateCompanyAction(editingCompany.id, data)
      if (res.error) throw new Error(res.error)
      setCompanies(companies.map(c => c.id === editingCompany.id ? { ...c, ...data } : c))
    } else {
      const res = await createCompanyAction(data)
      if (res.error) throw new Error(res.error)
      // Since it's a server action, it will revalidate the page. We can just wait for the refresh or optimistic update
      window.location.reload()
    }
  }

  const onConfirmDelete = async (id: string) => {
    const res = await deleteCompanyAction(id)
    if (res.error) throw new Error(res.error)
    setCompanies(companies.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="glass p-6 rounded-3xl">
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {search ? "No companies found matching your search." : "No companies added yet."}
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Logo</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(company => (
                <tr key={company.id}>
                  <td className="font-medium">{company.name}</td>
                  <td className="text-muted-foreground">{company.slug}</td>
                  <td>
                    {company.logo_url ? (
                      <div className="h-8 w-16 bg-white/5 rounded flex items-center justify-center overflow-hidden">
                        <img src={company.logo_url} alt={company.name} className="h-full object-contain" />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No logo</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(company)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <CompanyFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={onSaveCompany}
        initialData={editingCompany}
      />

      <DeleteCompanyModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onConfirmDelete}
        company={deletingCompany}
      />
    </div>
  )
}
