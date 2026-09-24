"use client"

import { useState } from "react"
import { CompanyRow } from "@/lib/services/companies"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { CompanyFormModal } from "./CompanyFormModal"
import { DeleteCompanyModal } from "./DeleteCompanyModal"
import { createCompanyAction, updateCompanyAction, deleteCompanyAction } from "@/app/actions/companies"
import { Flex, Box, Heading, Text, Card, TextField } from "@radix-ui/themes"

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
      window.location.reload()
    }
  }

  const onConfirmDelete = async (id: string) => {
    const res = await deleteCompanyAction(id)
    if (res.error) throw new Error(res.error)
    setCompanies(companies.filter(c => c.id !== id))
  }

  return (
    <Flex direction="column" gap="6">
      <Flex direction={{ initial: 'column', sm: 'row' }} align={{ sm: 'center' }} justify="between" gap="4">
        <Heading size="8" style={{ letterSpacing: '-0.02em' }}>Companies</Heading>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </Flex>

      <Card size="3" variant="surface">
        <Box mb="5">
          <TextField.Root 
            placeholder="Search companies..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="2"
            style={{ maxWidth: '300px' }}
          >
            <TextField.Slot>
              <Search height="16" width="16" color="var(--gray-a10)" />
            </TextField.Slot>
          </TextField.Root>
        </Box>

        {filteredCompanies.length === 0 ? (
          <Box py="8" style={{ textAlign: 'center' }}>
            <Text color="gray">
              {search ? "No companies found matching your search." : "No companies added yet."}
            </Text>
          </Box>
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
                      <Box style={{ height: '32px', width: '64px', backgroundColor: 'var(--gray-a3)', borderRadius: 'var(--radius-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={company.logo_url} alt={company.name} style={{ height: '100%', objectFit: 'contain' }} />
                      </Box>
                    ) : (
                      <Text size="1" color="gray">No logo</Text>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Flex justify="end" gap="2">
                      <Button variant="ghost" size="icon-sm" color="gray" onClick={() => handleEdit(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" color="red" onClick={() => handleDelete(company)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
    </Flex>
  )
}
