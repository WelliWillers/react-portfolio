"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const GLITCH_CHARS = "!@#$%^&*<>?/\\|{}[]~`";

function GlitchText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval>;

    const startGlitch = () => {
      let iterations = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        if (!el) return;
        el.innerText = text
          .split("")
          .map((char, idx) => {
            if (idx < iterations) return char;
            return GLITCH_CHARS[
              Math.floor(Math.random() * GLITCH_CHARS.length)
            ];
          })
          .join("");
        if (iterations >= text.length) {
          clearInterval(interval);
          el.innerText = text;
        }
        iterations += 0.4;
      }, 30);
    };

    startGlitch();

    const loop = setInterval(startGlitch, 4000);
    return () => {
      clearInterval(interval);
      clearInterval(loop);
    };
  }, [text]);

  return <span ref={ref}>{text}</span>;
}

const terminalLines = [
  { prefix: "$", text: "GET /page", delay: 0.2 },
  { prefix: ">", text: "Resolving route...", delay: 0.6 },
  { prefix: ">", text: "Searching filesystem...", delay: 1.0 },
  { prefix: "!", text: "ERROR 404: Not Found", delay: 1.4, error: true },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <motion.h1
              className="text-[10rem] font-black leading-none select-none"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 40px rgba(99,102,241,0.3))",
              }}
              animate={{
                filter: [
                  "drop-shadow(0 0 30px rgba(99,102,241,0.2))",
                  "drop-shadow(0 0 60px rgba(99,102,241,0.5))",
                  "drop-shadow(0 0 30px rgba(99,102,241,0.2))",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <GlitchText text="404" />
            </motion.h1>

            <motion.h1
              className="absolute inset-0 text-[10rem] font-black leading-none select-none opacity-20 text-red-400"
              animate={{ x: [-2, 2, -2], skewX: [-1, 1, -1] }}
              transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
            >
              404
            </motion.h1>
            <motion.h1
              className="absolute inset-0 text-[10rem] font-black leading-none select-none opacity-20 text-cyan-400"
              animate={{ x: [2, -2, 2], skewX: [1, -1, 1] }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatDelay: 3,
                delay: 0.05,
              }}
            >
              404
            </motion.h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="flex items-center gap-2 ml-3">
              <Terminal size={12} className="text-gray-500" />
              <span className="text-gray-500 text-xs font-mono">
                bash — portfolio
              </span>
            </div>
          </div>

          <div className="p-5 font-mono text-sm space-y-2">
            {terminalLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: line.delay, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <span
                  className={
                    line.error
                      ? "text-red-400"
                      : line.prefix === "$"
                        ? "text-primary-400"
                        : "text-gray-600"
                  }
                >
                  {line.prefix}
                </span>
                <span className={line.error ? "text-red-400" : "text-gray-300"}>
                  {line.text}
                </span>
                {i === terminalLines.length - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-4 bg-primary-400 inline-block ml-1"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            The page you&lsquo;re looking for has been moved, deleted, or never
            existed. Let&lsquo;s get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.4 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary-500/20"
          >
            <Home size={16} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-700 hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
