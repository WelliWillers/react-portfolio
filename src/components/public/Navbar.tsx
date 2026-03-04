"use client";

import { userAtom } from "@/app/page";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Post, Profile, Project } from "@/domain/entities";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import {
  BookOpen,
  Code2,
  ExternalLink,
  FileText,
  FolderOpen,
  Hash,
  LogIn,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SearchItem {
  id: string;
  type: "page" | "project" | "post";
  label: string;
  description?: string;
  href: string;
  icon: React.ReactNode;
}

const STATIC_PAGES: SearchItem[] = [
  {
    id: "home",
    type: "page",
    label: "Home",
    href: "/",
    icon: <Hash size={14} />,
  },
  {
    id: "about",
    type: "page",
    label: "About",
    href: "/#about",
    icon: <Hash size={14} />,
  },
  {
    id: "skills",
    type: "page",
    label: "Skills",
    href: "/#skills",
    icon: <Hash size={14} />,
  },
  {
    id: "services",
    type: "page",
    label: "Services",
    href: "/#services",
    icon: <Hash size={14} />,
  },
  {
    id: "works",
    type: "page",
    label: "Works",
    href: "/#works",
    icon: <Hash size={14} />,
  },
  {
    id: "projects",
    type: "page",
    label: "Projects",
    href: "/#projects",
    icon: <Hash size={14} />,
  },
  {
    id: "certificates",
    type: "page",
    label: "Certificates",
    href: "/#certificates",
    icon: <Hash size={14} />,
  },
  {
    id: "contact",
    type: "page",
    label: "Contact",
    href: "/#contact",
    icon: <Hash size={14} />,
  },
  {
    id: "blog",
    type: "page",
    label: "Blog",
    href: "/blog",
    icon: <BookOpen size={14} />,
  },
];

function CommandDialog({
  open,
  onClose,
  projects,
  posts,
}: {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  posts: Post[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  function navigate(href: string) {
    onClose();
    if (href.startsWith("/#")) {
      if (window.location.pathname !== "/") {
        router.push(href);
      } else {
        const id = href.replace("/#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
  }

  const allItems: SearchItem[] = [
    ...STATIC_PAGES,
    ...projects.map((p) => ({
      id: p.id,
      type: "project" as const,
      label: p.title,
      description: p.description ?? p.language ?? p.category,
      href: `/projects/${p.slug}`,
      icon: <FolderOpen size={14} />,
    })),
    ...posts.map((p) => ({
      id: p.id,
      type: "post" as const,
      label: p.title,
      description: p.excerpt ?? p.category?.name,
      href: `/blog/${p.slug}`,
      icon: <FileText size={14} />,
    })),
  ];

  const typeLabel: Record<SearchItem["type"], string> = {
    page: "Pages",
    project: "Projects",
    post: "Blog Posts",
  };

  const typeColor: Record<SearchItem["type"], string> = {
    page: "text-gray-400",
    project: "text-primary-400",
    post: "text-cyan-400",
  };

  const typeBg: Record<SearchItem["type"], string> = {
    page: "bg-gray-700/50",
    project: "bg-primary-500/10",
    post: "bg-cyan-500/10",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed w-full h-screen z-[61] px-4 flex justify-center mx-auto items-center"
          >
            <Command
              className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
              shouldFilter
              filter={(value, search) =>
                value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
              }
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-800">
                <Search size={16} className="text-gray-500 shrink-0" />
                <Command.Input
                  ref={inputRef}
                  placeholder="Search pages, projects, posts..."
                  className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-500 text-xs">
                  Esc
                </kbd>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden">
                <Command.Empty className="text-center text-gray-500 text-sm py-10">
                  No results found.
                </Command.Empty>

                {(["page", "project", "post"] as SearchItem["type"][]).map(
                  (type) => {
                    const items = allItems.filter((i) => i.type === type);
                    return (
                      <Command.Group
                        key={type}
                        heading={typeLabel[type]}
                        className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-gray-600
                        [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase
                        [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2
                        [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:mt-1"
                      >
                        {items.map((item) => (
                          <Command.Item
                            key={item.id}
                            value={`${item.label} ${item.description ?? ""}`}
                            onSelect={() => navigate(item.href)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                            text-gray-300 hover:text-white transition-colors
                            data-[selected=true]:bg-gray-800 data-[selected=true]:text-white
                            focus:outline-none"
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${typeBg[item.type]} ${typeColor[item.type]}`}
                            >
                              {item.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.label}
                              </p>
                              {item.description && (
                                <p className="text-xs text-gray-500 truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <span
                              className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${typeBg[item.type]} ${typeColor[item.type]}`}
                            >
                              {type}
                            </span>

                            <ExternalLink
                              size={12}
                              className="text-gray-600 shrink-0"
                            />
                          </Command.Item>
                        ))}
                      </Command.Group>
                    );
                  },
                )}
              </Command.List>

              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-800">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-500">
                      ↑↓
                    </kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-500">
                      ↵
                    </kbd>
                    open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-500">
                      Esc
                    </kbd>
                    close
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Search size={11} />
                  <span>{allItems.length} items indexed</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "/blog" },
];

export function Navbar({
  profile,
  projects = [],
  posts = [],
}: {
  profile: Profile | null;
  projects?: Project[];
  posts?: Post[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { data: session } = useSession();
  const [, setUserProfile] = useAtom(userAtom);

  useEffect(() => {
    setUserProfile(profile);
  }, [profile, setUserProfile]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      if (e.key === "Escape") setCmdOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gray-950/90 backdrop-blur-md shadow-lg border-b border-gray-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom flex items-center justify-between h-16 px-4">
          <a
            href="#"
            className="flex items-center gap-2 font-mono text-primary-400 font-bold text-lg"
          >
            <Code2 size={22} />
            <span>{profile?.name?.split(" ")[0] ?? "Dev"}</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 border border-gray-700/50
                rounded-xl text-gray-400 hover:text-white hover:border-gray-600 transition-all text-sm"
            >
              <Search size={14} />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className="hidden sm:flex items-center gap-0.5 text-xs text-gray-600 font-mono">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            </button>

            <ThemeToggle />

            {!!session?.user ? (
              <a href="/admin">
                {profile?.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User size={18} className="text-gray-900" />
                  </div>
                )}
              </a>
            ) : (
              <button
                onClick={() => signIn("credentials", { callbackUrl: "/login" })}
                className="flex items-center gap-1 p-2 text-sm text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-xl transition-colors"
              >
                <LogIn size={18} />
              </button>
            )}

            <button
              className="md:hidden p-2 text-gray-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-950/95 border-t border-gray-800"
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setCmdOpen(true);
                }}
                className="flex items-center gap-3 w-full px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <Search size={16} />
                <span>Search...</span>
              </button>

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <CommandDialog
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        projects={projects}
        posts={posts}
      />
    </>
  );
}
