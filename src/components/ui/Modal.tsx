import * as React from "react"
import { Dialog, IconButton } from "@radix-ui/themes"
import { X } from "lucide-react"

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode 
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{title}</Dialog.Title>
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <Dialog.Close>
            <IconButton variant="ghost" color="gray" size="2">
              <X height="16" width="16" />
            </IconButton>
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  )
}
