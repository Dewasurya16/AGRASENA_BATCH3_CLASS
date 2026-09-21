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
  { id: '1', name: 'Angkatan 1', badge: 'Ahli Pertama', meetingId: '970 1734 2615', passcode: 'Biropeg-24', url: 'https://zoom.us/j/97017342615' },
  { id: '2', name: 'Angkatan 2', badge: 'Ahli Pertama', meetingId: '915 5650 9491', passcode: 'Biropeg-24', url: 'https://zoom.us/j/91556509491' },
  { id: '3', name: 'Angkatan 3', badge: 'Ahli Pertama', meetingId: '980 1123 8540', passcode: 'Biropeg-24', url: 'https://zoom.us/j/98011238540' },
  { id: '4', name: 'Angkatan 4', badge: 'Ahli Pertama', meetingId: '953 8575 8152', passcode: 'Biropeg-24', url: 'https://zoom.us/j/95385758152' },
  { id: '5', name: 'Angkatan 5', badge: 'Terampil', meetingId: '914 2017 2539', passcode: 'Biropeg-24', url: 'https://zoom.us/j/91420172539', highlight: true },
  { id: '6', name: 'Angkatan 6', badge: 'Terampil', meetingId: '967 2865 6691', passcode: 'Biropeg-24', url: 'https://zoom.us/j/96728656691' },
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
    globalPasscode: batchNum === 4 ? 'AGRASENA4' : 'Biropeg-24',
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
