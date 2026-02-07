"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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

export function Sidebar() {
  const pathname = usePathname();

  const mainItems = NAV_ITEMS.filter((item) => item.section === NAV_SECTION.MAIN);
  const manageItems = NAV_ITEMS.filter((item) => item.section === NAV_SECTION.MANAGE);

  return (
    <aside className="flex h-full w-56 flex-col border-r border-pt-border bg-pt-card">
      <div className="flex items-center gap-2 border-b border-pt-border px-5 py-5">
        <span className="text-xl font-black text-pt-accent italic">PT</span>
        <span className="text-sm font-semibold text-white">PipeTrainer</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {mainItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(pathname, item.href)
                ? "bg-pt-accent text-black"
                : "text-pt-muted hover:bg-pt-border/50 hover:text-white"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-pt-border px-5 py-4">
        <p className="text-xs text-pt-muted">PipeTrainer v1.0</p>
      </div>
    </aside>
  );
}
