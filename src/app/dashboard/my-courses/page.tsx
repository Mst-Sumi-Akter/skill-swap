"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Plus, Pencil, Trash2, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CourseCard } from "@/components/CourseCard";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function MyCourses() {
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");

    const { data: courses = [], isLoading, error } = useQuery({
        queryKey: ['my-courses'],
        queryFn: async () => {
            const res = await fetch('/api/courses?mode=my');
            if (!res.ok) throw new Error('Failed to fetch courses');
            return res.json();
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading your courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
                <p>Error loading courses. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">My Courses</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage the courses you are offering for exchange.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white dark:bg-zinc-900 rounded-lg p-1 border border-slate-200 dark:border-zinc-800">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn("p-2 rounded-md transition-colors", viewMode === "grid" ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-50" : "text-slate-400 hover:text-slate-600")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={cn("p-2 rounded-md transition-colors", viewMode === "table" ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-slate-50" : "text-slate-400 hover:text-slate-600")}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-violet-600 to-emerald-500 hover:from-violet-700 hover:to-emerald-600">
                        <Link href="/dashboard/add-course">
                            <Plus className="mr-2 h-4 w-4" /> Add Course
                        </Link>
                    </Button>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                    <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">No courses yet</h3>
                    <p className="text-slate-500 mb-6">Start sharing your knowledge by adding your first course.</p>
                    <Button asChild>
                        <Link href="/dashboard/add-course">Add Course Now</Link>
                    </Button>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course: any) => (
                        <div key={course._id} className="relative group">
                            <CourseCard
                                id={course._id}
                                title={course.title}
                                description={course.description}
                                image={course.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"}
                                platform={course.platform}
                                owner={{
                                    name: course.currentOwner?.name || "You",
                                    image: course.currentOwner?.photoURL
                                }}
                            />
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                                {course.status}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Card className="overflow-hidden border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Platform</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course: any) => (
                                    <tr key={course._id} className="border-b border-slate-100 dark:border-zinc-800 last:border-0 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&q=60"} className="h-10 w-16 rounded object-cover bg-slate-200" alt="" />
                                                <div className="font-medium text-slate-900 dark:text-slate-50">{course.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                                                {course.platform}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                course.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                                                    course.status === "rejected" ? "bg-red-100 text-red-700" :
                                                        "bg-amber-100 text-amber-700"
                                            )}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
