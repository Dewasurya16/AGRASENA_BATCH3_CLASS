'use client'

import * as React from "react"
import { BATCH4_ZOOM_CONFIG, BatchZoomConfig } from "@/data/batch4/zoom-config"
import { BATCH3_ZOOM_CONFIG } from "@/data/batch3/zoom-config"

export function useBatchZoomConfig(batchNum: 3 | 4 = 4) {
  const defaultConfig = batchNum === 3 ? BATCH3_ZOOM_CONFIG : BATCH4_ZOOM_CONFIG
  const cacheKey = batchNum === 3 ? "prakom_zoom_config_b3" : "prakom_zoom_config_b4"

  const [config, setConfig] = React.useState<BatchZoomConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          return { ...defaultConfig, ...parsed }
        }
      } catch {}
    }
    return defaultConfig
  })

  const [isLoading, setIsLoading] = React.useState(false)

  const fetchConfig = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/zoom-config?t=${Date.now()}`, { cache: "no-store" })
      if (res.ok) {
        const json = await res.json()
        const target = batchNum === 3 ? json.batch3 : json.batch4
        if (target) {
          const merged = { ...defaultConfig, ...target }
          setConfig(merged)
          try {
            localStorage.setItem(cacheKey, JSON.stringify(merged))
          } catch {}
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false)
    }
  }, [batchNum, cacheKey, defaultConfig])

  React.useEffect(() => {
    fetchConfig()

    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          setConfig({ ...defaultConfig, ...JSON.parse(cached) })
        }
      } catch {}
    }

    window.addEventListener("prakom-zoom-updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)

    return () => {
      window.removeEventListener("prakom-zoom-updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [fetchConfig, cacheKey, defaultConfig])

  return { config, isLoading, refetch: fetchConfig }
}
