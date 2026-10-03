import { PublicLayout } from "@/components/layout/PublicLayout"
import { GoToTopButton } from "@/components/public/GoToTopButton"

export default function SparePartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicLayout>
      {children}
      <GoToTopButton />
    </PublicLayout>
  )
}
