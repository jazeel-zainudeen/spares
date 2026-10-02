"use client"

import { useEffect } from "react"

export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    const unregisterStaleWorkers = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(
        registrations.map(async (registration) => {
          const scope = registration.scope || "/"
          if (scope.includes("localhost") || process.env.NODE_ENV !== "production") {
            await registration.unregister()
          }
        })
      )
    }

    if (process.env.NODE_ENV !== "production") {
      void unregisterStaleWorkers()
      return
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("AutoParts Pro Service Worker registered with scope:", registration.scope)

          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (!installingWorker) return

            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("New content available; a refresh will apply the latest version.")
              }
            }
          }
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    })
  }, [])

  return null
}
