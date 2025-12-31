"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactInfo = [
        {
            icon: <Mail className="h-6 w-6 text-violet-600" />,
            title: "Email Us",
            details: "hello@skillswap.com",
            description: "We'll respond within 24 hours."
        },
        {
            icon: <Phone className="h-6 w-6 text-emerald-600" />,
            title: "Call Us",
            details: "+1 (555) 000-0000",
            description: "Mon-Fri from 9am to 6pm."
        },
        {
            icon: <MapPin className="h-6 w-6 text-blue-600" />,
            title: "Visit Us",
            details: "123 Innovation Way",
            description: "San Francisco, CA 94103"
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Message sent successfully!");
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
            <main className="flex-1">
                {/* Header Section */}
                <section className="py-20 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
                                Let's Get in <span className="bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">Touch</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Have questions about Skill Swap? We're here to help. Reach out to our team
                                and we'll get back to you as soon as possible.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800"
                                >
                                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                                        <MessageSquare className="h-6 w-6 text-violet-600" />
                                        Send us a Message
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="Full Name" placeholder="John Doe" required />
                                            <Input label="Email Address" type="email" placeholder="john@example.com" required />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="Subject" placeholder="General Inquiry" required />
                                            <div className="relative">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                                    Department
                                                </label>
                                                <select className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-600">
                                                    <option>Support</option>
                                                    <option>Partnerships</option>
                                                    <option>Careers</option>
                                                    <option>Feedback</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                                Your Message
                                            </label>
                                            <textarea
                                                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-violet-600 min-h-[150px] resize-none"
                                                placeholder="Tell us how we can help..."
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-violet-600 to-emerald-500 hover:scale-[1.02] transition-transform"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Send Message <Send className="h-5 w-5" />
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </motion.div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-8">
                                {contactInfo.map((info, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-start gap-5 hover:border-violet-500/50 transition-colors"
                                    >
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-950 flex items-center justify-center border border-slate-100 dark:border-zinc-800">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white capitalize">{info.title}</h3>
                                            <p className="text-violet-600 dark:text-violet-400 font-medium mb-1">{info.details}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{info.description}</p>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Additional Info Card */}
                                <div className="p-8 rounded-3xl bg-violet-600 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <Globe className="h-32 w-32" />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold mb-4">Support Hours</h3>
                                        <div className="space-y-3 opacity-90">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Weekdays</span>
                                                <span>9am - 8pm</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Weekends</span>
                                                <span>10am - 4pm</span>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <p className="text-sm font-medium mb-4">We're expanding our global support soon!</p>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3, 4].map(n => (
                                                    <div key={n} className="w-8 h-8 rounded-full border-2 border-violet-600 bg-slate-200 overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/100?img=${n + 20}`} alt="Support Team" />
                                                    </div>
                                                ))}
                                                <div className="w-8 h-8 rounded-full border-2 border-violet-600 bg-violet-500 flex items-center justify-center text-[10px] font-bold">
                                                    +5
                                                </div>
                                            </div>
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
