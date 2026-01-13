"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Registration failed");
            } else {
                toast.success("Account created! Signing you in...");

                // Automatically sign in after registration
                const result = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (result?.error) {
                    toast.error("Account created, but automatic sign in failed. Please login manually.");
                    router.push("/login");
                } else {
                    router.push("/");
                    router.refresh();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-row-reverse">
            {/* Right Side - Form */}
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
                            Create an account
                        </h1>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Join the community and start exchanging skills today
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input id="firstName" type="text" label="First Name" required value={formData.firstName} onChange={handleChange} />
                                    <Input id="lastName" type="text" label="Last Name" required value={formData.lastName} onChange={handleChange} />
                                </div>
                                <Input id="email" type="email" label="Email Address" required value={formData.email} onChange={handleChange} />

                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        label="Password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>



                            <p className="text-center text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-500">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Left Side - Artistic Image */}
            <div className="hidden w-1/2 bg-slate-900 lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent md:to-transparent"></div>

                <div className="absolute bottom-20 left-20 z-10 max-w-md">
                    <blockquote className="space-y-2">
                        <p className="text-2xl font-medium text-black">
                            &ldquo;Share your knowledge. It is a way to achieve immortality.&rdquo;
                        </p>

                    </blockquote>
                </div>
            </div>
        </div>
    );
}
