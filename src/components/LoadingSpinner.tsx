"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
            <div className="relative flex flex-col items-center">
                {/* Outer glowing rings */}
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="h-24 w-24 rounded-full border-t-2 border-l-2 border-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                />

                <motion.div
                    animate={{
                        rotate: -360,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute inset-0 h-24 w-24 rounded-full border-b-2 border-r-2 border-emerald-500 opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                />

                {/* Center icon */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        delay: 0.2,
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="bg-gradient-to-tr from-violet-600 to-emerald-500 p-3 rounded-2xl shadow-xl">
                        <Zap className="h-6 w-6 text-white fill-white" />
                    </div>
                </motion.div>

                {/* Loading text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-sm font-bold tracking-widest text-slate-500 uppercase"
                >
                    Skill<span className="text-violet-600">Swap</span> is loading...
                </motion.p>
            </div>
        </div>
    );
}
