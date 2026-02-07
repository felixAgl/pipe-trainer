"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", section: NAV_SECTION.MAIN },
  { label: "Generator", href: "/dashboard/generator", section: NAV_SECTION.MAIN },
  { label: "Plans", href: "/dashboard/plans", section: NAV_SECTION.MANAGE },
  { label: "Clients", href: "/dashboard/clients", section: NAV_SECTION.MANAGE },
  { label: "Exercises", href: "/dashboard/exercises", section: NAV_SECTION.MANAGE },
  { label: "Settings", href: "/dashboard/settings", section: NAV_SECTION.MANAGE },
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
            "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(pathname, item.href)
              ? "bg-pt-accent text-black"
              : "text-pt-muted hover:bg-pt-border/50 hover:text-white"
          )}
        >
          {item.label}
        </Link>
      ))}

      <div className="my-3 border-t border-pt-border" />

      <span className="mb-1 px-3 text-xs font-semibold text-pt-muted uppercase tracking-wider">
        Manage
      </span>

      {manageItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(pathname, item.href)
              ? "bg-pt-accent text-black"
              : "text-pt-muted hover:bg-pt-border/50 hover:text-white"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className="border-b border-pt-border px-5 py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/pt-isotipo.png" alt="PipeTrainer" width={32} height={28} />
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
          <Image src="/pt-isotipo.png" alt="PipeTrainer" width={32} height={28} />
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
                <Image src="/pt-isotipo.png" alt="PipeTrainer" width={32} height={28} />
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
