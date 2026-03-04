import {
  getCertificates,
  getProfile,
  getPublishedPosts,
  getPublishedProjects,
  getServices,
  getSkills,
  getVisibleContacts,
  getWorks,
} from "@/application/use-cases";
import { AboutSection } from "@/components/public/AboutSection";
import { CertificatesSection } from "@/components/public/CertificatesSection";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { Navbar } from "@/components/public/Navbar";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { WorksSection } from "@/components/public/WorksSection";
import { Profile } from "@/domain/entities";
import { atomWithStorage } from "jotai/utils";

export const dynamic = "force-dynamic";

export const userAtom = atomWithStorage<Profile | null>("user_profile", null);

export default async function HomePage() {
  const [
    projects,
    posts,
    skills,
    services,
    contacts,
    profile,
    certificates,
    works,
  ] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
    getSkills(),
    getServices(),
    getVisibleContacts(),
    getProfile(),
    getCertificates(),
    getWorks(),
  ]);

  return (
    <main className="min-h-screen bg-gray-950">
      <Navbar profile={profile} projects={projects} posts={posts} />
      <HeroSection profile={profile} contacts={contacts} />
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <ServicesSection services={services} />
      <WorksSection works={works} />
      <ProjectsSection projects={projects} />
      <CertificatesSection certificates={certificates} />
      <ContactSection contacts={contacts} />
      <Footer profile={profile} />
    </main>
  );
}
