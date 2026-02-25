"use client";

import { Work } from "@/domain/entities";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Calendar, Code2 } from "lucide-react";
import { useRef } from "react";

function formatDate(date?: Date | string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getDuration(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
  isCurrent?: boolean,
) {
  if (!startDate) return null;
  const start = new Date(startDate);
  const end = isCurrent ? new Date() : endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths}mo`;
  if (remainingMonths === 0) return `${years}yr`;
  return `${years}yr ${remainingMonths}mo`;
}

function sortWorks(works: Work[]): Work[] {
  return [...works].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });
}

export function WorksSection({ works }: { works: Work[] }) {
  const sorted = sortWorks(works);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (!works.length) return null;

  return (
    <section id="works" className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 text-primary-400 font-mono text-sm mb-4">
            <Code2 size={16} />
            <span>{"// experience.ts"}</span>
          </div>
          <h2 className="text-4xl font-bold text-white">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">
            My professional journey so far
          </p>
        </motion.div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-800 hidden md:block" />

          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px overflow-hidden hidden md:block">
            <motion.div
              className="w-full bg-gradient-to-b from-primary-500 to-accent-500 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12 md:space-y-0">
            {sorted.map((work, i) => {
              const isLeft = i % 2 === 0;
              const duration = getDuration(
                work.startDate,
                work.endDate,
                work.isCurrent,
              );

              return (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative md:grid md:grid-cols-2 md:gap-8 ${
                    isLeft ? "" : "md:[&>*:first-child]:order-last"
                  }`}
                >
                  <div
                    className={`${isLeft ? "md:text-right md:pr-10" : "md:pl-10"}`}
                  >
                    <div
                      className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50
                        hover:border-primary-500/40 transition-all duration-300 group
                        hover:bg-gray-800/80 hover:shadow-xl hover:shadow-primary-500/5`}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                      {work.isCurrent && (
                        <div
                          className={`flex items-center gap-1.5 mb-3 ${isLeft ? "md:justify-end" : ""}`}
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                          </span>
                          <span className="text-xs font-medium text-primary-400">
                            Current Position
                          </span>
                        </div>
                      )}

                      <h3 className="text-white font-bold text-lg mb-1">
                        {work.title}
                      </h3>

                      <div
                        className={`flex items-center gap-1.5 text-primary-400 text-sm mb-3 ${isLeft ? "md:justify-end" : ""}`}
                      >
                        <Briefcase size={13} />
                        <span className="font-medium">{work.company}</span>
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed">
                        {work.description}
                      </p>

                      <div
                        className={`flex items-center gap-3 mt-4 flex-wrap ${isLeft ? "md:justify-end" : ""}`}
                      >
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <Calendar size={12} />
                          <span>
                            {formatDate(work.startDate)}
                            {" → "}
                            {work.isCurrent ? (
                              <span className="text-primary-400">Present</span>
                            ) : (
                              formatDate(work.endDate)
                            )}
                          </span>
                        </div>
                        {duration && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700/80 text-gray-400 border border-gray-700 font-mono">
                            {duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10 hidden md:flex">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                      className={`w-4 h-4 rounded-full border-2 ${
                        work.isCurrent
                          ? "bg-primary-500 border-primary-400 shadow-lg shadow-primary-500/50"
                          : "bg-gray-900 border-gray-600"
                      }`}
                    />
                  </div>

                  <div className="hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
