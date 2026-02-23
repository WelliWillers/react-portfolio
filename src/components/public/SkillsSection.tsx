"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { Skill } from "@/domain/entities";

function getSkillColor(level: number) {
  if (level < 6)
    return {
      bar: "from-red-600 via-rose-500 to-orange-400",
      text: "text-rose-400",
      border: "hover:border-rose-500/50",
      glow: "shadow-rose-500/20",
    };
  if (level <= 8)
    return {
      bar: "from-yellow-600 via-amber-500 to-yellow-300",
      text: "text-amber-400",
      border: "hover:border-amber-500/50",
      glow: "shadow-amber-500/20",
    };
  return {
    bar: "from-green-600 via-emerald-500 to-teal-400",
    text: "text-emerald-400",
    border: "hover:border-emerald-500/50",
    glow: "shadow-emerald-500/20",
  };
}

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const colors = getSkillColor(skill.level);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 ${colors.border} transition-colors`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 font-medium">{skill.name}</span>
        <span className={`text-sm font-mono ${colors.text}`}>
          {skill.level}/10
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level * 10}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
        />
      </div>
    </motion.div>
  );
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  return (
    <section id="skills" className="section-padding bg-gray-950">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-primary-400 font-mono text-sm mb-4">
            <Code2 size={16} />
            <span>{"// skills.json"}</span>
          </div>
          <h2 className="text-4xl font-bold text-white">
            My <span className="gradient-text">Skills</span>
          </h2>
        </motion.div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((skill, i) => (
                  <SkillBar key={skill.id} skill={skill} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
