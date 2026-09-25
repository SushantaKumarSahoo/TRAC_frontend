"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVideoContext } from "@/context/VideoContext";

export default function DashboardPage() {
  const router = useRouter();
  const {
    videos,
    isLoading,
    minioStatus,
    setActiveVideoId,
    toggleFavorite,
    selectedDepartment,
    setSelectedDepartment,
    selectedDateFilter,
    setSelectedDateFilter,
    fetchVideos,
    seedMinio,
    showToast,
  } = useVideoContext();

  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const departments = [
    "All Departments",
    "Executive & Strategy",
    "Legal & Ops",
    "Sales & Marketing",
    "Engineering",
    "Product",
    "Security",
  ];

  const dateFilters = ["Last 30 Days", "This Quarter", "This Year", "All Time"];

  // Filter videos dynamically based on selected department
  const filteredVideos = videos.filter((v) => {
    if (selectedDepartment !== "All Departments" && v.department !== selectedDepartment) {
      return false;
    }
    return true;
  });

  // Calculate dynamic metrics strictly from real MinIO data
  const availableCount = filteredVideos.length;
  const totalCount = videos.length;
  const favoriteCount = videos.filter((v) => v.isFavorite).length;
  const watchedCount = videos.filter((v) => v.progressPercent > 0).length;
  const inProgressVideos = videos.filter((v) => v.progressPercent > 0 && v.progressPercent < 100);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchVideos();
    setIsRefreshing(false);
    showToast("Feed refreshed from MinIO storage.");
  };

  const handleWatchVideo = (id: string) => {
    setActiveVideoId(id);
    router.push(`/video-watch?id=${id}`);
  };

  return (
    <main className="w-full min-h-screen bg-surface-canvas">
      <div className="flex flex-col w-full">
        <div className="px-space-xl py-space-xl max-w-7xl mx-auto w-full space-y-space-xl">
          {/* Header Welcome & Quick Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-sm mb-1">
                <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-semibold">
                  Welcome back, Sarah
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
                  Enterprise Pro
                </span>
              </div>
              <p className="font-body-md text-body-md text-text-muted">
                Access your processed meeting recordings and shared sessions from CSM Technologies.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-space-sm">
              {/* Department Selector */}
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                  className="h-9 px-space-md flex items-center gap-2 bg-surface-card rounded-lg shadow-sm border border-border-subtle text-text-secondary font-label-md text-label-md hover:bg-surface-subtle transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-text-muted text-base leading-none">
                    domain
                  </span>
                  <span>{selectedDepartment}</span>
                  <span className="material-symbols-outlined text-text-muted text-sm leading-none ml-1">
                    expand_more
                  </span>
                </button>

                {showDeptDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-border-subtle rounded-xl shadow-xl z-50 p-1.5">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setShowDeptDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          selectedDepartment === dept
                            ? "bg-surface-subtle text-accent-interactive font-medium"
                            : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
                        }`}
                      >
                        <span>{dept}</span>
                        {selectedDepartment === dept && (
                          <span className="material-symbols-outlined text-sm">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Filter Selector */}
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="h-9 px-space-md flex items-center gap-2 bg-surface-card rounded-lg shadow-sm border border-border-subtle text-text-secondary font-label-md text-label-md hover:bg-surface-subtle transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-text-muted text-base leading-none">
                    calendar_today
                  </span>
                  <span>{selectedDateFilter}</span>
                  <span className="material-symbols-outlined text-text-muted text-sm leading-none ml-1">
                    expand_more
                  </span>
                </button>

                {showDateDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-card border border-border-subtle rounded-xl shadow-xl z-50 p-1.5">
                    {dateFilters.map((df) => (
                      <button
                        key={df}
                        onClick={() => {
                          setSelectedDateFilter(df);
                          setShowDateDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          selectedDateFilter === df
                            ? "bg-surface-subtle text-accent-interactive font-medium"
                            : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
                        }`}
                      >
                        <span>{df}</span>
                        {selectedDateFilter === df && (
                          <span className="material-symbols-outlined text-sm">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Refresh Feed */}
              <button
                onClick={handleRefresh}
                className="h-9 px-space-md flex items-center gap-1.5 bg-primary text-white rounded-lg font-label-md text-label-md hover:bg-accent-hover transition-colors shadow-sm cursor-pointer"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-base leading-none ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                >
                  sync
                </span>
                <span>Refresh Feed</span>
              </button>
            </div>
          </div>

          {/* Metric Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Total Available Videos */}
            <div className="bg-surface-card p-space-lg rounded-xl shadow-sm border border-border-subtle flex flex-col justify-between hover:border-border-strong transition-all">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                  Available Videos
                </span>
                <span className="material-symbols-outlined text-accent-interactive text-2xl">
                  video_library
                </span>
              </div>
              <div className="mt-4">
                <div className="font-display text-display font-bold text-text-primary tracking-tight">
                  {isLoading ? "..." : availableCount}
                </div>
                <div className="flex items-center gap-1.5 text-accent-interactive font-label-md text-label-md mt-1">
                  <span className="material-symbols-outlined text-sm leading-none">storage</span>
                  <span>MinIO Bucket: {minioStatus?.bucket || "csm-videos"}</span>
                </div>
              </div>
            </div>

            {/* Recently Added */}
            <div className="bg-surface-card p-space-lg rounded-xl shadow-sm border border-border-subtle flex flex-col justify-between hover:border-border-strong transition-all">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                  Recently Added
                </span>
                <span className="material-symbols-outlined text-blue-600 text-2xl">new_releases</span>
              </div>
              <div className="mt-4">
                <div className="font-display text-display font-bold text-text-primary tracking-tight">
                  {isLoading ? "..." : totalCount > 0 ? `${totalCount} indexed` : "0"}
                </div>
                <div className="flex items-center gap-1.5 text-text-muted font-label-md text-label-md mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-interactive"></span>
                  <span>Active pipeline</span>
                </div>
              </div>
            </div>

            {/* Watched Videos */}
            <div className="bg-surface-card p-space-lg rounded-xl shadow-sm border border-border-subtle flex flex-col justify-between hover:border-border-strong transition-all">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                  Watched Sessions
                </span>
                <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
              </div>
              <div className="mt-4">
                <div className="font-display text-display font-bold text-text-primary tracking-tight">
                  {isLoading ? "..." : watchedCount}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-label-md text-label-md mt-1">
                  <span>{totalCount > 0 ? `${Math.round((watchedCount / totalCount) * 100)}% progress` : "0% progress"}</span>
                </div>
              </div>
            </div>

            {/* Saved Favorites */}
            <div className="bg-surface-card p-space-lg rounded-xl shadow-sm border border-border-subtle flex flex-col justify-between hover:border-border-strong transition-all">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                  Saved Favorites
                </span>
                <span className="material-symbols-outlined text-amber-500 text-2xl">star</span>
              </div>
              <div className="mt-4">
                <div className="font-display text-display font-bold text-text-primary tracking-tight">
                  {isLoading ? "..." : `${favoriteCount} saved`}
                </div>
                <div className="flex items-center gap-1.5 text-text-muted font-label-md text-label-md mt-1">
                  <span className="material-symbols-outlined text-sm leading-none">bookmark</span>
                  <span>Pinned for quick access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-surface-card rounded-2xl border border-border-subtle p-12 text-center flex flex-col items-center justify-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-accent-interactive animate-spin">
                progress_activity
              </span>
              <p className="font-label-md text-label-md text-text-secondary">
                Fetching sessions from MinIO object storage...
              </p>
            </div>
          )}

          {/* Empty MinIO State */}
          {!isLoading && videos.length === 0 && (
            <div className="bg-surface-card rounded-2xl border border-border-subtle p-12 text-center flex flex-col items-center justify-center space-y-4">
              <span className="material-symbols-outlined text-5xl text-accent-interactive">
                cloud_done
              </span>
              <div className="space-y-1">
                <h3 className="font-headline-md text-headline-md font-semibold text-text-primary">
                  Connected to MinIO Storage
                </h3>
                <p className="text-text-muted font-body-sm text-body-sm max-w-md">
                  No video sessions are currently in bucket <code className="font-bold text-accent-interactive">{minioStatus?.bucket || "csm-videos"}</code>. You can upload an MP4 recording or seed enterprise sessions directly.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => seedMinio()}
                  className="px-5 py-2.5 bg-primary hover:bg-accent-hover text-white rounded-xl font-label-md text-label-md transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">cloud_download</span>
                  <span>Seed Enterprise Sessions to MinIO</span>
                </button>
              </div>
            </div>
          )}

          {/* Continue Watching Section */}
          {!isLoading && inProgressVideos.length > 0 && (
            <div className="space-y-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-accent-interactive text-xl">
                  play_circle
                </span>
                <h2 className="font-headline-md text-headline-md text-text-primary font-semibold">
                  Continue Watching
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-text-muted text-xs font-medium">
                  {inProgressVideos.length} in progress
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {inProgressVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-surface-card rounded-xl border border-border-subtle p-space-md flex flex-col sm:flex-row gap-space-md hover:border-border-strong transition-all shadow-sm group"
                  >
                    <div
                      onClick={() => handleWatchVideo(video.id)}
                      className="relative sm:w-56 h-36 rounded-lg overflow-hidden shrink-0 bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-black/75 text-white backdrop-blur-xs">
                        {Math.round((video.durationSeconds * (100 - video.progressPercent)) / 60)}m left
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(video.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors cursor-pointer"
                      >
                        <span
                          className={`material-symbols-outlined text-base ${
                            video.isFavorite ? "text-amber-400 fill-1" : ""
                          }`}
                        >
                          star
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                          <span className="font-semibold text-accent-interactive uppercase tracking-wide">
                            {video.department}
                          </span>
                          <span>{video.progressPercent}%</span>
                        </div>
                        <h3
                          onClick={() => handleWatchVideo(video.id)}
                          className="font-headline-sm text-headline-sm font-semibold text-text-primary hover:text-accent-interactive transition-colors line-clamp-2 cursor-pointer"
                        >
                          {video.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-1">
                          Presenter: {video.presenter.name} • {video.date}
                        </p>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-accent-interactive h-full rounded-full transition-all duration-300"
                            style={{ width: `${video.progressPercent}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text-muted font-code-sm">
                            {Math.floor(video.currentSeconds / 60)}:{String(video.currentSeconds % 60).padStart(2, "0")} / {video.duration}
                          </span>
                          <button
                            onClick={() => handleWatchVideo(video.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-surface-subtle hover:bg-accent-interactive hover:text-white rounded-lg text-text-primary font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                            <span>Resume</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Published Section */}
          {!isLoading && filteredVideos.length > 0 && (
            <div className="space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <h2 className="font-headline-md text-headline-md text-text-primary font-semibold">
                    Recently Published
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    {filteredVideos.length} MinIO Assets
                  </span>
                </div>
                <Link
                  href="/videos"
                  className="text-accent-interactive hover:text-accent-hover font-label-md text-label-md flex items-center gap-1 font-medium transition-colors"
                >
                  <span>View all videos</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden hover:border-border-strong hover:shadow-md transition-all flex flex-col group"
                  >
                    <div
                      onClick={() => handleWatchVideo(video.id)}
                      className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs tracking-wider">
                        {video.resolution}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(video.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors cursor-pointer"
                        title={video.isFavorite ? "Remove favorite" : "Save favorite"}
                      >
                        <span
                          className={`material-symbols-outlined text-lg ${
                            video.isFavorite ? "text-amber-400 fill-1" : "text-white"
                          }`}
                        >
                          star
                        </span>
                      </button>

                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-xs font-semibold bg-black/80 text-white font-code-sm">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-space-md flex flex-col justify-between flex-1 gap-space-sm">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-accent-interactive uppercase tracking-wide">
                            {video.department}
                          </span>
                          <span className="text-text-muted">{video.date}</span>
                        </div>
                        <h3
                          onClick={() => handleWatchVideo(video.id)}
                          className="font-headline-sm text-headline-sm font-semibold text-text-primary hover:text-accent-interactive transition-colors line-clamp-2 cursor-pointer"
                        >
                          {video.title}
                        </h3>
                        <p className="font-body-sm text-body-sm text-text-muted line-clamp-2 mt-1">
                          {video.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={video.presenter.avatar}
                            alt={video.presenter.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <span className="font-label-sm text-label-sm text-text-secondary truncate max-w-[140px]">
                            {video.presenter.name}
                          </span>
                        </div>

                        <button
                          onClick={() => handleWatchVideo(video.id)}
                          className="px-3 py-1 bg-surface-subtle hover:bg-accent-interactive hover:text-white rounded-lg text-text-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">play_arrow</span>
                          <span>Watch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
