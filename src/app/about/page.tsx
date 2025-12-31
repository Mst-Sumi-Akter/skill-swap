"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Heart, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function AboutPage() {
    const stats = [
        { label: "Active Members", value: "10K+" },
        { label: "Skills Shared", value: "500+" },
        { label: "Hours Learned", value: "50K+" },
        { label: "Success Stories", value: "1.2K" },
    ];

    const values = [
        {
            icon: <Users className="h-6 w-6 text-violet-600" />,
            title: "Community First",
            description: "We believe in the power of people helping people to grow and succeed together."
        },
        {
            icon: <Target className="h-6 w-6 text-emerald-600" />,
            title: "Growth Mindset",
            description: "Learning never stops. We provide the platform for continuous self-improvement."
        },
        {
            icon: <Rocket className="h-6 w-6 text-blue-600" />,
            title: "Zero Cost Learning",
            description: "Knowledge should be accessible. Our currency is time and expertise, not money."
        },
        {
            icon: <Heart className="h-6 w-6 text-rose-600" />,
            title: "Mutual Respect",
            description: "Every skill has value. We foster an environment of appreciation and support."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden bg-white dark:bg-zinc-900">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">
                                Empowering the World to <br />
                                <span className="bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
                                    Learn through Exchange
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                Skill Swap is more than just a platform; it's a global movement to democratize knowledge.
                                Our mission is to connect experts with learners in a mutually beneficial ecosystem.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-slate-50 dark:bg-zinc-950">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 text-center"
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission & Values Section */}
                <section className="py-24 bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">Our Values</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400">
                                Core principles that guide us in building the most trusted skill-sharing community in the world.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {values.map((value, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex gap-6 p-8 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-violet-500/50 transition-colors"
                                >
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-zinc-800">
                                        {value.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{value.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-24 bg-slate-50 dark:bg-zinc-950 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2 relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-violet-500/20 rounded-full blur-[60px]" />
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                                    alt="Team collaboration"
                                    className="rounded-3xl shadow-2xl relative z-10 border-8 border-white dark:border-zinc-900"
                                />
                            </div>
                            <div className="lg:w-1/2">
                                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">The Skill Swap Story</h2>
                                <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                    <p>
                                        It started with a simple problem: expensive education and hidden barriers to learning specific, practical skills.
                                        We saw incredible people with deep expertise unable to share it, and curious minds unable to afford traditional courses.
                                    </p>
                                    <p>
                                        In 2024, we launched Skill Swap with the vision that knowledge should be traded, not bought.
                                        Whether you're a developer wanting to learn design, or a gardener wanting to learn coding,
                                        there's someone on our platform ready to swap.
                                    </p>
                                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                            <span className="font-medium">Trusted by millions</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                            <span className="font-medium">Verified experts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
