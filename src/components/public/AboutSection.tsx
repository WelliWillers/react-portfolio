'use client'

import { motion } from 'framer-motion'
import { MapPin, Code2, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { Profile } from '@/domain/entities'

export function AboutSection({ profile }: { profile: Profile | null }) {
  return (
    <section id="about" className="section-padding bg-gray-900/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div className="flex items-center gap-2 text-primary-400 font-mono text-sm mb-4">
              <Code2 size={16} />
              <span>{'// about.me'}</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              {profile?.bio ?? 'Passionate developer with a love for crafting elegant solutions.'}
            </p>
            {profile?.location && (
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} className="text-primary-400" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>

          <div className="relative">
            {profile?.avatarUrl ? (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-xl" />
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={400}
                  height={400}
                  className="relative rounded-2xl object-cover w-full aspect-square border border-gray-700"
                />
              </div>
            ) : (
              <div className="relative bg-gray-800 rounded-2xl aspect-square border border-gray-700 flex items-center justify-center">
                <Sparkles size={64} className="text-gray-600" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
