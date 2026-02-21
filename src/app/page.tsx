import { getPublishedProjects, getSkills, getServices, getVisibleContacts, getProfile, getCertificates } from '@/application/use-cases'
import { HeroSection } from '@/components/public/HeroSection'
import { AboutSection } from '@/components/public/AboutSection'
import { SkillsSection } from '@/components/public/SkillsSection'
import { ServicesSection } from '@/components/public/ServicesSection'
import { ProjectsSection } from '@/components/public/ProjectsSection'
import { CertificatesSection } from '@/components/public/CertificatesSection'
import { ContactSection } from '@/components/public/ContactSection'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

export default async function HomePage() {
  const [projects, skills, services, contacts, profile, certificates] = await Promise.all([
    getPublishedProjects(),
    getSkills(),
    getServices(),
    getVisibleContacts(),
    getProfile(),
    getCertificates(),
  ])

  return (
    <main className="min-h-screen bg-gray-950">
      <Navbar profile={profile} />
      <HeroSection profile={profile} contacts={contacts} />
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <ServicesSection services={services} />
      <ProjectsSection projects={projects} />
      <CertificatesSection certificates={certificates} />
      <ContactSection contacts={contacts} />
      <Footer profile={profile} />
    </main>
  )
}
