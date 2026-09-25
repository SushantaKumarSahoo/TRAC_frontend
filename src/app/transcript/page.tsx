"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVideoContext } from "@/context/VideoContext";

function TranscriptContent() {
  const searchParams = useSearchParams();
  const urlVideoId = searchParams.get("id");

  const {
    videos,
    activeVideo,
    setActiveVideoId,
    showToast,
  } = useVideoContext();

  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("All Speakers");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyActionItems, setOnlyActionItems] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // Mini-player state
  const audioVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // If a video ID is passed in query
  if (urlVideoId && activeVideo && urlVideoId !== activeVideo.id) {
    const found = videos.find((v) => v.id === urlVideoId);
    if (found) {
      setActiveVideoId(urlVideoId);
    }
  }

  if (!activeVideo) {
    return (
      <main className="w-full min-h-screen bg-surface-canvas p-12 flex flex-col items-center justify-center space-y-4 text-center">
        <span className="material-symbols-outlined text-5xl text-accent-interactive">
          description
        </span>
        <h2 className="font-headline-md text-headline-md font-semibold text-text-primary">
          No Transcript Selected
        </h2>
        <p className="text-text-muted text-sm max-w-md">
          Please select a recording from the portal to inspect its AI speech-to-text transcript.
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

  const speakers = [
    "All Speakers",
    ...Array.from(new Set((activeVideo.transcript || []).map((t) => t.speaker))),
  ];

  const filteredTranscript = (activeVideo.transcript || []).filter((line) => {
    if (selectedSpeaker !== "All Speakers" && line.speaker !== selectedSpeaker) {
      return false;
    }
    if (onlyActionItems && !line.isActionItem) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!line.text.toLowerCase().includes(q) && !line.speaker.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleSeek = (seconds: number) => {
    if (audioVideoRef.current) {
      audioVideoRef.current.currentTime = seconds;
      audioVideoRef.current.play().catch(() => {});
      setIsPlaying(true);
      showToast(`Playback jumped to ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`);
    }
  };

  const handleExportTxt = () => {
    const lines = activeVideo.transcript.map(
      (t) => `[${t.time}] ${t.speaker} (${t.speakerRole}):\n${t.text}\n`
    );
    const content = `TRANSCRIPT: ${activeVideo.title}\nRecorded: ${activeVideo.date}\nDepartment: ${activeVideo.department}\n\n` + lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeVideo.id}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded text transcript file.");
  };

  const handleExportVtt = () => {
    const header = "WEBVTT\n\n";
    const cues = activeVideo.transcript.map((t, idx) => {
      const start = formatVttTime(t.seconds);
      const end = formatVttTime(t.seconds + 5);
      return `${idx + 1}\n${start} --> ${end}\n<v ${t.speaker}>${t.text}\n`;
    });
    const blob = new Blob([header + cues.join("\n")], { type: "text/vtt;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeVideo.id}_captions.vtt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded WebVTT caption file.");
  };

  const formatVttTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.000`;
  };

  const handleCopyTranscript = () => {
    const content = activeVideo.transcript
      .map((t) => `[${t.time}] ${t.speaker}: ${t.text}`)
      .join("\n");
    navigator.clipboard.writeText(content);
    showToast("Full transcript copied to clipboard!");
  };

  return (
    <main className="w-full min-h-screen bg-surface-canvas pb-16">
      <div className="flex flex-col w-full">
        {/* Top Context Navigation & Meeting Title Bar */}
        <div className="w-full bg-surface-card px-space-xl py-space-md border-b border-border-subtle shadow-xs">
          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <Link
                className="inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors font-label-md text-label-md"
                href="/my-videos"
              >
                <span className="material-symbols-outlined text-lg leading-none">arrow_back</span>
                <span>Back to My Videos</span>
              </Link>
              <span className="h-4 w-px bg-border-subtle hidden sm:block"></span>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-surface-container-high text-on-primary-fixed-variant tracking-wide uppercase">
                    {activeVideo.department}
                  </span>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="text-text-muted font-body-sm text-body-sm">
                    Recorded {activeVideo.date}
                  </span>
                </div>
                <h1 className="font-headline-md text-headline-md text-text-primary tracking-tight font-semibold mt-0.5">
                  {activeVideo.title}
                </h1>
              </div>
            </div>

            {/* Quick Actions & Video Switcher */}
            <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
              {/* Meeting Switcher */}
              <select
                value={activeVideo.id}
                onChange={(e) => setActiveVideoId(e.target.value)}
                className="h-9 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs font-semibold text-text-primary cursor-pointer"
              >
                {videos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>

              <button
                onClick={handleCopyTranscript}
                className="h-9 px-3 flex items-center gap-1.5 bg-surface-card border border-border-subtle hover:bg-surface-subtle text-text-secondary rounded-lg font-label-md text-label-md transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">content_copy</span>
                <span>Copy</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleExportTxt}
                  className="h-9 px-3 bg-surface-card border border-border-subtle hover:bg-surface-subtle text-text-secondary rounded-lg font-label-md text-label-md flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  title="Export .txt"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>TXT</span>
                </button>
                <button
                  onClick={handleExportVtt}
                  className="h-9 px-3 bg-surface-card border border-border-subtle hover:bg-surface-subtle text-text-secondary rounded-lg font-label-md text-label-md flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  title="Export .vtt"
                >
                  <span className="material-symbols-outlined text-base">closed_caption</span>
                  <span>VTT</span>
                </button>
              </div>

              <Link
                href={`/video-watch?id=${activeVideo.id}`}
                className="h-9 px-3.5 bg-primary text-white hover:bg-accent-hover rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-base">play_circle</span>
                <span>Watch Video</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="max-w-[1500px] w-full mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: Search, Filters & Interactive Transcript */}
          <div className="lg:col-span-2 space-y-4">
            {/* Toolbar */}
            <div className="bg-surface-card p-4 rounded-xl border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search in transcript */}
              <div className="relative flex-1 w-full md:w-auto">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-lg pointer-events-none">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search spoken dialogue, topics, decisions..."
                  className="w-full h-9 pl-9 pr-8 bg-surface-subtle border border-border-subtle rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent-interactive"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                {/* Speaker Selector */}
                <select
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  className="h-9 px-3 bg-surface-subtle border border-border-subtle rounded-lg text-xs font-medium text-text-secondary focus:outline-none cursor-pointer"
                >
                  {speakers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* Action Items Only Toggle */}
                <button
                  onClick={() => setOnlyActionItems(!onlyActionItems)}
                  className={`h-9 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    onlyActionItems
                      ? "bg-amber-50 border-amber-300 text-amber-800"
                      : "bg-surface-subtle border-border-subtle text-text-secondary hover:bg-surface-card"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Action Items</span>
                </button>

                {/* Auto-scroll toggle */}
                <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="rounded accent-accent-interactive"
                  />
                  <span>Auto-scroll</span>
                </label>
              </div>
            </div>

            {/* Transcript Lines Stream */}
            <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle text-xs text-text-muted">
                <span>Showing {filteredTranscript.length} lines of dialogue</span>
                <span>Click any timestamp to synchronize playback</span>
              </div>

              {filteredTranscript.length === 0 ? (
                <div className="py-12 text-center text-text-muted space-y-2">
                  <span className="material-symbols-outlined text-4xl">search_off</span>
                  <p className="text-sm">No spoken words match your filter criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTranscript.map((line) => {
                    const isPlayingLine =
                      currentTime >= line.seconds && currentTime < line.seconds + 20;

                    return (
                      <div
                        key={line.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isPlayingLine
                            ? "bg-accent-interactive/5 border-accent-interactive shadow-xs"
                            : line.isActionItem
                            ? "bg-amber-50/40 border-amber-200"
                            : "bg-surface-canvas border-border-subtle hover:bg-surface-subtle/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={line.avatar}
                              alt={line.speaker}
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div>
                              <span className="font-label-md text-label-md font-semibold text-text-primary">
                                {line.speaker}
                              </span>
                              <span className="text-xs text-text-muted ml-2">
                                {line.speakerRole}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {line.isActionItem && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                                Action Item
                              </span>
                            )}
                            <button
                              onClick={() => handleSeek(line.seconds)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-subtle hover:bg-accent-interactive hover:text-white text-accent-interactive font-code-sm text-xs font-semibold transition-colors cursor-pointer"
                              title="Seek audio to this point"
                            >
                              <span className="material-symbols-outlined text-sm">play_arrow</span>
                              <span>{line.time}</span>
                            </button>
                          </div>
                        </div>

                        <p className="font-body-md text-body-md text-text-secondary leading-relaxed pl-9">
                          {line.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Synchronized Mini-Player & Speaker Breakdown */}
          <div className="space-y-6">
            {/* Synchronized Media Player Preview */}
            <div className="bg-surface-card p-4 rounded-2xl border border-border-subtle shadow-sm space-y-3">
              <span className="font-label-sm text-label-sm font-semibold text-text-primary uppercase tracking-wider block">
                Synchronized Media Stream
              </span>

              <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
                <video
                  ref={audioVideoRef}
                  src={activeVideo.videoUrl}
                  poster={activeVideo.thumbnail}
                  onTimeUpdate={() => {
                    if (audioVideoRef.current) {
                      setCurrentTime(audioVideoRef.current.currentTime);
                    }
                  }}
                  className="w-full h-full object-contain"
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {!isPlaying && (
                    <div className="w-14 h-14 rounded-full bg-accent-interactive/80 text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl ml-0.5">play_arrow</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                  <button
                    onClick={() => {
                      if (!audioVideoRef.current) return;
                      if (isPlaying) {
                        audioVideoRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        audioVideoRef.current.play().catch(() => {});
                        setIsPlaying(true);
                      }
                    }}
                    className="flex items-center gap-1 font-semibold hover:text-accent-interactive"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isPlaying ? "pause" : "play_arrow"}
                    </span>
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>

                  <span className="font-code-sm text-[11px]">
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")} / {activeVideo.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Participants Speaking Breakdown */}
            <div className="bg-surface-card p-5 rounded-2xl border border-border-subtle shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary">
                  Participants ({activeVideo.participants.length})
                </h3>
                <span className="text-xs text-text-muted">Airtime Analysis</span>
              </div>

              <div className="space-y-3">
                {activeVideo.participants.map((p) => (
                  <div key={p.name} className="space-y-1.5 p-3 rounded-xl bg-surface-canvas border border-border-subtle">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <span className="font-label-sm text-label-sm font-semibold text-text-primary block">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-text-muted">{p.role}</span>
                        </div>
                      </div>
                      <span className="font-code-sm text-xs text-accent-interactive font-medium">
                        {p.speakingTime} ({p.speakingPercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-accent-interactive h-full rounded-full"
                        style={{ width: `${p.speakingPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TranscriptPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-text-muted">Loading transcript...</div>}>
      <TranscriptContent />
    </Suspense>
  );
}

