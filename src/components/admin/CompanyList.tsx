"use client"

import { useState } from "react"
import { CompanyRow } from "@/lib/services/companies"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
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
    setEditingCategoryNull:
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
      window.location.reload()
    }
  }

  const onConfirmDelete = async (id: string) => {
    const res = await deleteCompanyAction(id)
    if (res.error) throw new Error(res.error)
    setCompanies(companies.filter(c => c.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Companies</h1>
          <p className="text-sm text-muted-foreground">Manage manufacturers and automotive brands</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Companies</CardTitle>
              <CardDescription>Total {companies.length} manufacturers listed</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search ? "No companies found matching your search." : "No companies added yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map(company => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell className="text-muted-foreground">{company.slug}</TableCell>
                    <TableCell>
                      {company.logo_url ? (
                        <div className="flex h-8 w-16 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={company.logo_url} alt={company.name} className="h-full object-contain" />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No logo</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(company)}
                          aria-label="Edit company"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(company)}
                          aria-label="Delete company"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
