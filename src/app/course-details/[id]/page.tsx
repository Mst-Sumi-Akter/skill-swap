"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Lock, ShieldCheck, Clock, Globe, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CourseDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const { data: course, isLoading, error } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            const res = await fetch(`/api/courses/${id}`);
            if (!res.ok) throw new Error('Failed to fetch course');
            return res.json();
        },
        enabled: !!id
    });

    const { data: myCourses } = useQuery({
        queryKey: ['my-courses'],
        queryFn: async () => {
            const res = await fetch(`/api/courses?mode=my`);
            if (!res.ok) return [];
            return res.json();
        },
        enabled: isExchangeModalOpen && !!session
    });

    const handleExchange = async () => {
        if (!selectedCourseId) {
            toast.error("Please select a course to offer");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/exchanges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestedCourseId: id,
                    offeredCourseId: selectedCourseId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMsg = data.message || data.error || "Failed to send exchange request";
                toast.error(errorMsg);
                if (data.details) console.error("Exchange Error Details:", data.details);
            } else {
                toast.success("Exchange request sent successfully!");
                setIsExchangeModalOpen(false);
                setSelectedCourseId(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    const onExchangeClick = () => {
        if (!session) {
            toast.error("Please login to request an exchange");
            router.push("/login");
            return;
        }
        setIsExchangeModalOpen(true);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error || !course) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Course not found</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black/20">
            <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Info (70% on desktop, but grid-cols-3 handles sizing) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white bg-blue-600`}>
                                    {course.platform}
                                </span>
                                <span className="text-slate-500 text-sm">{course.category}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                                {course.title}
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                                        {course.currentOwner?.photoURL ? (
                                            <img src={course.currentOwner.photoURL} alt={course.currentOwner.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-violet-100 text-violet-600 font-bold">
                                                {course.currentOwner?.name?.charAt(0) || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 font-medium">
                                            {course.currentOwner?.name || "Moon"}
                                            {course.currentOwner?.verified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                                        </div>
                                        <div className="text-xs text-slate-500">Instructor</div>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-slate-200"></div>
                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                    <Star className="h-4 w-4 fill-current" /> {4.9}
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100 relative">
                            <img
                                src={course.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Description */}
                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-bold mb-4">About this course</h3>
                            <div className="whitespace-pre-line text-slate-600 dark:text-slate-300">
                                {course.description}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Action Card (30%) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="p-6 border-slate-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900">
                                <div className="mb-6">
                                    <div className="text-sm text-slate-500 mb-1">Exchange Cost</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                        1 Exchange Credit
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <Clock className="h-4 w-4" /> Instant Access
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <Globe className="h-4 w-4" /> English
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className={`w-full text-lg font-semibold shadow-lg transition-transform active:scale-95 ${!course.isAvailable ? "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200" : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"}`}
                                    disabled={!course.isAvailable}
                                    onClick={onExchangeClick}
                                >
                                    {course.isAvailable ? (
                                        "Request Exchange"
                                    ) : (
                                        <><Lock className="mr-2 h-4 w-4" /> Unavailable</>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-slate-400 mt-4">
                                    30-Day Money-Back Guarantee (in credits)
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <Modal
                isOpen={isExchangeModalOpen}
                onClose={() => setIsExchangeModalOpen(false)}
                title="Request Exchange"
                className="max-w-xl"
            >
                <div className="space-y-6">
                    <p className="text-slate-600">
                        Select a course from your library to offer in exchange for <strong>{course.title}</strong>.
                    </p>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {myCourses && myCourses.length > 0 ? (
                            myCourses.map((myCourse: any) => (
                                <div
                                    key={myCourse._id}
                                    onClick={() => setSelectedCourseId(myCourse._id)}
                                    className={cn(
                                        "flex items-center p-3 rounded-xl border transition-all cursor-pointer group",
                                        selectedCourseId === myCourse._id
                                            ? "border-violet-600 bg-violet-50 dark:bg-violet-900/10"
                                            : "border-slate-200 hover:border-violet-300 dark:border-zinc-800"
                                    )}
                                >
                                    <div className="h-10 w-10 bg-slate-200 rounded-md mr-3 overflow-hidden">
                                        <img src={myCourse.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&q=60"} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">{myCourse.title}</h4>
                                        <span className="text-xs text-slate-500">{myCourse.platform}</span>
                                    </div>
                                    {selectedCourseId === myCourse._id ? (
                                        <Check className="h-5 w-5 text-violet-600" />
                                    ) : (
                                        <div className="text-xs font-semibold text-violet-600 opacity-0 group-hover:opacity-100">
                                            Select
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500 space-y-3">
                                <p>You haven&apos;t added any courses yet.</p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/dashboard/add-course">Add your first course</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                        <Button variant="ghost" onClick={() => setIsExchangeModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleExchange}
                            disabled={!selectedCourseId || isSubmitting}
                            className="bg-gradient-to-r from-violet-600 to-emerald-500 text-white"
                        >
                            {isSubmitting ? "Sending..." : "Send Request"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
