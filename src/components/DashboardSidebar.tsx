"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams as useBaseSearchParams } from "next/navigation";
import { LayoutDashboard, BookOpen, PlusCircle, ArrowLeftRight, Settings, LogOut, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const searchParams = useBaseSearchParams();
    const { data: session } = useSession();
    // @ts-expect-error role exists
    const isAdmin = session?.user?.role === "admin";

    const sidebarLinks = [
        ...(isAdmin ? [
            { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
            { name: "Approved Course", href: "/dashboard/admin?tab=approved-course", icon: BookOpen },
            { name: "Add Course Request", href: "/dashboard/admin?tab=add-course-request", icon: PlusCircle },
            { name: "Users", href: "/dashboard/admin?tab=users", icon: Users },
        ] : [
            { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
            { name: "My Courses", href: "/dashboard/my-courses", icon: BookOpen },
            { name: "Add Course", href: "/dashboard/add-course", icon: PlusCircle },
            { name: "Requests", href: "/dashboard/my-requests", icon: ArrowLeftRight },
        ]),
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const content = (
        <>
            <div className="flex h-16 items-center px-6 border-b border-slate-100 dark:border-zinc-800 justify-between">
                <Link href="/" className="flex items-center gap-2">
                    {/* <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
                        Skill Swap
                    </span> */}
                </Link>
                {onClose && (
                    <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                <div className="mb-4 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Menu
                </div>

                {sidebarLinks.map((link) => {
                    const linkBase = link.href.split('?')[0];
                    const linkTab = link.href.includes('tab=') ? link.href.split('tab=')[1] : null;
                    const currentTab = searchParams.get('tab');

                    const isActive = pathname === linkBase && (linkTab ? currentTab === linkTab : !currentTab);
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-slate-50 dark:hover:bg-zinc-800",
                                isActive
                                    ? "bg-violet-50 text-violet-600 dark:bg-violet-900/10 dark:text-violet-400"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "text-violet-600 dark:text-violet-400" : "text-slate-400 group-hover:text-slate-600")} />
                            {link.name}

                            {isActive && (
                                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-violet-600"></div>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 lg:flex">
                {content}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-transform duration-300 transform lg:hidden",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {content}
            </aside>
        </>
    );
}
