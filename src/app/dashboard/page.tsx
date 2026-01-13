"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowLeftRight, TrendingUp, Clock, User as UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

async function fetchStats() {
    const res = await fetch("/api/user/stats");
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
}

export default function DashboardOverview() {
    const { data: session, status: authStatus } = useSession();

    const { data, isLoading, error } = useQuery({
        queryKey: ["userStats"],
        queryFn: fetchStats,
        enabled: authStatus === "authenticated",
    });

    // @ts-expect-error role exists
    const isAdmin = session?.user?.role === "admin";
    const router = useRouter();

    useEffect(() => {
        if (isAdmin) {
            router.push("/dashboard/admin");
        }
    }, [isAdmin, router]);

    if (isAdmin) return <LoadingSpinner />;

    if (authStatus === "loading" || isLoading) return <LoadingSpinner />;
    if (error) return <div className="p-8 text-center text-red-500">Failed to load dashboard data. Please try again later.</div>;

    const statsData = data?.stats || {
        ownedCourses: 0,
        pendingRequests: 0,
        totalExchanges: 0,
        exchangeRate: "0%"
    };

    const recentActivity = data?.recentActivity || [];

    const stats = [
        { title: "Owned Courses", value: statsData.ownedCourses.toString(), icon: BookOpen, color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-900/20" },
        { title: "Incoming Requests", value: statsData.pendingRequests.toString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
        { title: "Accepted Trades", value: statsData.totalExchanges.toString(), icon: ArrowLeftRight, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
        { title: "Exchange Rate", value: statsData.exchangeRate, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" },
    ];

    return (
        <div className="space-y-8 p-4 md:p-0">
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
                >
                    Hello, {session?.user?.name?.split(" ")[0] || "Swapper"} 👋
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 dark:text-slate-400 mt-1"
                >
                    {isAdmin
                        ? "You have administrative access to manage the platform."
                        : "Welcome back! Here's a real-time look at your skill sharing activity."
                    }
                </motion.p>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                        >
                            <Card spotlight className="p-6 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="col-span-1 lg:col-span-4"
                >
                    <Card className="h-full p-6 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">Performance Analytics</h3>
                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-violet-100 text-violet-600 dark:bg-violet-900/30">Auto Update</span>
                        </div>
                        <div className="h-[300px] w-full bg-slate-50/50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-dashed border-slate-300 dark:border-zinc-700">
                            <div className="text-center">
                                <TrendingUp className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium italic">Detailed analytics will appear here as you trade more skills.</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="col-span-1 lg:col-span-3"
                >
                    <Card className="h-full p-6 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
                        <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity: any, i: number) => {
                                    const isIncoming = activity.toUser?._id === session?.user?.id;
                                    const otherUser = isIncoming ? activity.fromUser : activity.toUser;
                                    const statusColors: any = {
                                        pending: "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
                                        accepted: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
                                        rejected: "bg-red-100 text-red-600 dark:bg-red-900/30"
                                    };

                                    return (
                                        <div key={activity._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-500/50 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white dark:ring-zinc-800">
                                                    {otherUser?.photoURL ? (
                                                        <img src={otherUser.photoURL} alt={otherUser.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center bg-violet-100 text-violet-600">
                                                            <UserIcon className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-w-[150px]">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-50 line-clamp-1">{otherUser?.name || "Unknown User"}</p>
                                                    <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 italic">
                                                        {isIncoming ? "Requested your" : "Wants to swap for"} "{activity.requestedCourse?.title || "Course"}"
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${statusColors[activity.status] || "bg-slate-100 text-slate-600"}`}>
                                                {activity.status.toUpperCase()}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-10">
                                    <div className="h-12 w-12 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ArrowLeftRight className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 text-sm">No recent activity found.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
