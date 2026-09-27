import { PublicLayout } from "@/components/layout/PublicLayout"

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
