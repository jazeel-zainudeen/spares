import { getCategories } from "@/lib/services/categories"
import { CategoryList } from "@/components/admin/CategoryList"

export const metadata = {
  title: "Manage Categories - Admin",
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()
  
  return (
    <CategoryList initialCategories={categories} />
  )
}
