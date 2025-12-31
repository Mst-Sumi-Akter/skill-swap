"use client";

import React from "react";
import { ArrowRight, CheckCircle, XCircle, Clock, Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ExchangeRequests() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const userId = session?.user?.id;

    const { data: exchanges, isLoading, error } = useQuery({
        queryKey: ['my-exchanges', userId],
        queryFn: async () => {
            const res = await fetch(`/api/users/${userId}/exchanges`);
            if (!res.ok) throw new Error('Failed to fetch exchanges');
            return res.json();
        },
        enabled: !!userId
    });

    const acceptMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/exchanges/${id}/accept`, { method: 'PATCH' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to accept exchange');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-exchanges'] });
            toast.success("Exchange accepted! Course ownership has been swapped.");
        },
        onError: (err: any) => {
            toast.error(err.message);
        }
    });

    const rejectMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/exchanges/${id}/reject`, { method: 'PATCH' });
            if (!res.ok) throw new Error('Failed to reject exchange');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-exchanges'] });
            toast.success("Exchange rejected.");
        },
        onError: (err: any) => {
            toast.error(err.message);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    <p className="text-slate-500">Loading your requests...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center text-red-500">
                Failed to load exchanges.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Exchange Requests</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your incoming and outgoing knowledge trades.</p>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {exchanges?.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-12 text-center"
                        >
                            <div className="mx-auto w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <Inbox className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">No requests yet</h3>
                            <p className="text-slate-500 text-sm">When you send or receive exchange offers, they will appear here.</p>
                        </motion.div>
                    ) : (
                        exchanges?.map((req: any, i: number) => {
                            const isIncoming = req.toUser?._id === userId;
                            const courseIncoming = isIncoming ? req.offeredCourse : req.requestedCourse;
                            const courseOutgoing = isIncoming ? req.requestedCourse : req.offeredCourse;
                            const partner = isIncoming ? req.fromUser : req.toUser;

                            return (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="overflow-hidden border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 group">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Status Strip */}
                                            <div className={`w-full md:w-2 ${req.status === 'pending' ? 'bg-amber-500' : req.status === 'accepted' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                                            <div className="flex-1 p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Clock className="h-3 w-3" />
                                                        {req.createdAt ? formatDistanceToNow(new Date(req.createdAt), { addSuffix: true }) : 'unknown time'}
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${req.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                            req.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' :
                                                                'bg-red-100 text-red-600'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col lg:flex-row items-center gap-6">
                                                    {/* What you get */}
                                                    <div className="flex-1 w-full flex gap-4 bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                                                        <div className="h-16 w-24 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                                                            <img src={courseIncoming?.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=60"} className="h-full w-full object-cover" alt="" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-tight">YOU RECEIVE</div>
                                                            <h3 className="font-bold text-slate-900 dark:text-slate-50 truncate">{courseIncoming?.title || "Unknown Course"}</h3>
                                                            <p className="text-xs text-slate-500 truncate">{courseIncoming?.platform} • {partner?.name || "Someone"}</p>
                                                        </div>
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="flex-shrink-0 bg-slate-100 dark:bg-zinc-800 p-2 rounded-full text-slate-400">
                                                        <ArrowRight className="h-6 w-6" />
                                                    </div>

                                                    {/* What you give */}
                                                    <div className="flex-1 w-full flex gap-4 bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                                                        <div className="h-16 w-24 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                                                            <img src={courseOutgoing?.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=60"} className="h-full w-full object-cover" alt="" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-[10px] font-bold text-violet-600 dark:text-violet-400 mb-1 uppercase tracking-tight">YOU OFFER</div>
                                                            <h3 className="font-bold text-slate-900 dark:text-slate-50 truncate">{courseOutgoing?.title || "Unknown Course"}</h3>
                                                            <p className="text-xs text-slate-500 truncate">{courseOutgoing?.platform} • Me</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions - Only show if pending and incoming */}
                                            {req.status === 'pending' && isIncoming && (
                                                <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800 p-6 flex md:flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-zinc-800/30">
                                                    <div className="group/accept relative">
                                                        <Button
                                                            size="icon"
                                                            className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm transition-all duration-300"
                                                            disabled={acceptMutation.isPending || rejectMutation.isPending}
                                                            onClick={() => acceptMutation.mutate(req._id)}
                                                        >
                                                            {acceptMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle className="h-6 w-6" />}
                                                        </Button>
                                                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/accept:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Accept Trade & Swap
                                                        </span>
                                                    </div>
                                                    <div className="group/reject relative">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-12 w-12 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-sm transition-all duration-300"
                                                            disabled={acceptMutation.isPending || rejectMutation.isPending}
                                                            onClick={() => rejectMutation.mutate(req._id)}
                                                        >
                                                            {rejectMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <XCircle className="h-6 w-6" />}
                                                        </Button>
                                                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/reject:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Reject Offer
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Status Label for non-pending or outgoing */}
                                            {(req.status !== 'pending' || !isIncoming) && (
                                                <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800 p-6 flex flex-col items-center justify-center min-w-[120px] bg-slate-50/20 dark:bg-zinc-800/10">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isIncoming ? 'Received' : 'Sent'}</div>
                                                    <div className={`text-sm font-bold ${req.status === 'accepted' ? 'text-emerald-500' :
                                                            req.status === 'rejected' ? 'text-red-500' :
                                                                'text-amber-500'
                                                        }`}>
                                                        {req.status === 'pending' ? 'Pending Partner' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
