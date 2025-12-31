"use client";

import React, { useState, useRef } from "react";
import ReactConfetti from "react-confetti";
import { Loader2, Upload, X, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AddCourse() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const [formData, setFormData] = useState({
        title: "",
        category: "Development",
        platform: "Udemy",
        description: "",
        thumbnailUrl: ""
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    React.useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
        setImagePreview(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.thumbnailUrl) {
            toast.error("Please provide a course thumbnail URL");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
                toast.success("Course submitted for approval!");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to add course");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="relative min-h-[70vh] flex flex-col items-center justify-center p-4">
                <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Request Submitted!</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Your course "<strong>{formData.title}</strong>" has been sent to administrators for review.
                            It will appear in the marketplace once approved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setSuccess(false);
                                setFormData({ title: "", category: "Development", platform: "Udemy", description: "", thumbnailUrl: "" });
                                setImagePreview(null);
                            }}
                        >
                            Add Another
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600"
                            onClick={() => router.push("/dashboard/my-courses")}
                        >
                            View My Courses
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Add New Course</h1>
                <p className="text-slate-500 dark:text-slate-400">Share your expertise and start exchanging skills with others.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-6 md:p-8 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="h-6 w-1 bg-violet-600 rounded-full"></span>
                                    Course Information
                                </h3>
                                <Input
                                    label="Course Title"
                                    placeholder="e.g. Advanced React Patterns"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full h-11 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                                        >
                                            <option>Development</option>
                                            <option>Design</option>
                                            <option>Marketing</option>
                                            <option>Business</option>
                                            <option>Personal Growth</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Platform</label>
                                        <select
                                            value={formData.platform}
                                            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                                            className="w-full h-11 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                                        >
                                            <option>Udemy</option>
                                            <option>Coursera</option>
                                            <option>YouTube</option>
                                            <option>Skillshare</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full min-h-[150px] rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 resize-none transition-all placeholder:text-slate-400"
                                        placeholder="Describe what students will learn, the main topics covered, and any requirements..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 dark:shadow-none"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                                    ) : (
                                        "Publish Course"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-50 mb-4">Course Thumbnail</h3>

                        <div className="space-y-4">
                            <Input
                                label="Thumbnail URL"
                                placeholder="Paste image URL here..."
                                value={formData.thumbnailUrl}
                                onChange={handleUrlChange}
                            />

                            <div className={cn(
                                "relative aspect-video rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden",
                                imagePreview
                                    ? "border-violet-500"
                                    : "border-slate-200 dark:border-zinc-800"
                            )}>
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="Preview"
                                        onError={() => toast.error("Invalid image URL")}
                                    />
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="h-12 w-12 bg-violet-50 dark:bg-violet-900/20 rounded-full flex items-center justify-center mx-auto mb-3 text-violet-600">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Preview Area</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Image will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                            <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 mb-1">
                                <Upload className="h-3 w-3" />
                                Pro Tip
                            </h4>
                            <p className="text-[10px] leading-relaxed text-blue-600/80 dark:text-blue-400/70">
                                Courses with high-quality thumbnails get 3x more exchange requests. Use 16:9 aspect ratio for best results.
                            </p>
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-900 text-white border-none shadow-xl">
                        <h4 className="font-bold mb-2">Submission Rules</h4>
                        <ul className="text-xs space-y-2 text-slate-400">
                            <li className="flex gap-2">
                                <span className="h-1 w-1 bg-violet-400 rounded-full mt-1.5 shrink-0"></span>
                                Ensure you own the rights to the course material.
                            </li>
                            <li className="flex gap-2">
                                <span className="h-1 w-1 bg-violet-400 rounded-full mt-1.5 shrink-0"></span>
                                Double check title and description for clarity.
                            </li>
                            <li className="flex gap-2">
                                <span className="h-1 w-1 bg-violet-400 rounded-full mt-1.5 shrink-0"></span>
                                Courses are reviewed within 24-48 hours.
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
