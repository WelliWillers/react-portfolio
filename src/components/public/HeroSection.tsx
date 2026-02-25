"use client";

import { Contact, Profile } from "@/domain/entities";
import { motion } from "framer-motion";
import { ArrowDown, ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

const iconMap: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
};

export function HeroSection({
  profile,
  contacts,
}: {
  profile: Profile | null;
  contacts: Contact[];
}) {
  const socialContacts = contacts.filter((c) =>
    ["github", "linkedin", "email"].includes(c.type),
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-gray-950 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="container-custom relative z-10 px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {profile?.avatarUrl && (
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 blur-lg opacity-60 scale-110" />
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="relative rounded-full border-4 border-primary-500/50 object-cover"
                />
              </div>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available for work
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            <span className="text-white">Hi, I&apos;m </span>
            <span className="gradient-text">
              {profile?.name ?? "Developer"}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-400 font-mono mb-6">
            {profile?.title ?? "Full Stack Developer"}
          </p>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {profile?.subtitle ??
              "Building modern web experiences with passion and precision."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="#projects"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              View Projects <ExternalLink size={16} />
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-gray-700 text-gray-300 rounded-xl font-semibold hover:border-primary-500 hover:text-primary-400 transition-colors"
            >
              Contact Me
            </a>
          </div>

          <div className="flex items-center justify-center gap-4">
            {socialContacts.map((contact) => {
              const Icon = iconMap[contact.type] ?? ExternalLink;
              return (
                <a
                  key={contact.id}
                  href={contact.url ?? `mailto:${contact.value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gray-800/50 text-gray-400 hover:text-primary-400 hover:bg-gray-800 transition-colors border border-gray-700/50"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600"
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  );
}
