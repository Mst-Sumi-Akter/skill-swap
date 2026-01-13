"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    ArrowLeftRight,
    Activity,
    CheckCircle,
    XCircle,
    Clock,
    Shield,
    User as UserIcon,
    Search,
    PlusCircle,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Tab = "overview" | "add-course-request" | "approved-course" | "users";

function AdminDashboardContent() {
    const { data: session, status: sessionStatus } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [userSearch, setUserSearch] = useState("");
    const queryClient = useQueryClient();

    // @ts-expect-error role is generic
    const isAdmin = session?.user?.role === "admin";

    // Initialize/Sync tab from URL
    useEffect(() => {
        const tab = searchParams.get("tab") as Tab;
        if (tab && (["overview", "add-course-request", "approved-course", "users"] as Tab[]).includes(tab)) {
            setActiveTab(tab);
        } else if (!tab) {
            setActiveTab("overview");
        }
    }, [searchParams]);

    // Separate debug log
    useEffect(() => {
        if (sessionStatus === "authenticated") {
            console.log("Admin Dashboard Session:", {
                id: session?.user?.id,
                // @ts-expect-error role is generic
                role: session?.user?.role,
                isAdmin
            });
        }
    }, [session, sessionStatus, isAdmin]);

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        router.push(`/dashboard/admin?tab=${tab}`, { scroll: false });
    };

    const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await fetch('/api/stats');
            if (!res.ok) throw new Error("Failed to fetch stats");
            return res.json();
        }
    });

    const { data: courses, isLoading: coursesLoading, isError: coursesError } = useQuery({
        queryKey: ['admin-courses'],
        queryFn: async () => {
            const res = await fetch('/api/admin/courses');
            if (!res.ok) throw new Error("Failed to fetch courses");
            return res.json();
        }
    });

    const { data: users, isLoading: usersLoading, isError: usersError, error: queryError, refetch: refetchUsers } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            console.count("Fetching users from MongoDB API");
            const res = await fetch('/api/admin/users');
            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: "Failed to parse error response" }));
                throw new Error(err.error || "Failed to fetch users");
            }
            return res.json();
        }
    });

    const updateCourseStatus = useMutation({
        mutationFn: async ({ courseId, status }: { courseId: string, status: string }) => {
            const res = await fetch('/api/admin/courses', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId, status }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
            toast.success("Course status updated");
        },
        onError: () => toast.error("Error updating status")
    });

    const updateUserRole = useMutation({
        mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role }),
            });
            if (!res.ok) throw new Error("Failed to update role");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success("User role updated");
        },
        onError: () => toast.error("Error updating role")
    });

    if (sessionStatus === "loading") {
        return <div className="flex items-center justify-center min-h-[400px] text-slate-500">Loading Session...</div>;
    }

    // if (!isAdmin) {
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
    //             <Shield className="h-12 w-12 text-red-500" />
    //             <h3 className="text-xl font-bold">Access Denied</h3>
    //             <p className="text-slate-500 max-w-md">You do not have administrative privileges to view this dashboard.</p>
    //             <Button onClick={() => window.location.href = "/dashboard"}>Return to Shared Dashboard</Button>
    //         </div>
    //     );
    // }

    const statsList = [
        { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100", loading: statsLoading, error: statsError, onClick: () => handleTabChange("users") },
        { label: "Total Courses", value: stats?.totalCourses, icon: BookOpen, color: "text-violet-600", bg: "bg-violet-100", loading: statsLoading, error: statsError, onClick: () => handleTabChange("approved-course") },
        { label: "Total Exchanges", value: stats?.totalExchanges, icon: ArrowLeftRight, color: "text-emerald-600", bg: "bg-emerald-100", loading: statsLoading, error: statsError },
        { label: "Pending Requests", value: stats?.pendingCourses, icon: Clock, color: "text-amber-600", bg: "bg-amber-100", loading: statsLoading, error: statsError, onClick: () => handleTabChange("add-course-request") },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Admin Center</h1>
                    <p className="text-slate-500 dark:text-slate-400">Platform-wide oversight and management.</p>
                </div>
                <div className="flex p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl w-fit overflow-x-auto no-scrollbar border border-slate-200 dark:border-zinc-700">
                    {(["overview", "add-course-request", "approved-course", "users"] as Tab[]).map((tab) => {
                        const count = tab === "add-course-request"
                            ? (Array.isArray(courses) ? courses.filter((c: any) => c.status === "pending").length : 0)
                            : tab === "approved-course"
                                ? (Array.isArray(courses) ? courses.filter((c: any) => c.status === "approved").length : 0)
                                : tab === "users"
                                    ? (Array.isArray(users) ? users.length : 0)
                                    : null;

                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap flex items-center gap-2",
                                    activeTab === tab
                                        ? "bg-white dark:bg-zinc-700 text-violet-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                {tab.replace(/-/g, " ")}
                                {count !== null && (
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded-full text-[10px]",
                                        activeTab === tab ? "bg-violet-100 text-violet-600" : "bg-slate-200 text-slate-500"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                                Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Here's what's happening on the platform today.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {statsList.map((stat, i) => (
                                <StatCard key={i} {...stat} />
                            ))}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="p-8 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <h3 className="text-xl font-bold mb-6">Course Submissions</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Approved</span>
                                        <span className="font-bold text-emerald-600">{stats?.totalCourses || 0}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                            style={{ width: stats?.totalCourses ? '100%' : '0%' }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-sm pt-2">
                                        <span className="text-slate-500">Pending Review</span>
                                        <span className="font-bold text-amber-500">{stats?.pendingCourses || 0}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                                            style={{ width: stats?.totalCourses ? `${((stats.pendingCourses || 0) / (stats.totalCourses + stats.pendingCourses || 1) * 100)}%` : '0%' }}
                                        />
                                    </div>
                                    <Button variant="outline" className="w-full mt-4" onClick={() => handleTabChange("add-course-request")}>
                                        Review Requests
                                    </Button>
                                </div>
                            </Card>

                            <Card className="p-8 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <h3 className="text-xl font-bold mb-6">Quick Links</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleTabChange("users")}
                                        className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-left group"
                                    >
                                        <Users className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                                        <div className="text-sm font-bold">Manage Users</div>
                                        <div className="text-[10px] text-slate-500">Roles & Permissions</div>
                                    </button>
                                    <button
                                        onClick={() => handleTabChange("approved-course")}
                                        className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all text-left group"
                                    >
                                        <BookOpen className="h-6 w-6 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
                                        <div className="text-sm font-bold">Content Library</div>
                                        <div className="text-[10px] text-slate-500">All Approved Courses</div>
                                    </button>
                                </div>
                            </Card>

                            <Card className="p-8 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <h3 className="text-xl font-bold mb-6">Recent Requests</h3>
                                <div className="space-y-3">
                                    {coursesLoading ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-12 bg-slate-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                                            ))}
                                        </div>
                                    ) : coursesError ? (
                                        <div className="text-red-500 text-sm">Failed to load recent requests</div>
                                    ) : (
                                        (Array.isArray(courses) ? courses.filter((c: any) => c.status === "pending").slice(0, 3) : []).map((course: any) => (
                                            <div key={course._id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                                                    <BookOpen className="h-4 w-4 text-violet-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">{course.title}</div>
                                                    <div className="text-xs text-slate-500">{course.platform}</div>
                                                </div>
                                                <div className="text-xs text-amber-600 font-medium">Pending</div>
                                            </div>
                                        ))
                                    )}
                                    <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => handleTabChange("add-course-request")}>
                                        View All Requests
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        <div className="mt-8">
                            <CourseList
                                title="Approved Courses"
                                courses={courses}
                                filterStatus="approved"
                                isLoading={coursesLoading}
                                isError={coursesError}
                                onUpdate={updateCourseStatus}
                                showActions={false}
                            />
                        </div>
                    </motion.div>
                )}

                {activeTab === "add-course-request" && (
                    <motion.div
                        key="add-course-request"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <CourseList
                            title="Course Submission Requests"
                            courses={courses}
                            filterStatus="pending"
                            isLoading={coursesLoading}
                            isError={coursesError}
                            onUpdate={updateCourseStatus}
                            showActions={true}
                        />
                    </motion.div>
                )}

                {activeTab === "approved-course" && (
                    <motion.div
                        key="approved-course"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <CourseList
                            title="All Approved Courses"
                            courses={courses}
                            filterStatus="approved"
                            isLoading={coursesLoading}
                            isError={coursesError}
                            onUpdate={updateCourseStatus}
                            showActions={false}
                        />
                    </motion.div>
                )}

                {activeTab === "users" && (
                    <motion.div
                        key="users"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Card className="overflow-hidden border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="font-bold text-lg">Registered Users</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Live MongoDB Data</span>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 gap-2"
                                        onClick={() => refetchUsers()}
                                        disabled={usersLoading}
                                    >
                                        <Activity className={cn("h-4 w-4", usersLoading && "animate-spin")} />
                                        Refresh
                                    </Button>
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search name or email..."
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-zinc-800/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                        {usersLoading ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
                                                    <span>Loading platform users...</span>
                                                </div>
                                            </td></tr>
                                        ) : usersError ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-red-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <XCircle className="h-8 w-8" />
                                                    <span className="font-semibold">Error Loading Users</span>
                                                    <p className="text-sm opacity-80">{(queryError as any)?.message}</p>
                                                    <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-users"] })}>Retry</Button>
                                                </div>
                                            </td></tr>
                                        ) : !Array.isArray(users) || users.length === 0 ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="h-8 w-8 opacity-20" />
                                                    <p>No registered users found on the platform.</p>
                                                </div>
                                            </td></tr>
                                        ) : users.filter((u: any) =>
                                            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                                            u.email?.toLowerCase().includes(userSearch.toLowerCase())
                                        ).length === 0 ? (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                <p>No users match "<strong>{userSearch}</strong>"</p>
                                            </td></tr>
                                        ) : users.filter((u: any) =>
                                            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                                            u.email?.toLowerCase().includes(userSearch.toLowerCase())
                                        ).map((user: any) => (
                                            <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
                                                            {user.photoURL ? (
                                                                <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <UserIcon className="h-4 w-4 text-violet-600" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                        user.role === "admin"
                                                            ? "bg-amber-100 text-amber-700 border-amber-200"
                                                            : "bg-slate-100 text-slate-600 border-slate-200"
                                                    )}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-slate-600 hover:text-violet-600"
                                                        onClick={() => updateUserRole.mutate({ userId: user._id, role: user.role === "admin" ? "user" : "admin" })}
                                                    >
                                                        <Shield className="h-4 w-4 mr-2" />
                                                        {user.role === "admin" ? "Revoke" : "Make Admin"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-slate-500">Loading Dashboard...</div>}>
            <AdminDashboardContent />
        </Suspense>
    );
}

function CourseList({ title, courses, isLoading, isError, onUpdate, showActions, filterStatus }: any) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const filtered = Array.isArray(courses) ? courses.filter((c: any) => {
        const matchesStatus = filterStatus ? c.status === filterStatus : true;
        const matchesSearch =
            c.title?.toLowerCase().includes(search.toLowerCase()) ||
            c.category?.toLowerCase().includes(search.toLowerCase()) ||
            c.currentOwner?.name?.toLowerCase().includes(search.toLowerCase()) ||
            (!c.currentOwner?.name && "moon".includes(search.toLowerCase()));
        return matchesStatus && matchesSearch;
    }) : [];

    return (
        <Card className="overflow-hidden border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-200"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course Info</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            {showActions && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {isLoading ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                                    <span>Syncing with database...</span>
                                </div>
                            </td></tr>
                        ) : isError ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-red-500">
                                <div className="flex flex-col items-center gap-2">
                                    <XCircle className="h-8 w-8" />
                                    <span className="font-semibold">Failed to Load Courses</span>
                                    <p className="text-sm opacity-80">Check your internet connection and try again.</p>
                                </div>
                            </td></tr>
                        ) : courses.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No courses available.</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No courses match your search or status.</td></tr>
                        ) : (
                            filtered.map((course: any) => (
                                <React.Fragment key={course._id}>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer" onClick={() => setExpandedId(expandedId === course._id ? null : course._id)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                                    <img src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&q=60"} className="h-full w-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-slate-50">{course.title}</div>
                                                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                        <span>Click to view details</span>
                                                        <Clock className="h-2 w-2" />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-slate-100 overflow-hidden">
                                                    {course.currentOwner?.photoURL && <img src={course.currentOwner.photoURL} className="h-full w-full object-cover" />}
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{course.currentOwner?.name || "Moon"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400">{course.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={course.status} />
                                        </td>
                                        {showActions && (
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 px-3 text-emerald-600 border-emerald-200 hover:bg-emerald-50 bg-emerald-50/30"
                                                        disabled={onUpdate.isPending}
                                                        onClick={() => onUpdate.mutate({ courseId: course._id, status: "approved" })}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 px-3 text-red-600 hover:bg-red-50"
                                                        disabled={onUpdate.isPending}
                                                        onClick={() => onUpdate.mutate({ courseId: course._id, status: "rejected" })}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                    {expandedId === course._id && (
                                        <tr className="bg-slate-50/50 dark:bg-zinc-800/20">
                                            <td colSpan={5} className="px-6 py-4">
                                                <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-zinc-800">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-2">Description</h4>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{course.description}</p>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-2">Platform</h4>
                                                                <span className="text-sm text-slate-600 dark:text-slate-400">{course.platform}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-2">Submitted On</h4>
                                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {course.createdAt ? new Date(course.createdAt).toLocaleString() : 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function StatCard({ label, value, icon: Icon, color, bg, loading, error, onClick }: any) {
    return (
        <Card spotlight className={cn("p-6 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm relative overflow-hidden group", onClick && "cursor-pointer hover:shadow-md transition-shadow")} onClick={onClick}>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
                    {loading ? (
                        <div className="h-8 w-16 bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-lg mt-1" />
                    ) : error ? (
                        <div className="text-red-500 text-xs font-medium mt-1">Error</div>
                    ) : (
                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">{value || 0}</h3>
                    )}
                </div>
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", bg)}>
                    <Icon className={cn("h-6 w-6", color)} />
                </div>
            </div>
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "approved":
            return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><CheckCircle className="h-3 w-3" /> Approved</span>;
        case "rejected":
            return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full"><XCircle className="h-3 w-3" /> Rejected</span>;
        default:
            return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><Clock className="h-3 w-3" /> Pending</span>;
    }
}
