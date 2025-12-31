import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-violet-600">Swap</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              The premier platform for exchanging skills and knowledge. Learn, teach, and grow together without spending a dime.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Linkedin className="h-4 w-4" />} />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><FooterLink href="/all-courses">Browse Courses</FooterLink></li>
              <li><FooterLink href="/how-it-works">How it Works</FooterLink></li>
              <li><FooterLink href="/pricing">Pricing</FooterLink></li>
              <li><FooterLink href="/mentors">Find Mentors</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/careers">Careers</FooterLink></li>
              <li><FooterLink href="/blog">Blog</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Stay Updated</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Subscribe to our newsletter for the latest updates and learning tips.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 rounded-lg border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
              <button className="rounded-lg bg-violet-600 px-3 py-2 text-white hover:bg-violet-700 transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} SkillSwap Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-violet-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-500 transition-colors">
      {children}
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
      {icon}
    </Link>
  );
}