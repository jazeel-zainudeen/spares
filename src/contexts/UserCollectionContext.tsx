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
  removeSavedItem: (partId: string, folderId?: string) => void
  isSaved: (partId: string, folderId?: string) => boolean
}

const UserCollectionContext = createContext<UserCollectionContextType | undefined>(undefined)

export function UserCollectionProvider({ children }: { children: React.ReactNode }) {
  const [partsCache, setPartsCache] = useState<Record<string, CompactPart>>({})
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [savedRecords, setSavedRecords] = useState<{ i: string; f: string; t: number }[]>([])
  const [folders, setFolders] = useState<SavedFolder[]>([{ id: "default", name: "My Saved Parts" }])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from local storage
  useEffect(() => {
    try {
      const storedCache = localStorage.getItem("spares_cache")
      if (storedCache) setPartsCache(JSON.parse(storedCache))

      const storedRecent = localStorage.getItem("spares_recent_ids")
      if (storedRecent) setRecentIds(JSON.parse(storedRecent))

      const storedFolders = localStorage.getItem("spares_folders")
      if (storedFolders) setFolders(JSON.parse(storedFolders))

      const storedRecords = localStorage.getItem("spares_saved_records")
      if (storedRecords) setSavedRecords(JSON.parse(storedRecords))

      // Legacy migration logic could go here if needed, but since it's fresh we can skip for simplicity
    } catch (error) {
      console.error("Error parsing user collections", error)
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage with Garbage Collection
  useEffect(() => {
    if (!isLoaded) return
    
    // Garbage collect the parts cache so it doesn't grow infinitely
    const activeIds = new Set([...recentIds, ...savedRecords.map(r => r.i)])
    const cleanedCache: Record<string, CompactPart> = {}
    for (const id of activeIds) {
      if (partsCache[id]) cleanedCache[id] = partsCache[id]
    }
    
    localStorage.setItem("spares_cache", JSON.stringify(cleanedCache))
    localStorage.setItem("spares_recent_ids", JSON.stringify(recentIds))
    localStorage.setItem("spares_folders", JSON.stringify(folders))
    localStorage.setItem("spares_saved_records", JSON.stringify(savedRecords))
  }, [partsCache, recentIds, folders, savedRecords, isLoaded])

  const addRecentlyViewed = (part: CompactPart) => {
    setPartsCache((prev) => ({ ...prev, [part.id]: part }))
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== part.id)
      return [part.id, ...filtered].slice(0, 30) // Keep last 30
    })
  }

  const clearRecentlyViewed = () => {
    setRecentIds([])
  }

  const createFolder = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    setFolders((prev) => [...prev, { id, name }])
  }

  const deleteFolder = (id: string) => {
    if (id === "default") return
    setFolders((prev) => prev.filter((f) => f.id !== id))
    // Delete items associated with this folder
    setSavedRecords((prev) => prev.filter((r) => r.f !== id))
  }

  const toggleSavedItem = (part: CompactPart, folderId: string = "default") => {
    setPartsCache((prev) => ({ ...prev, [part.id]: part }))
    setSavedRecords((prev) => {
      const existsInFolder = prev.some((r) => r.i === part.id && r.f === folderId)
      if (existsInFolder) {
        return prev.filter((r) => !(r.i === part.id && r.f === folderId))
      } else {
        return [{ i: part.id, f: folderId, t: Date.now() }, ...prev]
      }
    })
  }

  const removeSavedItem = (partId: string, folderId?: string) => {
    setSavedRecords((prev) => prev.filter((r) => {
      if (folderId) {
        return !(r.i === partId && r.f === folderId)
      }
      return r.i !== partId
    }))
  }

  const isSaved = (partId: string, folderId?: string) => {
    if (folderId) {
      return savedRecords.some((r) => r.i === partId && r.f === folderId)
    }
    return savedRecords.some((r) => r.i === partId)
  }

  // Compute derived state for the Context API
  const computedRecentlyViewed = recentIds
    .map(id => partsCache[id])
    .filter(Boolean) as CompactPart[]

  const computedSavedItems = savedRecords
    .map(r => ({
      part: partsCache[r.i],
      folderId: r.f,
      savedAt: r.t
    }))
    .filter(item => item.part) as SavedItem[]

  return (
    <UserCollectionContext.Provider
      value={{
        recentlyViewed: computedRecentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
        folders,
        createFolder,
        deleteFolder,
        savedItems: computedSavedItems,
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
