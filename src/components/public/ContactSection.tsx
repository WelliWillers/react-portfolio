"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Globe,
  Phone,
  Code2,
  ExternalLink,
} from "lucide-react";
import { Contact } from "@/domain/entities";

const iconMap: Record<string, any> = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
  phone: Phone,
};

export function ContactSection({ contacts }: { contacts: Contact[] }) {
  return (
    <section id="contact" className="section-padding bg-gray-950">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-primary-400 font-mono text-sm mb-4">
            <Code2 size={16} />
            <span>{"// contact.me"}</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Feel free to reach out for collaborations, job opportunities, or
            just a friendly chat!
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {contacts.map((contact, i) => {
              const Icon = iconMap[contact.type] ?? ExternalLink;
              const href =
                contact.url ??
                (contact.type === "email"
                  ? `mailto:${contact.value}`
                  : contact.value);

              return (
                <motion.a
                  key={contact.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-primary-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={20} className="text-primary-400 w-12" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{contact.label}</p>
                    <p className="text-white font-medium">{contact.value}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {!contacts.length && (
            <div className="text-center py-10 text-gray-600">
              No contact info added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
