"use client";

import React, { Suspense, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Bell, Search, User as UserIcon, Menu } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const user = session?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">
            <Suspense fallback={<div className="w-64 bg-white dark:bg-zinc-900 hidden lg:block border-r border-slate-200 dark:border-zinc-800" />}>
                <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </Suspense>

            <div className="lg:ml-64 flex min-h-screen flex-col">
                {/* Top Bar */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:bg-zinc-900/80 dark:border-zinc-800 md:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg font-semibold lg:hidden">Skill Swap</h2>
                        <div className="hidden md:block relative w-96">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative group p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
                            <Bell className="h-5 w-5 text-slate-500 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
                        </button>
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-zinc-800">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{user?.name || "User"}</div>
                                <div className="text-xs text-slate-500 capitalize">{
                                    // @ts-expect-error role exists
                                    user?.role || "Member"
                                }</div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-violet-600 border border-slate-200">
                                {user?.image ? (
                                    <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                                ) : (
                                    <UserIcon className="h-4 w-4" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
