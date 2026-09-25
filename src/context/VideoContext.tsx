"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { VideoItem } from "@/data/videos";

export interface MinioStatus {
  connected: boolean;
  endpoint: string;
  port: number;
  bucket: string;
  error?: string;
  message?: string;
  count?: number;
}

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

interface VideoContextType {
  videos: VideoItem[];
  isLoading: boolean;
  minioStatus: MinioStatus | null;
  activeVideo: VideoItem | null;
  setActiveVideoId: (id: string) => void;
  toggleFavorite: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  seekTime: number | null;
  setSeekTime: (time: number | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  notifications: Notification[];
  unreadCount: number;
  markNotificationsRead: () => void;
  fetchVideos: () => Promise<void>;
  checkStorageStatus: () => Promise<void>;
  seedMinio: () => Promise<boolean>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [minioStatus, setMinioStatus] = useState<MinioStatus | null>(null);
  const [activeVideoId, setActiveVideoIdState] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("Last 30 Days");
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n-1",
      title: "MinIO Storage Engine Active",
      desc: "Storage pipeline initialized with bucket 'csm-videos'.",
      time: "Just now",
      read: false,
    },
  ]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Check MinIO health status
  const checkStorageStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/storage/status");
      const data = await res.json();
      setMinioStatus(data);
    } catch (err: any) {
      setMinioStatus({
        connected: false,
        endpoint: "localhost",
        port: 9000,
        bucket: "csm-videos",
        error: err.message || "Failed to reach storage API",
      });
    }
  }, []);

  // Fetch real videos from MinIO storage
  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();

      setMinioStatus({
        connected: data.connected,
        endpoint: data.endpoint || "localhost:9000",
        port: 9000,
        bucket: data.bucket || "csm-videos",
        error: data.error || (!data.connected ? data.message : undefined),
        count: data.videos?.length || 0,
      });

      if (data.videos && Array.isArray(data.videos)) {
        // Load favorite statuses from localStorage
        let savedFavs: string[] = [];
        try {
          savedFavs = JSON.parse(localStorage.getItem("csm_video_favorites") || "[]");
        } catch {}

        const mappedVideos: VideoItem[] = data.videos.map((v: VideoItem) => ({
          ...v,
          isFavorite: savedFavs.includes(v.id) || v.isFavorite,
        }));

        setVideos(mappedVideos);

        if (mappedVideos.length > 0 && !activeVideoId) {
          setActiveVideoIdState(mappedVideos[0].id);
        }
      } else {
        setVideos([]);
      }
    } catch (err: any) {
      console.error("Error fetching videos from MinIO:", err);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeVideoId]);

  // Seed MinIO with initial sessions
  const seedMinio = useCallback(async (): Promise<boolean> => {
    try {
      showToast("Initializing MinIO bucket with enterprise recordings...");
      const res = await fetch("/api/videos/seed", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message || "MinIO initialized successfully!");
        await fetchVideos();
        return true;
      } else {
        showToast(data.error || "Failed to seed MinIO.");
        return false;
      }
    } catch (err: any) {
      showToast(`Error seeding MinIO: ${err.message}`);
      return false;
    }
  }, [fetchVideos, showToast]);

  useEffect(() => {
    fetchVideos();
    checkStorageStatus();
  }, [fetchVideos, checkStorageStatus]);

  const toggleFavorite = (id: string) => {
    setVideos((prev) => {
      const next = prev.map((v) => {
        if (v.id === id) {
          const updated = !v.isFavorite;
          showToast(updated ? `Saved "${v.title}" to Favorites` : `Removed "${v.title}" from Favorites`);
          return { ...v, isFavorite: updated };
        }
        return v;
      });

      try {
        const favIds = next.filter((v) => v.isFavorite).map((v) => v.id);
        localStorage.setItem("csm_video_favorites", JSON.stringify(favIds));
      } catch {}

      return next;
    });
  };

  const setActiveVideoId = (id: string) => {
    setActiveVideoIdState(id);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const activeVideo = videos.find((v) => v.id === activeVideoId) || videos[0] || null;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <VideoContext.Provider
      value={{
        videos,
        isLoading,
        minioStatus,
        activeVideo,
        setActiveVideoId,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        selectedDepartment,
        setSelectedDepartment,
        selectedDateFilter,
        setSelectedDateFilter,
        seekTime,
        setSeekTime,
        toast,
        showToast,
        notifications,
        unreadCount,
        markNotificationsRead,
        fetchVideos,
        checkStorageStatus,
        seedMinio,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-surface-card border border-border-strong text-text-primary px-5 py-3 rounded-xl shadow-xl transition-all">
          <span className="material-symbols-outlined text-accent-interactive text-xl">info</span>
          <span className="font-label-md text-label-md">{toast}</span>
        </div>
      )}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
}
