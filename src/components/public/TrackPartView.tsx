"use client"

import { useEffect } from "react"
import { useUserCollection, CompactPart } from "@/contexts/UserCollectionContext"

export function TrackPartView({ part }: { part: CompactPart }) {
  const { addRecentlyViewed } = useUserCollection()

  useEffect(() => {
    addRecentlyViewed(part)
  }, [part.id]) // Intentionally not including addRecentlyViewed in dependency array to avoid loops

  return null
}
