"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVideoContext } from "@/context/VideoContext";

function VideoWatchContent() {
  const searchParams = useSearchParams();
  const urlVideoId = searchParams.get("id");

  const {
    videos,
    activeVideo,
    setActiveVideoId,
    toggleFavorite,
    seekTime,
    setSeekTime,
    showToast,
  } = useVideoContext();

  const videoRef = useRef<HTMLVideoElement>(null);

  // If URL has ?id=..., set active video
  useEffect(() => {
    if (urlVideoId && activeVideo && urlVideoId !== activeVideo.id) {
      setActiveVideoId(urlVideoId);
    }
  }, [urlVideoId, activeVideo, setActiveVideoId]);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<"transcript" | "chapters" | "summary" | "participants" | "resources">("transcript");
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);

  // If seekTime is triggered externally
  useEffect(() => {
    if (seekTime !== null && videoRef.current) {
      videoRef.current.currentTime = seekTime;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setSeekTime(null);
    }
  }, [seekTime, setSeekTime]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || activeVideo?.durationSeconds || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleJumpToSeconds = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      showToast(`Jumped to ${formatTime(seconds)}`);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleVolumeToggle = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  const handleCopyShareLink = () => {
    if (!activeVideo) return;
    const url = `${window.location.origin}/video-watch?id=${activeVideo.id}&t=${Math.floor(currentTime)}`;
    navigator.clipboard.writeText(url);
    showToast("Share link with current timestamp copied to clipboard!");
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!activeVideo) {
    return (
      <main className="w-full min-h-screen bg-surface-canvas p-12 flex flex-col items-center justify-center space-y-4 text-center">
        <span className="material-symbols-outlined text-5xl text-accent-interactive">
          video_library
        </span>
        <h2 className="font-headline-md text-headline-md font-semibold text-text-primary">
          No Video Selected
        </h2>
        <p className="text-text-muted text-sm max-w-md">
          Please select a recording from the portal or upload a new session to MinIO storage.
        </p>
        <Link
          href="/my-videos"
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-label-md text-label-md hover:bg-accent-hover transition-colors shadow-xs"
        >
          Browse MinIO Videos
        </Link>
      </main>
    );
  }

  // Filter transcript
  const filteredTranscript = (activeVideo.transcript || []).filter((line) => {
    if (!transcriptSearch.trim()) return true;
    const q = transcriptSearch.toLowerCase();
    return (
      line.text.toLowerCase().includes(q) ||
      line.speaker.toLowerCase().includes(q)
    );
  });

  const otherVideos = videos.filter((v) => v.id !== activeVideo.id);

  return (
    <main className="w-full min-h-screen bg-surface-canvas pb-16">
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Top Navigation / Breadcrumb Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
          <div className="flex flex-col gap-1.5">
            <Link
              className="inline-flex items-center gap-1.5 font-label-md text-label-md text-accent-interactive hover:text-accent-hover transition-colors w-fit group"
              href="/my-videos"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-0.5">
                arrow_back
              </span>
              <span>Back to My Videos</span>
            </Link>
            <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
              <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-semibold">
                {activeVideo.title}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-badge-live bg-error-container/40 font-label-sm text-label-sm font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-badge-live mr-1.5 animate-pulse"></span>
                RECORDED
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-text-muted flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{activeVideo.date}</span>
              <span>•</span>
              <span className="text-text-secondary font-medium">{activeVideo.department}</span>
              <span>•</span>
              <span>
                Presented by <strong className="text-text-primary font-semibold">{activeVideo.presenter.name}</strong> ({activeVideo.presenter.role})
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleFavorite(activeVideo.id)}
              className={`h-9 px-3.5 flex items-center gap-1.5 rounded-lg border font-label-md text-label-md transition-all shadow-xs cursor-pointer ${
                activeVideo.isFavorite
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-surface-card border-border-subtle text-text-secondary hover:bg-surface-subtle"
              }`}
            >
              <span
                className={`material-symbols-outlined text-lg ${
                  activeVideo.isFavorite ? "text-amber-500 fill-1" : ""
                }`}
              >
                star
              </span>
              <span>{activeVideo.isFavorite ? "Favorited" : "Favorite"}</span>
            </button>

            <button
              onClick={handleCopyShareLink}
              className="h-9 px-3.5 flex items-center gap-1.5 bg-surface-card border border-border-subtle hover:bg-surface-subtle text-text-secondary rounded-lg font-label-md text-label-md transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">link</span>
              <span>Copy Link</span>
            </button>

            <Link
              href={`/transcript?id=${activeVideo.id}`}
              className="h-9 px-3.5 flex items-center gap-1.5 bg-primary text-white hover:bg-accent-hover rounded-lg font-label-md text-label-md transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">description</span>
              <span>Full Transcript</span>
            </Link>
          </div>
        </div>

        {/* Main Grid: Video Player + Interactive Tab Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: Real Video Player & Metadata */}
          <div className="lg:col-span-2 space-y-4">
            {/* Real HTML5 Video Player Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl aspect-video flex items-center justify-center group">
              <video
                ref={videoRef}
                src={activeVideo.videoUrl}
                poster={activeVideo.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={handlePlayPause}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Central Big Play Button when Paused */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-accent-interactive/90 hover:bg-accent-interactive text-white flex items-center justify-center transition-transform hover:scale-110 shadow-2xl cursor-pointer"
                  title="Play"
                >
                  <span className="material-symbols-outlined text-4xl leading-none ml-1">
                    play_arrow
                  </span>
                </button>
              )}

              {/* Player Overlay Controls */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 opacity-90 group-hover:opacity-100 flex flex-col gap-2">
                {/* Scrubbing Bar */}
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-accent-interactive hover:h-2.5 transition-all"
                />

                <div className="flex items-center justify-between text-white text-xs">
                  {/* Left Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayPause}
                      className="p-1 hover:text-accent-interactive transition-colors cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      <span className="material-symbols-outlined text-2xl leading-none">
                        {isPlaying ? "pause" : "play_arrow"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleJumpToSeconds(Math.max(0, currentTime - 10))}
                      className="p-1 hover:text-accent-interactive transition-colors cursor-pointer"
                      title="Rewind 10s"
                    >
                      <span className="material-symbols-outlined text-xl leading-none">
                        replay_10
                      </span>
                    </button>

                    <button
                      onClick={() => handleJumpToSeconds(Math.min(duration, currentTime + 10))}
                      className="p-1 hover:text-accent-interactive transition-colors cursor-pointer"
                      title="Forward 10s"
                    >
                      <span className="material-symbols-outlined text-xl leading-none">
                        forward_10
                      </span>
                    </button>

                    <button
                      onClick={handleVolumeToggle}
                      className="p-1 hover:text-accent-interactive transition-colors cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      <span className="material-symbols-outlined text-xl leading-none">
                        {isMuted ? "volume_off" : "volume_up"}
                      </span>
                    </button>

                    <span className="font-code-sm text-xs text-white/90">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-3">
                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-white/10 rounded-md px-1 py-0.5">
                      {[1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            playbackSpeed === s
                              ? "bg-accent-interactive text-white"
                              : "text-white/70 hover:text-white"
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleFullscreen}
                      className="p-1 hover:text-accent-interactive transition-colors cursor-pointer"
                      title="Fullscreen"
                    >
                      <span className="material-symbols-outlined text-xl leading-none">
                        fullscreen
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Overview Description & Tags */}
            <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md font-semibold text-text-primary">
                  Meeting Overview
                </h3>
                <span className="text-xs text-text-muted">{activeVideo.views} views</span>
              </div>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                {activeVideo.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle">
                {activeVideo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-surface-subtle text-text-secondary font-label-sm text-label-sm border border-border-subtle"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Up Next & Related Videos */}
            <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm space-y-4">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                More Enterprise Sessions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherVideos.slice(0, 2).map((other) => (
                  <div
                    key={other.id}
                    onClick={() => {
                      setActiveVideoId(other.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex gap-3 p-3 rounded-xl border border-border-subtle hover:border-border-strong hover:bg-surface-subtle/50 transition-all cursor-pointer group"
                  >
                    <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900 relative">
                      <img
                        src={other.thumbnail}
                        alt={other.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[9px] font-bold bg-black/80 text-white font-code-sm">
                        {other.duration}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between min-w-0">
                      <span className="font-label-sm text-label-sm font-semibold text-text-primary group-hover:text-accent-interactive transition-colors line-clamp-2">
                        {other.title}
                      </span>
                      <span className="text-xs text-text-muted truncate">
                        {other.presenter.name} • {other.department}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Tabs (Transcript, Chapters, AI Summary, Participants, Resources) */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm flex flex-col h-[750px] overflow-hidden">
            {/* Tab Buttons */}
            <div className="flex items-center border-b border-border-subtle px-3 pt-3 overflow-x-auto gap-1">
              {[
                { id: "transcript", label: "Transcript", icon: "subject" },
                { id: "chapters", label: "Chapters", icon: "format_list_bulleted" },
                { id: "summary", label: "AI Summary", icon: "auto_awesome" },
                { id: "participants", label: "Speakers", icon: "group" },
                { id: "resources", label: "Files", icon: "attach_file" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-b-2 border-accent-interactive text-accent-interactive bg-surface-subtle/40"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-base leading-none">
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Interactive Transcript */}
            {activeTab === "transcript" && (
              <div className="flex flex-col flex-1 overflow-hidden p-4 gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-2 text-text-muted text-base">
                    search
                  </span>
                  <input
                    value={transcriptSearch}
                    onChange={(e) => setTranscriptSearch(e.target.value)}
                    placeholder="Search spoken dialogue..."
                    className="w-full h-8 pl-8 pr-3 text-xs bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-accent-interactive"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted border-b border-border-subtle pb-2">
                  <span>Click any line to jump video</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="rounded accent-accent-interactive"
                    />
                    <span>Auto-scroll</span>
                  </label>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {filteredTranscript.map((line) => {
                    const isCurrent =
                      currentTime >= line.seconds && currentTime < line.seconds + 30;
                    return (
                      <div
                        key={line.id}
                        onClick={() => handleJumpToSeconds(line.seconds)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-accent-interactive/5 border-accent-interactive shadow-xs"
                            : "bg-surface-canvas border-border-subtle hover:bg-surface-subtle"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <img
                              src={line.avatar}
                              alt={line.speaker}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-label-sm text-label-sm font-semibold text-text-primary">
                              {line.speaker}
                            </span>
                          </div>
                          <span className="font-code-sm text-[11px] text-accent-interactive font-medium bg-surface-subtle px-1.5 py-0.5 rounded">
                            {line.time}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                          {line.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Chapters */}
            {activeTab === "chapters" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <span className="text-xs text-text-muted block">
                  Click any chapter to jump video playback
                </span>
                {activeVideo.chapters.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => handleJumpToSeconds(ch.seconds)}
                    className="p-3 rounded-xl border border-border-subtle bg-surface-canvas hover:bg-surface-subtle transition-all cursor-pointer flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-code-sm text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-accent-interactive border border-border-subtle">
                          {ch.time}
                        </span>
                        <h4 className="font-label-md text-label-md font-semibold text-text-primary group-hover:text-accent-interactive transition-colors">
                          {ch.title}
                        </h4>
                      </div>
                      <p className="text-xs text-text-muted">{ch.description}</p>
                    </div>
                    <span className="material-symbols-outlined text-text-muted group-hover:text-accent-interactive text-lg">
                      play_circle
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: AI Summary & Key Takeaways */}
            {activeTab === "summary" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-3 rounded-xl bg-accent-interactive/5 border border-accent-interactive/20">
                  <div className="flex items-center gap-1.5 text-accent-interactive font-label-md text-label-md font-semibold mb-1">
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                    <span>AI Executive Synthesis</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Automated intelligence extraction generated from meeting audio diarization and speaker transcripts.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                    Key Decisions &amp; Takeaways
                  </span>
                  {activeVideo.keyTakeaways.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-canvas border border-border-subtle"
                    >
                      <span className="material-symbols-outlined text-accent-interactive text-base mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-xs text-text-secondary leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Participants */}
            {activeTab === "participants" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <span className="text-xs text-text-muted block">
                  Identified speakers and airtime breakdown
                </span>
                {activeVideo.participants.map((p) => (
                  <div
                    key={p.name}
                    className="p-3 rounded-xl border border-border-subtle bg-surface-canvas flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <h4 className="font-label-md text-label-md font-semibold text-text-primary">
                          {p.name}
                        </h4>
                        <span className="text-xs text-text-muted">{p.role}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-text-primary block font-code-sm">
                        {p.speakingTime}
                      </span>
                      <span className="text-[11px] text-text-muted">{p.speakingPercent}% speaking</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Resources */}
            {activeTab === "resources" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <span className="text-xs text-text-muted block">
                  Session attachments, decks, and materials
                </span>
                {activeVideo.resources.map((res) => (
                  <div
                    key={res.name}
                    className="p-3 rounded-xl border border-border-subtle bg-surface-canvas flex items-center justify-between gap-3 hover:bg-surface-subtle transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-accent-interactive text-2xl shrink-0">
                        description
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-label-md text-label-md font-semibold text-text-primary truncate">
                          {res.name}
                        </h4>
                        <span className="text-xs text-text-muted">
                          {res.type} • {res.size}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`Downloading ${res.name}...`)}
                      className="p-2 rounded-lg bg-surface-subtle hover:bg-accent-interactive hover:text-white text-text-primary transition-colors shrink-0 cursor-pointer"
                      title="Download Resource"
                    >
                      <span className="material-symbols-outlined text-base">file_download</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function VideoWatchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-text-muted">Loading video session...</div>}>
      <VideoWatchContent />
    </Suspense>
  );
}

