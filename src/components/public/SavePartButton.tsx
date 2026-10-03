"use client"

import { useState } from "react"
import { useUserCollection, CompactPart } from "@/contexts/UserCollectionContext"
import { Bookmark, FolderPlus, Check, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import * as PopoverPrimitive from "@radix-ui/react-popover"

export function SavePartButton({ part }: { part: CompactPart }) {
  const { isSaved, toggleSavedItem, folders, createFolder, savedItems } = useUserCollection()
  const [isOpen, setIsOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const savedState = isSaved(part.id)

  const handleToggle = (folderId: string) => {
    toggleSavedItem(part, folderId)
    // Removed setIsOpen(false) to allow multiple selections
  }

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim())
      setNewFolderName("")
      setIsCreating(false)
    }
  }

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          type="button"
          variant={savedState ? "default" : "outline"}
          size="sm"
          className="gap-2 shrink-0 transition-all duration-300 active:scale-95"
          aria-label={savedState ? "Saved to List" : "Save Part"}
        >
          <Bookmark className={`h-4 w-4 ${savedState ? "fill-current" : ""}`} />
          {savedState ? "Saved" : "Save"}
          <ChevronDown className="h-3 w-3 opacity-70 ml-1" />
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 overflow-hidden rounded-xl border border-border bg-popover p-2 shadow-xl shadow-black/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          <div className="mb-2 px-2 pb-2 pt-1 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Save to Folder
          </div>

          <div className="max-h-[50vh] overflow-y-auto space-y-1">
            {folders.map((folder) => {
              const isSelected = isSaved(part.id, folder.id)
              return (
                <button
                  key={folder.id}
                  onClick={() => handleToggle(folder.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent/80 ${
                    isSelected ? "bg-primary/10 font-medium text-primary" : "text-foreground"
                  }`}
                >
                  <span className="truncate">{folder.name}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              )
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-border/50">
            {isCreating ? (
              <form onSubmit={handleCreateFolder} className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Folder Name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="h-8 w-full rounded-md border border-border/80 bg-background px-2.5 text-xs text-foreground outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-7 text-xs flex-1">Cancel</Button>
                  <Button type="submit" size="sm" disabled={!newFolderName.trim()} className="h-7 text-xs flex-1">Create</Button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/80 hover:text-foreground"
              >
                <FolderPlus className="h-4 w-4" />
                <span>New Folder</span>
              </button>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
