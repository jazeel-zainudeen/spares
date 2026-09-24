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

import { Pagination } from "@/components/ui/Pagination"

const PAGE_SIZE = 10

export function CompanyList({ initialCompanies }: { initialCompanies: CompanyRow[] }) {
  const [companies, setCompanies] = useState<CompanyRow[]>(initialCompanies)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<CompanyRow | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<CompanyRow | null>(null)

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE)
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

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
        <Button onClick={handleAdd} className="gap-2 self-start sm:self-auto">
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
                onChange={(e) => handleSearchChange(e.target.value)}
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
            <>
              {/* Mobile View: Cards */}
              <div className="grid grid-cols-1 gap-3 sm:hidden">
                {paginatedCompanies.map(company => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {company.logo_url ? (
                        <div className="flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground">
                          No logo
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">{company.name}</div>
                        <div className="text-xs text-muted-foreground font-mono truncate">{company.slug}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
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
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Table */}
              <div className="hidden sm:block">
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
                    {paginatedCompanies.map(company => (
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
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredCompanies.length}
                pageSize={PAGE_SIZE}
              />
            </>
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
