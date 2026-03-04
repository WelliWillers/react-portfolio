"use client";

import { cn } from "@/lib/utils";
import {
  Award,
  ChevronRight,
  Code2,
  Cpu,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Phone,
  Settings,
  User,
  Workflow,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: Newspaper,
  },
  {
    href: "/admin/blog/comments",
    label: "Comments",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Profile", href: "/admin/settings/profile", icon: User },
      { label: "Skills", href: "/admin/settings/skills", icon: Cpu },
      { label: "Services", href: "/admin/settings/services", icon: Wrench },
      { label: "Works", href: "/admin/settings/works", icon: Workflow },
      {
        label: "Certificates",
        href: "/admin/settings/certificates",
        icon: Award,
      },
      { label: "Contacts", href: "/admin/settings/contacts", icon: Phone },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 hidden lg:flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary-400 font-bold font-mono"
        >
          <Code2 size={22} />
          <span>Portfolio Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            const isActive = item.children.some((c) =>
              pathname.startsWith(c.href),
            );
            return (
              <div key={item.label}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1",
                    isActive ? "text-white" : "text-gray-400",
                  )}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </div>
                <div className="ml-4 space-y-0.5">
                  {item.children.map((child) => {
                    const active = pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          active
                            ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                            : "text-gray-500 hover:text-gray-300 hover:bg-gray-800",
                        )}
                      >
                        <child.icon size={14} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
              )}
            >
              <item.icon size={16} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-300 text-sm rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ChevronRight size={14} />
          View public site
        </Link>
      </div>
    </aside>
  );
}
