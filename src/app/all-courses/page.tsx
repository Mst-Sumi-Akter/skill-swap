"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/CourseCard";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";

export default function BrowseCourses() {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch Courses
    const { data: courses = [], isLoading, error } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const res = await fetch('/api/courses');
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        }
    });

    const categories = ["Development", "Design", "Business", "Marketing", "SaaS"];
    const platforms = ["Udemy", "Coursera", "YouTube", "Skillshare", "Other"];

    const toggleFilter = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const filteredCourses = courses.filter((course: any) => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);
        const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(course.platform);

        return matchesSearch && matchesCategory && matchesPlatform;
    });

    if (error) {
        return <div className="text-center py-20 text-red-500">Failed to load courses. Please try again later.</div>
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`
                  fixed inset-y-0 left-0 z-50 w-64 bg-background p-6 shadow-xl transition-transform duration-300 transform lg:sticky lg:top-20 lg:block lg:w-64 lg:p-0 lg:shadow-none lg:translate-x-0 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:z-30
                  ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}
              `}>
                        <div className="flex items-center justify-between mb-6 lg:hidden">
                            <h2 className="text-lg font-bold">Filters</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                                <Filter className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="space-y-8">
                            {/* Search (Mobile/Sidebar) */}
                            <div className="lg:hidden mb-6">
                                <Input
                                    label="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-50">Category</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`
                                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                                        ${selectedCategories.includes(cat) ? "bg-violet-600 border-violet-600 text-white" : "border-slate-300 dark:border-zinc-700 bg-transparent"}
                                      `}>
                                                {selectedCategories.includes(cat) && <Check className="h-3 w-3" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-violet-600 transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Platform */}
                            <div>
                                <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-50">Platform</h3>
                                <div className="space-y-2">
                                    {platforms.map(plat => (
                                        <label key={plat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`
                                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                                        ${selectedPlatforms.includes(plat) ? "bg-violet-600 border-violet-600 text-white" : "border-slate-300 dark:border-zinc-700 bg-transparent"}
                                      `}>
                                                {selectedPlatforms.includes(plat) && <Check className="h-3 w-3" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedPlatforms.includes(plat)}
                                                onChange={() => toggleFilter(plat, selectedPlatforms, setSelectedPlatforms)}
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-violet-600 transition-colors">{plat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Overlay */}
                    {isMobileFiltersOpen && (
                        <div
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsMobileFiltersOpen(false)}
                        />
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                                {filteredCourses.length} Courses Available
                            </h1>

                            <div className="flex items-center gap-3">
                                <div className="relative hidden lg:block w-80">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        label="Search by title or description..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" className="lg:hidden" onClick={() => setIsMobileFiltersOpen(true)}>
                                    <Filter className="mr-2 h-4 w-4" /> Filters
                                </Button>

                                {/* Sort Mock */}
                                <div className="relative group">
                                    <Button variant="ghost" className="gap-2">
                                        Sort by: Newest <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Course Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="h-80 rounded-xl bg-slate-200 dark:bg-zinc-800 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            filteredCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCourses.map((course: any) => (
                                        <CourseCard
                                            key={course._id}
                                            id={course._id}
                                            {...course}
                                            // Map backend fields to frontend props if needed
                                            image={course.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"}
                                            owner={{
                                                name: course.currentOwner?.name || "Moon",
                                                verified: false, // verification not in DB yet
                                                image: course.currentOwner?.photoURL
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">No courses found</h3>
                                    <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
