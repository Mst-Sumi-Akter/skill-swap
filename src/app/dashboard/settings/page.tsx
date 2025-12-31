"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Link as LinkIcon, Save, Camera } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        photoURL: "",
    });

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                email: session.user.email || "",
                photoURL: session.user.image || "",
            });
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/${session.user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    photoURL: formData.photoURL,
                }),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const updatedUser = await res.json();

            // Update the session client-side
            await update({
                ...session,
                user: {
                    ...session.user,
                    name: updatedUser.name,
                    image: updatedUser.photoURL,
                }
            });

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your profile information and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Preview Card */}
                <div className="lg:col-span-1">
                    <Card className="p-6 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-4">
                        <div className="relative mx-auto w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-violet-100">
                            {formData.photoURL ? (
                                <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-slate-400" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{formData.name || "Set your name"}</h3>
                            <p className="text-sm text-slate-500">{formData.email}</p>
                        </div>
                        <div className="pt-4 flex flex-wrap gap-2 justify-center">
                            <span className="px-2 py-1 rounded-md bg-violet-50 text-violet-600 text-xs font-semibold border border-violet-100 dark:bg-violet-900/10 dark:text-violet-400">
                                Active Member
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Main Form */}
                <div className="lg:col-span-2">
                    <Card className="p-8 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 border-b pb-2">Personal Information</h4>

                                <div className="space-y-2">
                                    <Input
                                        label="Display Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        label="Email Address"
                                        value={formData.email}
                                        disabled
                                        className="bg-slate-50 dark:bg-zinc-800 cursor-not-allowed opacity-70"
                                    />
                                    <p className="text-[10px] text-slate-400 italic">Email cannot be changed for security reasons.</p>
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        label="Profile Image URL"
                                        value={formData.photoURL}
                                        onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 px-6"
                                >
                                    {isLoading ? (
                                        "Saving..."
                                    ) : (
                                        <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
