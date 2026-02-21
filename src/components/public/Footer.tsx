import { Code2, Heart } from "lucide-react";
import { Profile } from "@/domain/entities";

export function Footer({ profile }: { profile: Profile | null }) {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/50 py-8">
      <div className="container-custom text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <Code2 size={16} className="text-primary-500" />
          <span>Built with</span>
          <Heart size={14} className="text-red-500" fill="currentColor" />
          <span>by</span>
          <span className="text-primary-400 font-mono">
            {profile?.name ?? "Developer"}
          </span>
          <span>using Next.js, Prisma ORM & Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
