"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [showPass, setShowPass] = useState(false);

  async function onSubmit(data: LoginForm) {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Welcome back!");
      router.push("/admin/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-gray-950 to-gray-950" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code2 size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">
              Access your portfolio dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="admin@portfolio.dev"
                  className={`w-full pl-9 pr-4 py-2.5 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-500 focus:border-red-400"
                      : "border-gray-700 focus:border-primary-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-500 focus:border-red-400"
                      : "border-gray-700 focus:border-primary-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">
            Portfolio Admin Panel
          </p>
        </div>
      </motion.div>
    </div>
  );
}
