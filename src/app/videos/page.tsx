"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVideoContext } from "@/context/VideoContext";

export default function VideosPage() {
  const router = useRouter();
  const {
    videos,
    isLoading,
    minioStatus,
    setActiveVideoId,
    toggleFavorite,
    searchQuery,
    setSearchQuery,
    seedMinio,
    showToast,
  } = useVideoContext();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  const departments = [
    "All",
    "Executive & Strategy",
    "Legal & Ops",
    "Sales & Marketing",
    "Engineering",
    "Product",
    "Security",
  ];

  // Filter and sort videos purely from MinIO dataset
  const displayedVideos = useMemo(() => {
    return videos
      .filter((video) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = video.title.toLowerCase().includes(q);
          const matchPresenter = video.presenter.name.toLowerCase().includes(q);
          const matchDept = video.department.toLowerCase().includes(q);
          const matchTags = video.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchPresenter && !matchDept && !matchTags) {
            return false;
          }
        }

        // Department filter
        if (selectedDept !== "All" && video.department !== selectedDept) {
          return false;
        }

        // Favorites filter
        if (onlyFavorites && !video.isFavorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.views - a.views;
        if (sortBy === "oldest") return a.views - b.views;
        if (sortBy === "duration") return b.durationSeconds - a.durationSeconds;
        if (sortBy === "views") return b.views - a.views;
        return 0;
      });
  }, [videos, searchQuery, selectedDept, onlyFavorites, sortBy]);

  const handleWatchVideo = (id: string) => {
    setActiveVideoId(id);
    router.push(`/video-watch?id=${id}`);
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/video-watch?id=${id}`;
    navigator.clipboard.writeText(url);
    showToast("Video watch link copied to clipboard!");
  };

  return (
    <main className="w-full min-h-screen bg-surface-canvas pb-16">
      <div className="px-space-xl py-space-lg flex flex-col gap-space-lg max-w-[1600px] mx-auto w-full">
        {/* Header & Breadcrumbs & Summary Metric */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs font-label-md text-label-md text-text-muted">
              <Link href="/" className="hover:text-accent-interactive transition-colors">
                Home
              </Link>
              <span className="text-border-strong">/</span>
              <span className="text-text-primary font-medium">Videos</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-semibold">
              Videos
            </h1>
            <p className="font-body-md text-body-md text-text-secondary max-w-2xl">
              Browse all meeting recordings, executive briefings, and sessions stored in your MinIO repository.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start lg:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface border border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-accent-interactive animate-pulse"></span>
              <span className="font-label-sm text-label-sm font-semibold tracking-normal text-text-secondary">
                {displayedVideos.length} of {videos.length} MinIO assets displayed
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Enterprise Toolbar */}
        <div className="bg-surface-card p-space-md rounded-xl shadow-sm border border-border-subtle flex flex-col gap-space-md">
          {/* Top Row: Search and View Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-lg pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-surface-subtle border border-border-subtle rounded-lg font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-interactive focus:ring-2 focus:ring-accent-interactive/15 transition-all"
                placeholder="Filter by title, presenter, department, or keywords..."
                type="text"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* View Controls & Sort */}
            <div className="flex items-center justify-between lg:justify-end gap-space-sm">
              {/* Only Favorites Toggle */}
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`h-10 px-3 flex items-center gap-1.5 rounded-lg border font-label-sm text-label-sm transition-colors cursor-pointer ${
                  onlyFavorites
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-surface-card border-border-subtle text-text-secondary hover:bg-surface-subtle"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    onlyFavorites ? "text-amber-500 fill-1" : "text-text-muted"
                  }`}
                >
                  star
                </span>
                <span>Favorites</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-1 bg-surface-subtle border border-border-subtle rounded-lg px-2 h-10">
                <span className="text-xs text-text-muted font-medium pl-1">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-label-sm text-label-sm text-text-primary focus:outline-none cursor-pointer pr-1"
                >
                  <option value="newest">Newest First</option>
                  <option value="views">Most Viewed</option>
                  <option value="duration">Longest Duration</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Grid / List Switcher */}
              <div className="flex items-center bg-surface-subtle p-1 rounded-lg border border-border-subtle">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-surface-card text-accent-interactive shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Grid View"
                >
                  <span className="material-symbols-outlined text-lg leading-none">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-surface-card text-accent-interactive shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="List View"
                >
                  <span className="material-symbols-outlined text-lg leading-none">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-border-subtle pt-3">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider shrink-0 pr-1">
              Department:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                  selectedDept === dept
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface-subtle text-text-secondary hover:bg-surface-card hover:border-border-strong border border-border-subtle"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-12 text-center flex flex-col items-center justify-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-accent-interactive animate-spin">
              progress_activity
            </span>
            <p className="font-label-md text-label-md text-text-secondary">
              Querying MinIO bucket "{minioStatus?.bucket || "csm-videos"}"...
            </p>
          </div>
        )}

        {/* Empty MinIO State */}
        {!isLoading && videos.length === 0 && (
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-12 text-center flex flex-col items-center justify-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-accent-interactive">
              cloud_off
            </span>
            <div className="space-y-1">
              <h3 className="font-headline-md text-headline-md font-semibold text-text-primary">
                No Videos Found in MinIO
              </h3>
              <p className="text-text-muted font-body-sm text-body-sm max-w-md">
                MinIO bucket <code className="font-bold">{minioStatus?.bucket || "csm-videos"}</code> is currently empty. Initialize with demo enterprise videos to test.
              </p>
            </div>
            <button
              onClick={() => seedMinio()}
              className="px-5 py-2.5 bg-primary hover:bg-accent-hover text-white rounded-xl font-label-md text-label-md transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">cloud_download</span>
              <span>Seed Enterprise Sessions to MinIO</span>
            </button>
          </div>
        )}

        {/* Content Display: Filtered Empty State or Results */}
        {!isLoading && videos.length > 0 && displayedVideos.length === 0 ? (
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-12 text-center flex flex-col items-center justify-center space-y-3">
            <span className="material-symbols-outlined text-5xl text-text-muted">
              search_off
            </span>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
              No matching MinIO sessions
            </h3>
            <p className="text-text-muted font-body-sm text-body-sm max-w-md">
              Try adjusting your keyword filter or switching department chips.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("All");
                setOnlyFavorites(false);
              }}
              className="px-4 py-2 bg-accent-interactive hover:bg-accent-hover text-white rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : !isLoading && videos.length > 0 && viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {displayedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden hover:border-border-strong hover:shadow-md transition-all flex flex-col group"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => handleWatchVideo(video.id)}
                  className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

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

                {/* Details */}
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

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={video.presenter.avatar}
                        alt={video.presenter.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span className="font-label-sm text-label-sm text-text-secondary truncate max-w-[130px]">
                        {video.presenter.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyLink(video.id)}
                        className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                        title="Copy Share Link"
                      >
                        <span className="material-symbols-outlined text-lg">share</span>
                      </button>
                      <button
                        onClick={() => handleWatchVideo(video.id)}
                        className="px-3 py-1 bg-surface-subtle hover:bg-accent-interactive hover:text-white rounded-lg text-text-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                        <span>Watch &amp; Transcript</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && videos.length > 0 ? (
          /* List/Table View */
          <div className="bg-surface-card rounded-xl border border-border-subtle shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-subtle/50 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Title &amp; Meeting</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Presenter</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {displayedVideos.map((video) => (
                    <tr
                      key={video.id}
                      className="hover:bg-surface-subtle/40 transition-colors group cursor-pointer"
                      onClick={() => handleWatchVideo(video.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-12 rounded overflow-hidden relative shrink-0 bg-slate-900">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[9px] font-bold bg-black/80 text-white font-code-sm">
                              {video.duration}
                            </span>
                          </div>
                          <div>
                            <span className="font-label-md text-label-md font-semibold text-text-primary group-hover:text-accent-interactive transition-colors line-clamp-1">
                              {video.title}
                            </span>
                            <span className="text-xs text-text-muted line-clamp-1">
                              {video.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-surface-subtle text-accent-interactive border border-border-subtle">
                          {video.department}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={video.presenter.avatar}
                            alt={video.presenter.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <span className="text-xs text-text-primary font-medium">
                            {video.presenter.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-text-muted">{video.date}</td>
                      <td className="py-3 px-4 text-xs text-text-muted font-code-sm">
                        {video.duration}
                      </td>
                      <td className="py-3 px-4 text-xs text-text-muted">{video.views}</td>
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleFavorite(video.id)}
                            className="p-1.5 rounded-lg hover:bg-surface-subtle text-text-muted hover:text-amber-500 transition-colors cursor-pointer"
                            title="Toggle Favorite"
                          >
                            <span
                              className={`material-symbols-outlined text-lg ${
                                video.isFavorite ? "text-amber-500 fill-1" : ""
                              }`}
                            >
                              star
                            </span>
                          </button>
                          <button
                            onClick={() => handleWatchVideo(video.id)}
                            className="p-1.5 rounded-lg bg-surface-subtle hover:bg-accent-interactive hover:text-white text-text-primary transition-colors cursor-pointer"
                            title="Watch &amp; Transcript"
                          >
                            <span className="material-symbols-outlined text-lg">
                              play_arrow
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
