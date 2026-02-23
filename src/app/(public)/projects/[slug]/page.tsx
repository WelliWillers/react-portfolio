import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectBySlugWithReadme,
} from "@/application/use-cases";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  ArrowLeft,
  Tag,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
      <div className="max-w-4xl mx-auto px-4">
        <div className="sticky top-0 bg-gray-950 pt-10 pb-2 z-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30 mb-3 inline-block">
                {project.category}
              </span>
              <h1 className="text-4xl font-bold text-white">{project.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors text-sm"
                >
                  <Github size={16} /> GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-colors text-sm"
                >
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-gray-500 text-sm mb-8">
            {project.language && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-400" />{" "}
                {project.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star size={14} /> {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={14} /> {project.forks}
            </span>
          </div>
          {project.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.topics.map((topic) => (
                <span
                  key={topic}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700"
                >
                  <Tag size={10} /> {topic}
                </span>
              ))}
            </div>
          )}
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
