"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVideoContext } from "@/context/VideoContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { videos } = useVideoContext();

  const favoriteCount = videos.filter((v) => v.isFavorite).length;

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: "grid_view",
      active: pathname === "/",
    },
    {
      name: "Videos",
      href: "/videos",
      icon: "video_library",
      active:
        pathname.startsWith("/videos") ||
        pathname.startsWith("/my-videos") ||
        pathname.startsWith("/video-watch") ||
        pathname.startsWith("/transcript"),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-card border-r border-border-subtle z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Logo Section - ONLY the logo image, no extra text */}
        <div className="h-16 flex items-center px-space-lg border-b border-border-subtle">
          <Link href="/" className="flex items-center w-full">
            <img
              alt="TRAC Logo"
              className="h-8 w-auto max-w-[170px] object-contain"
              src="/logo.png"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-space-md py-space-md">
          <span className="px-space-sm font-label-sm text-label-sm text-text-muted uppercase tracking-wider block mb-space-xs">
            Navigation
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-space-sm py-2 rounded transition-colors font-body-md text-body-md ${
                  item.active
                    ? "bg-surface-subtle text-accent-interactive font-medium shadow-none"
                    : "text-on-surface-variant hover:bg-surface-subtle hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-space-md">
                  <span
                    className={`material-symbols-outlined text-xl leading-none ${
                      item.active ? "text-accent-interactive" : "text-text-muted"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {item.name === "Videos" && videos.length > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-subtle text-text-muted border border-border-subtle">
                    {videos.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Workspace Section */}
        <div className="px-space-md py-space-sm border-t border-border-subtle">
          <span className="px-space-sm font-label-sm text-label-sm text-text-muted uppercase tracking-wider block mb-space-xs">
            Workspace
          </span>
          <nav className="space-y-1">
            <Link
              className="flex items-center gap-space-md px-space-sm py-2 rounded text-on-surface-variant hover:bg-surface-subtle hover:text-on-surface transition-colors font-body-md text-body-md"
              href="/#support"
            >
              <span className="material-symbols-outlined text-xl leading-none text-text-muted">
                help
              </span>
              <span>Help &amp; Support</span>
            </Link>
            <Link
              className="flex items-center gap-space-md px-space-sm py-2 rounded text-on-surface-variant hover:bg-surface-subtle hover:text-on-surface transition-colors font-body-md text-body-md"
              href="/#settings"
            >
              <span className="material-symbols-outlined text-xl leading-none text-text-muted">
                settings
              </span>
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-space-md border-t border-border-subtle bg-surface-card">
          <div className="flex items-center gap-space-sm p-space-xs rounded-lg hover:bg-surface-subtle transition-colors cursor-pointer">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO6omun6R5oL9qCHRGIlB8qOIlIDUNT5UBHwcMZwiWzKIKb7jpouPMz6SD1ev-VSvPMOYPMgk83Z1NZsgN53S_eKbpKgsWmISpC9d02_U2a13q1CXR3DHb2z_yZMDrQTt-3xrAcTL_Anugf5T34wEiBZQUvolPda94t-Qz4gR3-aw8Uh1zAUeKIGs1a4THL5iETeZQko_j2qWlbvD0qUO-1chC3kwy1iJ9fNhdjWz0IOenw3tfdP4k"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-md text-label-md text-text-primary font-medium truncate">
                Sarah Jenkins
              </span>
              <span className="font-label-sm text-label-sm text-text-muted truncate">
                VP of Product Strategy
              </span>
            </div>
            <span className="material-symbols-outlined text-text-muted text-lg">
              unfold_more
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
