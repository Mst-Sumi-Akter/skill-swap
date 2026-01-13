"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleQuickLogin = (email: string, pass: string) => {
        setEmail(email);
        setPassword(pass);
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error || "Invalid credentials");
            } else {
                toast.success("Login successful!");
                // Direct call to auth to check role if possible, but easier to just refresh or use router
                // To be precise, since we don't have the session yet, we can't check role here without extra api call
                // But we can just push to /dashboard and let dashboard handle it.
                // Or better, if we want to be proactive:
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center bg-background px-8 py-12 lg:w-1/2 lg:px-16 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <Link href="/" className="mb-8 inline-block">
                        <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
                            Skill Swap
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Enter your credentials to access your account
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <Input
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        label="Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-slate-600">
                                    <input type="checkbox" className="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                                    Remember me
                                </label>
                                <Link href="#" className="font-medium text-violet-600 hover:text-violet-500">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign in
                            </Button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-slate-500">Quick Login for Demo</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleQuickLogin("admin@mail.com", "123456789")}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-slate-400 transition-colors"
                                >
                                    <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                                    <span>Admin: admin</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickLogin("moon@gmail.com", "password123")}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-slate-400 transition-colors"
                                >
                                    <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                                    <span>Seed: Moon</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickLogin("n@gmail.com", "qwert")}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-slate-400 transition-colors"
                                >
                                    <User className="h-3.5 w-3.5 text-emerald-500" />
                                    <span>User: nipa</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickLogin("sumi@gmail.com", "zxcvb")}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-slate-400 transition-colors"
                                >
                                    <User className="h-3.5 w-3.5 text-blue-500" />
                                    <span>User: sumi</span>
                                </button>
                            </div>

                            <p className="text-center text-sm text-slate-500">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-500">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Artistic Image */}
            <div className="hidden w-1/2 bg-slate-900 lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent md:to-transparent"></div>

                <div className="absolute bottom-20 left-20 z-10 max-w-md">
                    <blockquote className="space-y-2">
                        <p className="text-2xl font-medium text-black">
                            &ldquo;The beautiful thing about learning is that no one can take it away from you.&rdquo;
                        </p>

                    </blockquote>
                </div>
            </div>
        </div>
    );
}
