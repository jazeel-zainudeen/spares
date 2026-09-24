"use client"

import { useEffect } from "react"

export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("AutoParts Pro Service Worker registered with scope:", registration.scope)

            // Listen for updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                    console.log("New content available; reloading on next visit.")
                  }
                }
              }
            }
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error)
          })
      })
    }
  }, [])

  return null
}
