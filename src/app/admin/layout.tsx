import { AdminLayout } from "@/components/layout/AdminLayout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Spare Parts Catalog",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
