"use client";

import { Project } from "@/domain/entities";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, ExternalLink, GitFork, Github, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "Featured", value: "FEATURED" },
  { label: "Frontend", value: "FRONTEND" },
  { label: "Backend", value: "BACKEND" },
  { label: "Mobile", value: "MOBILE" },
  { label: "FullStack", value: "FULLSTACK" },
];

const categoryColors: Record<string, string> = {
  FRONTEND: "from-blue-500 to-cyan-500",
  BACKEND: "from-green-500 to-emerald-500",
  MOBILE: "from-purple-500 to-pink-500",
  FULLSTACK: "from-orange-500 to-amber-500",
};

function ProjectCard({ project }: { project: Project }) {
  const gradient =
    categoryColors[project.category] ?? "from-gray-500 to-gray-600";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-all group"
    >
      <div className="relative h-48 overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} opacity-20 flex items-center justify-center`}
          >
            <Code2 size={40} className="text-white/50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient} text-white`}
          >
            {project.category}
          </span>
        </div>
        {project.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 border border-yellow-500/50 text-yellow-400">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        {project.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {project.language && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary-400" />
            {project.language}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <Star size={14} /> {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={14} /> {project.forks}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL"
      ? projects
      : filter === "FEATURED"
        ? projects.filter((p) => p.featured)
        : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-padding bg-gray-950">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 text-primary-400 font-mono text-sm mb-4">
            <Code2 size={16} />
            <span>{"// projects.list"}</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-8">
            My <span className="gradient-text">Projects</span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(cat.value)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter == "FEATURED" && filter === cat.value
                    ? "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400"
                    : filter === cat.value
                      ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/25"
                      : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            No projects in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
