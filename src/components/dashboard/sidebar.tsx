"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PT_ISOTIPO_DATA_URL } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

const NAV_SECTION = {
  MAIN: "main",
  MANAGE: "manage",
} as const;

type NavSection = (typeof NAV_SECTION)[keyof typeof NAV_SECTION];

interface NavItem {
  label: string;
  href: string;
  section: NavSection;
  icon: React.ReactNode;
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconDumbbell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6 12h12M17.5 17.5h-11" />
      <rect x="2" y="5" width="4" height="14" rx="1" />
      <rect x="18" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", section: NAV_SECTION.MAIN, icon: <IconHome /> },
  { label: "Generator", href: "/dashboard/generator", section: NAV_SECTION.MAIN, icon: <IconZap /> },
  { label: "Plans", href: "/dashboard/plans", section: NAV_SECTION.MANAGE, icon: <IconClipboard /> },
  { label: "Clients", href: "/dashboard/clients", section: NAV_SECTION.MANAGE, icon: <IconUsers /> },
  { label: "Exercises", href: "/dashboard/exercises", section: NAV_SECTION.MANAGE, icon: <IconDumbbell /> },
  { label: "Settings", href: "/dashboard/settings", section: NAV_SECTION.MANAGE, icon: <IconSettings /> },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const mainItems = NAV_ITEMS.filter((item) => item.section === NAV_SECTION.MAIN);
  const manageItems = NAV_ITEMS.filter((item) => item.section === NAV_SECTION.MANAGE);

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {mainItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(pathname, item.href)
              ? "bg-pt-accent text-black"
              : "text-pt-muted hover:bg-pt-border/50 hover:text-white"
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}

      <div className="my-3 border-t border-pt-border" />

      <span className="mb-1 px-3 text-xs font-semibold text-pt-muted uppercase tracking-wider">
        Manage
      </span>

      {manageItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <div key={item.href} className="group flex items-center">
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex flex-1 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-pt-accent text-black"
                  : "text-pt-muted hover:bg-pt-border/50 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "rounded-md p-1.5 opacity-0 transition-opacity group-hover:opacity-100",
                active ? "text-black/50 hover:text-black" : "text-pt-muted hover:text-white"
              )}
              title={`Ver ${item.label}`}
            >
              <IconEye />
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className="border-b border-pt-border px-5 py-5">
      <Link href="/" className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PT_ISOTIPO_DATA_URL} alt="PipeTrainer" width={32} height={28} />
        <span className="text-sm font-semibold text-white">PipeTrainer</span>
      </Link>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-pt-border bg-pt-card px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PT_ISOTIPO_DATA_URL} alt="PipeTrainer" width={32} height={28} />
          <span className="text-sm font-semibold text-white">PipeTrainer</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-pt-muted hover:bg-pt-border/50 hover:text-white"
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>
      </header>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Slide-in Panel */}
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-pt-card shadow-xl">
            <div className="flex items-center justify-between border-b border-pt-border px-5 py-5">
              <Link href="/" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PT_ISOTIPO_DATA_URL} alt="PipeTrainer" width={32} height={28} />
                <span className="text-sm font-semibold text-white">PipeTrainer</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-pt-muted hover:text-white"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
            <div className="border-t border-pt-border px-5 py-4">
              <p className="text-xs text-pt-muted">PipeTrainer v1.0</p>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-56 flex-col border-r border-pt-border bg-pt-card lg:flex">
        <SidebarBrand />
        <SidebarNav />
        <div className="border-t border-pt-border px-5 py-4">
          <p className="text-xs text-pt-muted">PipeTrainer v1.0</p>
        </div>
      </aside>
    </>
  );
}
