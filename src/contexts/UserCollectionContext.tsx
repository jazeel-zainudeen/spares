"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export interface CompactPart {
  id: string
  name: string
  categorySlug?: string
  companySlug?: string
  modelSlug?: string
  imageUrl?: string
}

export interface SavedFolder {
  id: string
  name: string
}

export interface SavedItem {
  part: CompactPart
  folderId: string
  savedAt: number
}

interface UserCollectionContextType {
  recentlyViewed: CompactPart[]
  addRecentlyViewed: (part: CompactPart) => void
  clearRecentlyViewed: () => void

  folders: SavedFolder[]
  createFolder: (name: string) => void
  deleteFolder: (id: string) => void

  savedItems: SavedItem[]
  toggleSavedItem: (part: CompactPart, folderId?: string) => void
  removeSavedItem: (partId: string) => void
  isSaved: (partId: string, folderId?: string) => boolean
}

const UserCollectionContext = createContext<UserCollectionContextType | undefined>(undefined)

export function UserCollectionProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<CompactPart[]>([])
  const [folders, setFolders] = useState<SavedFolder[]>([{ id: "default", name: "My Saved Parts" }])
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from local storage
  useEffect(() => {
    try {
      const storedRecent = localStorage.getItem("spares_recent")
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent))

      const storedFolders = localStorage.getItem("spares_folders")
      if (storedFolders) setFolders(JSON.parse(storedFolders))

      const storedItems = localStorage.getItem("spares_saved")
      if (storedItems) setSavedItems(JSON.parse(storedItems))
    } catch (error) {
      console.error("Error parsing user collections", error)
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem("spares_recent", JSON.stringify(recentlyViewed))
    localStorage.setItem("spares_folders", JSON.stringify(folders))
    localStorage.setItem("spares_saved", JSON.stringify(savedItems))
  }, [recentlyViewed, folders, savedItems, isLoaded])

  const addRecentlyViewed = (part: CompactPart) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== part.id)
      return [part, ...filtered].slice(0, 30) // Keep last 30
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  const createFolder = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    setFolders((prev) => [...prev, { id, name }])
  }

  const deleteFolder = (id: string) => {
    if (id === "default") return
    setFolders((prev) => prev.filter((f) => f.id !== id))
    // Move items to default
    setSavedItems((prev) =>
      prev.map((item) => (item.folderId === id ? { ...item, folderId: "default" } : item))
    )
  }

  const toggleSavedItem = (part: CompactPart, folderId: string = "default") => {
    setSavedItems((prev) => {
      const existsInFolder = prev.some((item) => item.part.id === part.id && item.folderId === folderId)
      if (existsInFolder) {
        return prev.filter((item) => !(item.part.id === part.id && item.folderId === folderId))
      } else {
        return [{ part, folderId, savedAt: Date.now() }, ...prev]
      }
    })
  }

  const removeSavedItem = (partId: string) => {
    setSavedItems((prev) => prev.filter((item) => item.part.id !== partId))
  }

  const isSaved = (partId: string, folderId?: string) => {
    if (folderId) {
      return savedItems.some((item) => item.part.id === partId && item.folderId === folderId)
    }
    return savedItems.some((item) => item.part.id === partId)
  }

  return (
    <UserCollectionContext.Provider
      value={{
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
        folders,
        createFolder,
        deleteFolder,
        savedItems,
        toggleSavedItem,
        removeSavedItem,
        isSaved,
      }}
    >
      {children}
    </UserCollectionContext.Provider>
  )
}

export function useUserCollection() {
  const context = useContext(UserCollectionContext)
  if (context === undefined) {
    throw new Error("useUserCollection must be used within a UserCollectionProvider")
  }
  return context
}
