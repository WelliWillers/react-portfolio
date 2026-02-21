'use client'

import { motion } from 'framer-motion'
import { Layers, Globe, Smartphone, Server, Code2, Wrench } from 'lucide-react'
import { Service } from '@/domain/entities'

const iconMap: Record<string, any> = {
  frontend: Globe,
  backend: Server,
  mobile: Smartphone,
  layers: Layers,
  code: Code2,
  wrench: Wrench,
}

export function ServicesSection({ services }: { services: Service[] }) {
  if (!services.length) return null

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
            <span>{'// services.ts'}</span>
          </div>
          <h2 className="text-4xl font-bold text-white">
            What I <span className="gradient-text">Do</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = (service.icon && iconMap[service.icon.toLowerCase()]) ?? Code2
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
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
