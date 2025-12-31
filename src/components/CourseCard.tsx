"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { BadgeCheck } from "lucide-react";

import { Button } from "./ui/button";
import Link from "next/link";

interface CourseCardProps {
    id: string; // Add ID for linking
    title: string;
    description: string;
    image: string;
    platform: string;
    owner: {
        name: string;
        image?: string;
        verified?: boolean;
    };
}

const platformColors: Record<string, string> = {
    Udemy: "bg-red-500",
    Coursera: "bg-blue-500",
    YouTube: "bg-red-600",
    Other: "bg-slate-500",
};

export function CourseCard({ id, title, description, image, platform, owner }: CourseCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="h-full"
        >
            <Card spotlight className="group h-full flex flex-col cursor-pointer overflow-hidden border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                {/* Image Section */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Platform Badge */}
                    <div className="absolute left-4 top-4 z-20">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm ${platformColors[platform] || platformColors.Other}`}>
                            {platform}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 line-clamp-1 text-lg font-bold text-slate-900 dark:text-slate-50 group-hover:text-violet-600 transition-colors">
                        {title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-400 flex-1">
                        {description}
                    </p>

                    {/* Owner & Action */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white dark:ring-zinc-800">
                                {owner.image ? (
                                    <img src={owner.image} alt={owner.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-violet-100 text-violet-600 font-bold text-xs">
                                        {owner.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1 max-w-[80px]">
                                    {owner.name}
                                </span>
                            </div>
                        </div>

                        <Button size="sm" variant="gradient" asChild className="h-8 text-xs px-3">
                            <Link href={`/course-details/${id}`}>
                                View Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
