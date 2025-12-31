"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-background py-16 md:py-24">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 top-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container relative z-10 flex flex-col items-center gap-8 px-4 md:px-6 text-center">
        {/* Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-slate-900 dark:text-slate-50">
              Trade Knowledge,
            </span>
            <span className="bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
              Not Money.
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-lg text-slate-600 dark:text-slate-400 md:text-xl"
          >
            Exchange skills, mentorship, and resources with a community of verifiable experts.
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 opacity-30 blur transition duration-1000 group-hover:opacity-60 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-xl p-1 shadow-lg">
              <Search className="ml-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="w-full bg-transparent p-3 text-sm outline-none placeholder:text-slate-400 dark:text-slate-50"
              />
              <Button className="rounded-lg">
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Preview or CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 mt-8"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">500+</span>
            <span className="text-sm text-slate-500">Active Skills</span>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">1.2k</span>
            <span className="text-sm text-slate-500">Exchanges</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
