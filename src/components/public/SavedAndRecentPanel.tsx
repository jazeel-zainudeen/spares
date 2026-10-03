"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useUserCollection } from "@/contexts/UserCollectionContext"
import { Bookmark, Clock, X, Trash2, Folder, ChevronRight, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export function SavedAndRecentPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { recentlyViewed, savedItems, folders, removeSavedItem, deleteFolder, clearRecentlyViewed } = useUserCollection()
  const [activeTab, setActiveTab] = useState<"saved" | "recent">("saved")
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeFolder = activeFolderId ? folders.find(f => f.id === activeFolderId) : null
  const folderItems = activeFolderId ? savedItems.filter(i => i.folderId === activeFolderId) : []

  const content = (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div className={`fixed inset-y-0 right-0 z-[110] w-[90vw] max-w-sm bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Your Collection</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-1 border-b border-border/60 bg-muted/20">
          <button
            onClick={() => { setActiveTab("saved"); setActiveFolderId(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "saved" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            <Bookmark className="h-4 w-4" />
            Saved Lists
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "recent" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            <Clock className="h-4 w-4" />
            Recently Viewed
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* TAB: RECENT */}
          {activeTab === "recent" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">History ({recentlyViewed.length})</span>
                {recentlyViewed.length > 0 && (
                  <button onClick={clearRecentlyViewed} className="text-xs text-destructive hover:underline">Clear all</button>
                )}
              </div>
              
              {recentlyViewed.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <Clock className="h-8 w-8 opacity-20" />
                  <p>No recently viewed parts.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentlyViewed.map(part => (
                    <Link
                      key={part.id}
                      href={`/spare-parts/${part.categorySlug}/${part.companySlug}/${part.modelSlug || 'model'}/${part.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                      <div className="h-12 w-12 shrink-0 rounded-md bg-muted/30 flex items-center justify-center overflow-hidden">
                        {part.imageUrl ? (
                          <img src={part.imageUrl} alt={part.name} className="h-full w-full object-contain p-1" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{part.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{part.categorySlug} • {part.companySlug}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SAVED (Folders View) */}
          {activeTab === "saved" && !activeFolderId && (
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Folders</span>
              {folders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No folders created.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {folders.map(folder => {
                    const count = savedItems.filter(i => i.folderId === folder.id).length
                    return (
                      <div
                        key={folder.id}
                        className="w-full flex items-center justify-between py-2 pl-3 pr-1.5 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all group"
                      >
                        <button
                          onClick={() => setActiveFolderId(folder.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Folder className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{folder.name}</p>
                            <p className="text-xs text-muted-foreground">{count} item{count !== 1 && 's'}</p>
                          </div>
                        </button>

                        <div className="flex items-center gap-0.5 shrink-0 ml-2">
                          {folder.id !== "default" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFolder(folder.id);
                              }}
                              className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Delete Folder"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setActiveFolderId(folder.id)}
                            className="p-2"
                          >
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: SAVED (Folder Items View) */}
          {activeTab === "saved" && activeFolderId && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setActiveFolderId(null)} className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>
                <h3 className="text-sm font-bold text-foreground flex-1 truncate">{activeFolder?.name}</h3>
                {activeFolderId !== "default" && (
                  <button onClick={() => { deleteFolder(activeFolderId); setActiveFolderId(null); }} className="text-xs text-destructive hover:underline p-1">Delete Folder</button>
                )}
              </div>

              {folderItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <Bookmark className="h-8 w-8 opacity-20" />
                  <p>No items in this folder.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {folderItems.map(item => (
                    <div key={item.part.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/60 bg-card group">
                      <Link
                        href={`/spare-parts/${item.part.categorySlug}/${item.part.companySlug}/${item.part.modelSlug || 'model'}/${item.part.id}`}
                        onClick={onClose}
                        className="h-12 w-12 shrink-0 rounded-md bg-muted/30 flex items-center justify-center overflow-hidden hover:opacity-80"
                      >
                        {item.part.imageUrl ? (
                          <img src={item.part.imageUrl} alt={item.part.name} className="h-full w-full object-contain p-1" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </Link>
                      <Link
                        href={`/spare-parts/${item.part.categorySlug}/${item.part.companySlug}/${item.part.modelSlug || 'model'}/${item.part.id}`}
                        onClick={onClose}
                        className="flex-1 min-w-0"
                      >
                        <p className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">{item.part.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.part.categorySlug} • {item.part.companySlug}</p>
                      </Link>
                      <button
                        onClick={() => removeSavedItem(item.part.id, activeFolderId || undefined)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove from folder"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}
