"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed inset-x-0 bottom-0 top-auto z-50 w-full max-w-full sm:max-w-2xl sm:mx-auto sm:mb-4 rounded-t-2xl sm:rounded-2xl border-t sm:border border-border bg-card p-6 shadow-2xl max-h-[88vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300 ease-out">
        {/* Mobile drawer handle pill */}
        <div className="mx-auto -mt-2 mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/30 sm:hidden" />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-3">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
