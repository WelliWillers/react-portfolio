import {
  getProjectBySlug,
  getProjectBySlugWithReadme,
} from "@/application/use-cases";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  GitFork,
  Github,
  Star,
  Tag,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ViewTracker } from "./ViewTracker";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Portfolio`,
    description: project.description ?? "",
    openGraph: {
      title: project.title,
      description: project.description ?? "",
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlugWithReadme((await params).slug);
  if (!project || !project.published) notFound();

  return (
    <main className="min-h-screen bg-gray-950 pb-16">
      <ViewTracker projectId={project.id} />

      <div className="max-w-4xl mx-auto px-4">
        <div className="sticky top-0 bg-gray-950/95 backdrop-blur-sm pt-6 md:pt-10 pb-2 z-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors mb-4 md:mb-8 text-sm"
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-3 mb-3 md:mb-6">
            <div className="min-w-0 flex-1">
              <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30 mb-2 inline-block">
                {project.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight truncate">
                {project.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors text-xs md:text-sm"
                >
                  <Github size={14} />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-colors text-xs md:text-sm"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Live Demo</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs md:text-sm">
              <Eye size={13} className="text-primary-400" />
              <span className="font-mono">
                {project.views.toLocaleString()}
              </span>
              <span className="hidden sm:inline">views</span>
            </div>

            {project.stars > 0 && (
              <div className="flex items-center gap-1 text-gray-400 text-xs md:text-sm">
                <Star size={13} className="text-yellow-400" />
                <span className="font-mono">
                  {project.stars.toLocaleString()}
                </span>
              </div>
            )}

            {project.forks > 0 && (
              <div className="flex items-center gap-1 text-gray-400 text-xs md:text-sm">
                <GitFork size={13} className="text-gray-400" />
                <span className="font-mono">
                  {project.forks.toLocaleString()}
                </span>
              </div>
            )}

            {project.language && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                {project.language}
              </span>
            )}

            {project.topics.length > 0 && (
              <>
                <span className="text-gray-700 hidden md:inline">·</span>
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                  {project.topics.map((topic) => (
                    <span
                      key={topic}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700"
                    >
                      <Tag size={9} /> {topic}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {project.imageUrl && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden border border-gray-800 mb-8">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {project.readme ? (
          <div className="mt-10 prose prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-a:text-primary-400 max-w-none">
            <h3 className="text-2xl font-bold text-primary-500">Readme.md</h3>

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {project.readme}
            </ReactMarkdown>
          </div>
        ) : (
          project.description && (
            <p className="text-gray-300 text-lg leading-relaxed">
              {project.description}
            </p>
          )
        )}
      </div>
    </main>
  );
}
