'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RoadmapZoomClass {
  id: string;
  name: string;
  badge: string;
  meetingId: string;
  passcode: string;
  url: string;
  highlight?: boolean;
}

export interface RoadmapZoomConfig {
  classes: RoadmapZoomClass[];
  globalPasscode: string;
  updatedAt?: string;
}

const DEFAULT_BATCH3_CLASSES: RoadmapZoomClass[] = [
  { id: '1', name: 'Angkatan 1', badge: 'Ahli Pertama', meetingId: '812 3456 7890', passcode: 'PRAKOM2026', url: 'https://zoom.us/j/81234567890', highlight: true },
  { id: '2', name: 'Angkatan 2', badge: 'Ahli Pertama', meetingId: '812 3456 7891', passcode: 'PRAKOM2026', url: 'https://zoom.us/j/81234567891' },
  { id: '3', name: 'Angkatan 3', badge: 'Ahli Pertama', meetingId: '812 3456 7892', passcode: 'PRAKOM2026', url: 'https://zoom.us/j/81234567892' },
  { id: '4', name: 'Angkatan 4', badge: 'Ahli Pertama', meetingId: '812 3456 7893', passcode: 'PRAKOM2026', url: 'https://zoom.us/j/81234567893' },
  { id: '5', name: 'Angkatan 5', badge: 'Terampil', meetingId: '812 3456 7894', passcode: 'PRAKOM2026', url: 'https://zoom.us/j/81234567894' },
  { id: '6', name: 'Angkatan 6', badge: 'Terampil', meetingId: '812 3456 7895', passcode: 'PRAKOM2026', url: 'https://zoom.us/j/81234567895' },
];

const DEFAULT_BATCH4_CLASSES: RoadmapZoomClass[] = [
  { id: '1', name: 'Angkatan 1', badge: 'Ahli Pertama', meetingId: '824 5566 7711', passcode: 'AGRASENA4', url: 'https://zoom.us/j/82455667711', highlight: true },
  { id: '2', name: 'Angkatan 2', badge: 'Ahli Pertama', meetingId: '824 5566 7712', passcode: 'AGRASENA4', url: 'https://zoom.us/j/82455667712' },
  { id: '3', name: 'Angkatan 3', badge: 'Ahli Pertama', meetingId: '824 5566 7713', passcode: 'AGRASENA4', url: 'https://zoom.us/j/82455667713' },
  { id: '4', name: 'Angkatan 4', badge: 'Ahli Pertama', meetingId: '824 5566 7714', passcode: 'AGRASENA4', url: 'https://zoom.us/j/82455667714' },
  { id: '5', name: 'Angkatan 5', badge: 'Terampil', meetingId: '824 5566 7715', passcode: 'AGRASENA4', url: 'https://zoom.us/j/82455667715' },
  { id: '6', name: 'Angkatan 6', badge: 'Terampil', meetingId: '824 5566 7716', passcode: 'AGRASENA4', url: 'https://zoom.us/j/82455667716' },
];

export function getDefaultRoadmapConfig(batchNum: 3 | 4 = 3): RoadmapZoomConfig {
  return {
    classes: batchNum === 4 ? DEFAULT_BATCH4_CLASSES : DEFAULT_BATCH3_CLASSES,
    globalPasscode: batchNum === 4 ? 'AGRASENA4' : 'PRAKOM2026',
  };
}

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
