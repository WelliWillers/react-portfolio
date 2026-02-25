"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAtom } from "jotai";
import { userAtom } from "@/app/page";

export function AdminHeader() {
  const { data: session } = useSession();

  const [userProfile, setUserProfile] = useAtom(userAtom);

  return (
    <header className="h-[73px] bg-gray-900/50 border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-sm">
      <div className="text-sm text-gray-400">Panel</div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {session?.user ? (
            <img
              src={userProfile?.avatarUrl || ""}
              alt="User avatar"
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 center flex items-center justify-center">
              <User size={18} className="text-gray-900" />
            </div>
          )}
          <span>{userProfile?.name}</span>
        </div>
        <button
          onClick={() => {
            signOut({ callbackUrl: "/login" });
            setUserProfile(null);
          }}
          className="flex items-center gap-1 p-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
