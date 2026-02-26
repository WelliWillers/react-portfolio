"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Layers,
  Globe,
  Smartphone,
  Server,
  Code2,
  Wrench,
  ChevronRight,
  Check,
} from "lucide-react";
import { Service } from "@/domain/entities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { useState } from "react";

const iconMap: Record<string, any> = {
  frontend: Globe,
  backend: Server,
  mobile: Smartphone,
  layers: Layers,
  code: Code2,
  wrench: Wrench,
};

export function ServicesSection({ services }: { services: Service[] }) {
  const [selected, setSelected] = useState<Service | null>(null);
  if (!services.length) return null;

  const SelectedIcon =
    (selected?.icon && iconMap[selected.icon.toLowerCase()]) ?? Code2;

  return (
    <section id="services" className="section-padding bg-gray-900/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-primary-400 font-mono text-sm mb-4">
            <Code2 size={16} />
            <span>{"// services.ts"}</span>
          </div>
          <h2 className="text-4xl font-bold text-white">
            What I <span className="gradient-text">Do</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon =
              (service.icon && iconMap[service.icon.toLowerCase()]) ?? Code2;

            const hasHighlights =
              Array.isArray(service.highlights) &&
              service.highlights.length > 0;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {service.description}
                </p>

                {hasHighlights && (
                  <button
                    onClick={() => setSelected(service)}
                    className="mt-4 flex items-center gap-1.5 text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors group/btn w-fit"
                  >
                    See details
                    <ChevronRight
                      size={15}
                      className="group-hover/btn:translate-x-0.5 transition-transform"
                    />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center shrink-0">
                <SelectedIcon size={18} className="text-primary-400" />
              </div>
              <DialogTitle>{selected?.title}</DialogTitle>
            </div>
            <DialogDescription>{selected?.description}</DialogDescription>
          </DialogHeader>

          <div className="p-6 pt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              What&quot;s included
            </p>

            <ul className="space-y-3">
              <AnimatePresence>
                {(selected?.highlights as { value: string }[] | undefined)?.map(
                  (item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary-500/15 border border-primary-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-primary-400" />
                      </div>
                      <span className="text-gray-300 text-sm leading-relaxed">
                        {item.value}
                      </span>
                    </motion.li>
                  ),
                )}
              </AnimatePresence>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
