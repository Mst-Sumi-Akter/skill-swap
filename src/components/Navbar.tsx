"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Layout, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Courses", href: "/all-courses" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock toggle for mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Logged out successfully");
  };

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  return (
    <nav className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300",
      scrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
              Skill Swap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors hover:text-violet-600",
                    isActive ? "text-violet-600 bg-violet-50 dark:bg-violet-900/10 rounded-full" : "text-slate-600 dark:text-slate-300"
                  )}
                >
                  {link.name}
                  <span className="absolute inset-x-0 -bottom-px h-px bg-slate-200 dark:bg-zinc-800" />
                  <span className="absolute left-1/2 bottom-0 h-0.5 w-0 -translate-x-1/2 bg-violet-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </div>

          {/* User Actions / Mobile Toggle */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 hover:shadow-md transition-shadow"
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center">
                    {user?.image ? (
                      <img src={user.image} alt={user?.name || "User"} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-lg z-50 origin-top-right"
                    >
                      <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-card-foreground hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsUserMenuOpen(false)}>
                        <Layout className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md transition-all hover:scale-105">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2" />
              {!isAuthenticated && (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-violet-600 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Log in
                  </Link>
                  <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg text-center shadow-md" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
