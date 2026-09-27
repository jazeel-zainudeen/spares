import { PublicLayout } from "@/components/layout/PublicLayout"

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
