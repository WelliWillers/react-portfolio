"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, LogIn, User } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Profile } from "@/domain/entities";
import { signIn, useSession } from "next-auth/react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ profile }: { profile: Profile | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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

        {/* Desktop */}
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
          <ThemeToggle />
          {!!session?.user ? (
            <a href="/admin">
              {session?.user?.image ? (
                <img
                  src={session?.user?.image || ""}
                  alt="User avatar"
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 center flex items-center justify-center">
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
  );
}
