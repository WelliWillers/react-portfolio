"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, Code2 } from "lucide-react";
import { Certificate } from "@/domain/entities";

export function CertificatesSection({
  certificates,
}: {
  certificates: Certificate[];
}) {
  if (!certificates.length) return null;

  return (
    <section id="certificates" className="section-padding bg-gray-900/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-primary-400 font-mono text-sm mb-4">
            <Code2 size={16} />
            <span>{"// certificates.list"}</span>
          </div>
          <h2 className="text-4xl font-bold text-white">
            <span className="gradient-text">Certificates</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center flex-shrink-0">
                  <Award size={22} className="text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold leading-tight mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{cert.institution}</p>
                  {cert.date && (
                    <p className="text-gray-600 text-xs mt-1">{cert.date}</p>
                  )}

                  <div className="flex items-start gap-3">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-400 text-xs mt-1 hover:underline"
                      >
                        View external certificate <ExternalLink size={10} />
                      </a>
                    )}

                    {cert.fileUrl && (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-400 text-xs mt-1 hover:underline"
                      >
                        View file <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
