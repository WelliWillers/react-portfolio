"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border border-transparent"
            style={{
              background:
                "linear-gradient(#0f172a, #0f172a) padding-box, linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4, #6366f1) border-box",
            }}
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-transparent"
            style={{
              background:
                "linear-gradient(#0f172a, #0f172a) padding-box, linear-gradient(135deg, #06b6d4, #6366f1, #8b5cf6) border-box",
            }}
          />

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 shadow-lg shadow-primary-500/50" />
          </motion.div>
        </motion.div>

        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.2, 1, 0.2],
                scaleY: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
              className="w-1 rounded-full bg-gradient-to-b from-primary-400 to-accent-400"
              style={{ height: "20px" }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col items-center gap-1"
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-gray-400 text-sm font-mono tracking-widest uppercase"
          >
            Loading
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
