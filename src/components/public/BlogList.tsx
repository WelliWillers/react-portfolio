"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Code2,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Post = any; // use seu tipo gerado pelo Prisma

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (posts.length === 1) return <FeaturedCard post={posts[0]} large />;

  return (
    <div className="relative overflow-hidden rounded-3xl" ref={emblaRef}>
      <div className="flex">
        {posts.map((post) => (
          <div key={post.id} className="flex-[0_0_100%] min-w-0">
            <FeaturedCard post={post} large />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              emblaApi?.scrollTo(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({
  post,
  large = false,
}: {
  post: Post;
  large?: boolean;
}) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div
        className={`relative overflow-hidden rounded-3xl group ${large ? "h-[480px]" : "h-72"}`}
      >
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-accent-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-500 text-white">
              Featured
            </span>
            {post.category && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/80 backdrop-blur-sm border border-white/10">
                {post.category.name}
              </span>
            )}
          </div>

          <h2
            className={`font-bold text-white mb-2 leading-tight ${large ? "text-2xl md:text-4xl" : "text-xl"}`}
          >
            {post.title}
          </h2>

          {post.excerpt && large && (
            <p className="text-white/70 text-sm mb-4 line-clamp-2 max-w-2xl">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-white/60 text-xs">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(post.createdAt)}
            </div>
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime} min read
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye size={12} />
              {post.views.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-4 text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Read article <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="h-full bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-primary-500/40 transition-all overflow-hidden">
          {post.coverUrl && (
            <div className="relative h-44 overflow-hidden">
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {post.category && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  {post.category.name}
                </span>
              )}
            </div>

            <h3 className="text-white font-bold mb-2 leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-3 text-gray-500 text-xs mt-auto">
              <div className="flex items-center gap-1">
                <Calendar size={11} />
                {formatDate(post.createdAt)}
              </div>
              {post.readTime && (
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.readTime}min
                </div>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <Eye size={11} />
                {post.views}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BlogList({ posts }: { posts: Post[] }) {
  const featured = posts.filter((p) => p.featured);
  const regular = posts.filter((p) => !p.featured);
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(
    new Map(
      posts.filter((p) => p.category).map((p) => [p.category.id, p.category]),
    ).values(),
  );

  const filtered = filter
    ? regular.filter((p) => p.category?.id === filter)
    : regular;

  return (
    <div className="min-h-screen bg-gray-950 pt-4 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-primary-400 font-mono text-sm mb-4">
            <Code2 size={16} />
            <span>{"// blog.ts"}</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Latest <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Thoughts, tutorials and insights about software development.
          </p>
        </motion.div>

        {featured.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <FeaturedCarousel posts={featured} />
          </motion.div>
        )}

        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !filter
                  ? "bg-primary-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              All
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id === filter ? null : cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === cat.id
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 py-16"
            >
              No posts in this category yet.
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
