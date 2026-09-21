'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  RoadmapZoomClass,
  RoadmapZoomConfig,
  getDefaultRoadmapConfig,
  DEFAULT_BATCH3_CLASSES,
  DEFAULT_BATCH4_CLASSES,
} from '@/data/roadmap-zoom';

export type { RoadmapZoomClass, RoadmapZoomConfig };
export { getDefaultRoadmapConfig, DEFAULT_BATCH3_CLASSES, DEFAULT_BATCH4_CLASSES };

export function useRoadmapZoomConfig(batchNum: 3 | 4 = 3) {
  const [config, setConfig] = useState<RoadmapZoomConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`prakom_roadmap_zoom_batch${batchNum}`);
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached roadmap zoom config:', e);
      }
    }
    return getDefaultRoadmapConfig(batchNum);
  });
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch(`/api/roadmap-zoom?batch=${batchNum}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.classes && Array.isArray(data.classes)) {
          setConfig(data);
          try {
            localStorage.setItem(`prakom_roadmap_zoom_batch${batchNum}`, JSON.stringify(data));
          } catch (e) {
            console.error('Failed to save roadmap zoom config cache:', e);
          }
        }
      }
    } catch (err) {
      console.warn(`[RoadmapZoom] Failed to fetch config for batch ${batchNum}, using fallback:`, err);
    } finally {
      setLoading(false);
    }
  }, [batchNum]);

  useEffect(() => {
    fetchConfig();

    const handleUpdate = (e: CustomEvent) => {
      if (!e.detail || e.detail.batch === batchNum) {
        fetchConfig();
      }
    };

    window.addEventListener('prakom-roadmap-zoom-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('prakom-roadmap-zoom-updated', handleUpdate as EventListener);
    };
  }, [batchNum, fetchConfig]);

  return { config, loading, refresh: fetchConfig };
}
