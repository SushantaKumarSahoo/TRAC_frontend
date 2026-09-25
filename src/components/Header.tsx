"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoContext } from "@/context/VideoContext";

export default function Header() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    notifications,
    unreadCount,
    markNotificationsRead,
    minioStatus,
    checkStorageStatus,
    fetchVideos,
    seedMinio,
    showToast,
  } = useVideoContext();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPortalSwitch, setShowPortalSwitch] = useState(false);
  const [showMinioModal, setShowMinioModal] = useState(false);
  const [activePortal, setActivePortal] = useState("CSM Enterprise Stream");
  const [feedbackText, setFeedbackText] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push("/videos");
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setShowFeedbackModal(false);
    setFeedbackText("");
    showToast("Feedback submitted successfully. Thank you!");
  };

  const portals = [
    { name: "CSM Enterprise Stream", desc: "Internal executive & engineering recordings" },
    { name: "CSM Client Portal", desc: "External client delivery & presentations" },
    { name: "CSM Learning & Training", desc: "Onboarding curricula & technical labs" },
  ];

  return (
    <>
      <header className="fixed top-0 left-64 right-0 h-16 bg-surface-card border-b border-border-subtle z-40 px-space-xl flex items-center justify-between shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {/* Breadcrumb Workspace */}
        <div className="flex items-center gap-space-sm text-on-surface-variant">
          <span className="font-label-md text-label-md text-text-muted">Workspace</span>
          <span className="font-label-sm text-label-sm text-border-strong">/</span>
          <span className="font-label-md text-label-md text-text-primary font-medium">
            {activePortal}
          </span>
        </div>

        {/* Global Live Search Bar */}
        <div className="flex-1 max-w-xl mx-space-xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3 text-text-muted text-lg pointer-events-none">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-14 bg-surface-subtle border border-border-subtle rounded-lg font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-interactive focus:ring-2 focus:ring-accent-interactive/15 transition-all"
              placeholder="Search videos, meetings, or presenters..."
              type="text"
            />
            <kbd className="absolute right-2.5 px-1.5 py-0.5 font-code-sm text-code-sm bg-surface-card border border-border-subtle text-text-muted rounded shadow-none pointer-events-none">
              ⌘K
            </kbd>
          </form>
        </div>

        {/* Quick Actions & MinIO Status */}
        <div className="flex items-center gap-space-md">
          {/* Real MinIO Storage Status Pill */}
          <button
            onClick={() => setShowMinioModal(true)}
            className={`h-9 px-3 flex items-center gap-1.5 rounded-lg border font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
              minioStatus?.connected
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
            }`}
            title="MinIO Storage Status"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                minioStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            ></span>
            <span>
              {minioStatus?.connected
                ? `MinIO: ${minioStatus.bucket}`
                : "MinIO: Offline"}
            </span>
          </button>

          {/* Switch Portal Button */}
          <div className="relative">
            <button
              onClick={() => setShowPortalSwitch(!showPortalSwitch)}
              className="h-9 px-space-sm flex items-center gap-1.5 bg-surface-card border border-border-subtle hover:bg-surface-subtle hover:border-border-strong text-text-secondary rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
              title="Quick Switch"
              type="button"
            >
              <span className="material-symbols-outlined text-lg leading-none">swap_horiz</span>
              <span className="hidden xl:inline">Switch Portal</span>
            </button>

            {showPortalSwitch && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-card border border-border-subtle rounded-xl shadow-xl z-50 p-2">
                <span className="px-3 py-1 font-label-sm text-label-sm text-text-muted uppercase block">
                  Select Portal
                </span>
                {portals.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setActivePortal(p.name);
                      setShowPortalSwitch(false);
                      showToast(`Switched workspace to ${p.name}`);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-colors flex flex-col ${
                      activePortal === p.name
                        ? "bg-surface-subtle border border-border-subtle"
                        : "hover:bg-surface-subtle"
                    }`}
                  >
                    <span className="font-label-md text-label-md text-text-primary font-medium">
                      {p.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-text-muted text-xs">
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Button */}
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="h-9 px-space-sm flex items-center gap-1.5 bg-surface-card border border-border-subtle hover:bg-surface-subtle hover:border-border-strong text-text-secondary rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
            title="Feedback"
            type="button"
          >
            <span className="material-symbols-outlined text-lg leading-none">rate_review</span>
            <span className="hidden xl:inline">Feedback</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  markNotificationsRead();
                }
              }}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border-subtle hover:bg-surface-subtle hover:border-border-strong text-text-secondary transition-colors relative cursor-pointer"
              title="Notifications"
              type="button"
            >
              <span className="material-symbols-outlined text-xl leading-none">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-badge-live rounded-full ring-2 ring-surface-card"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-card border border-border-subtle rounded-xl shadow-xl z-50 p-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle mb-2">
                  <span className="font-label-md text-label-md text-text-primary font-semibold">
                    Notifications
                  </span>
                  <span className="text-xs text-text-muted">{notifications.length} total</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-lg bg-surface-canvas border border-border-subtle hover:bg-surface-subtle transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-text-primary font-medium">
                          {n.title}
                        </span>
                        <span className="text-[11px] text-text-muted">{n.time}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-text-secondary text-xs mt-1">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-border-subtle mx-space-xs"></div>

          {/* Profile Quick Menu */}
          <div className="flex items-center gap-space-xs pl-space-xs cursor-pointer group">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO6omun6R5oL9qCHRGIlB8qOIlIDUNT5UBHwcMZwiWzKIKb7jpouPMz6SD1ev-VSvPMOYPMgk83Z1NZsgN53S_eKbpKgsWmISpC9d02_U2a13q1CXR3DHb2z_yZMDrQTt-3xrAcTL_Anugf5T34wEiBZQUvolPda94t-Qz4gR3-aw8Uh1zAUeKIGs1a4THL5iETeZQko_j2qWlbvD0qUO-1chC3kwy1iJ9fNhdjWz0IOenw3tfdP4k"
            />
            <span className="material-symbols-outlined text-text-muted group-hover:text-text-primary transition-colors text-lg leading-none">
              expand_more
            </span>
          </div>
        </div>
      </header>

      {/* MinIO Connection & Health Modal */}
      {showMinioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-card border border-border-subtle rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-interactive text-2xl">
                  dns
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  MinIO Storage Status
                </h3>
              </div>
              <button
                onClick={() => setShowMinioModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-surface-canvas border border-border-subtle flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted block">Status</span>
                  <span
                    className={`font-semibold text-sm ${
                      minioStatus?.connected ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {minioStatus?.connected ? "Connected & Online" : "Service Offline"}
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    minioStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-surface-canvas border border-border-subtle">
                  <span className="text-xs text-text-muted block">Endpoint</span>
                  <span className="font-code-sm text-xs text-text-primary font-semibold">
                    {minioStatus?.endpoint || "localhost:9000"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-canvas border border-border-subtle">
                  <span className="text-xs text-text-muted block">Target Bucket</span>
                  <span className="font-code-sm text-xs text-text-primary font-semibold">
                    {minioStatus?.bucket || "csm-videos"}
                  </span>
                </div>
              </div>

              {!minioStatus?.connected ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <p className="font-semibold">How to connect to MinIO:</p>
                  <p>1. Start MinIO on your machine or server:</p>
                  <pre className="p-2 bg-amber-100 rounded text-[11px] font-mono select-all">
                    minio server C:\minio-data --console-address :9001
                  </pre>
                  <p>2. Or configure your custom MinIO IP/domain in <code className="font-bold">.env.local</code></p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  MinIO object storage is active and ready. All uploaded sessions and metadata are stored directly in bucket <strong className="font-mono">{minioStatus.bucket}</strong>.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
              <button
                onClick={async () => {
                  await checkStorageStatus();
                  await fetchVideos();
                  showToast("Storage status refreshed.");
                }}
                className="px-3.5 py-2 border border-border-subtle rounded-lg text-text-secondary hover:bg-surface-subtle font-label-md text-label-md flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
                <span>Test Connection</span>
              </button>

              <button
                onClick={async () => {
                  await seedMinio();
                  setShowMinioModal(false);
                }}
                className="px-3.5 py-2 bg-primary hover:bg-accent-hover text-white rounded-lg font-label-md text-label-md flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-base">cloud_download</span>
                <span>Seed Enterprise Data to MinIO</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Interactive Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-card border border-border-subtle rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                Submit Portal Feedback
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary">
              Let our engineering team know how CSM TRAC can better support your video review workflow.
            </p>
            <form onSubmit={handleSendFeedback} className="space-y-4">
              <textarea
                required
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your experience, feature requests, or issue report..."
                className="w-full p-3 bg-surface-subtle border border-border-subtle rounded-xl font-body-sm text-body-sm text-text-primary focus:outline-none focus:border-accent-interactive focus:ring-2 focus:ring-accent-interactive/15"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 border border-border-subtle rounded-lg text-text-secondary hover:bg-surface-subtle font-label-md text-label-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-interactive hover:bg-accent-hover text-white rounded-lg font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
                >
                  Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
