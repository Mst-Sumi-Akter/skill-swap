import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Search, Users, Zap, ShieldCheck, Lock as LockIcon, Trophy, Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseCard } from "@/components/CourseCard";

async function getRecentCourses() {
  // If we are in the same environment (server-side), we might not be able to fetch localhost easily without absolute URL.
  // Using absolute URL for now, assuming default nextjs port. 
  // Ideally use an internal service call if possible, but for Wiring, standard fetch is expected.
  try {
    const res = await fetch('http://localhost:3000/api/courses', { cache: 'no-store' }); // Disable cache for dev
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}

export default async function Home() {
  const courses = await getRecentCourses();
  // Take top 3 for popular as requested
  const popularCourses = courses.slice(0, 3);

  return (
    <>
      <main className="flex-1">
        <Hero />

        {/* Popular Courses Section */}
        <section className="container mx-auto px-4 py-24 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Popular Exchanges</h2>
            <p className="text-slate-500 text-lg">The most trending skill trades in our community right now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.length > 0 ? (
              popularCourses.map((course: any) => (
                <CourseCard
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  description={course.description}
                  image={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
                  platform={course.platform}
                  owner={{
                    name: course.currentOwner?.name || "Moon",
                    image: course.currentOwner?.photoURL,
                    verified: true
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-slate-500">
                No courses found. Be the first to add one!
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" asChild className="rounded-full px-8 group border-violet-200 hover:border-violet-500 transition-colors">
              <Link href="/all-courses" className="flex items-center gap-2">
                Explore All Exchanges <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-slate-50 dark:bg-zinc-900/50 py-24 border-y border-slate-100 dark:border-zinc-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
              <p className="text-slate-500 text-lg">Your journey to new skills starts here. Exchange knowledge in three simple steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "1. Discover",
                  desc: "Browse a curated collection of verified courses from top platforms and experts.",
                  icon: <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Search className="h-6 w-6" /></div>
                },
                {
                  title: "2. Connect",
                  desc: "Send an exchange request. Offer your own skills in return for what you want to learn.",
                  icon: <div className="h-12 w-12 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-xl flex items-center justify-center mb-6"><Users className="h-6 w-6" /></div>
                },
                {
                  title: "3. Exchange",
                  desc: "Once accepted, course ownership is swapped instantly. Start learning immediately!",
                  icon: <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-6"><Zap className="h-6 w-6" /></div>
                }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  {step.icon}
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why SkillSwap Section */}
        <section className="container mx-auto px-4 py-24 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                Why thousands of learners trust <span className="bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">SkillSwap</span>
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                We're building a community-driven future where education is accessible through collaboration, not transactions.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Verified Community", desc: "Every instructor and course is vetted for quality and authenticity.", icon: <ShieldCheck className="h-5 w-5 text-emerald-500" /> },
                  { title: "Secure Platform", desc: "Automated ownership swaps ensure fair trades every time.", icon: <LockIcon className="h-5 w-5 text-violet-500" /> },
                  { title: "Global Reputation", desc: "Build your leaderboard status and become a top-tier mentor.", icon: <Trophy className="h-5 w-5 text-blue-500" /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-50">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 to-emerald-500/20 rounded-3xl blur-2xl -z-10" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">10k+</div>
                    <div className="text-xs text-slate-500 uppercase font-semibold">Active Swappers</div>
                  </div>
                  <div className="bg-violet-600 p-6 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-transform">
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-xs text-violet-100 uppercase font-semibold">Instant Access</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-emerald-500 p-6 rounded-2xl shadow-xl transform hover:-translate-y-1 transition-transform">
                    <div className="text-3xl font-bold text-white mb-1">98%</div>
                    <div className="text-xs text-emerald-50 text-emerald-50/70 uppercase font-semibold">Success Rate</div>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">50+</div>
                    <div className="text-xs text-slate-500 uppercase font-semibold">Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Ratings & Testimonials Section */}
        <section className="bg-slate-50 dark:bg-zinc-900/50 py-24 border-t border-slate-100 dark:border-zinc-800 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
            <div className="absolute top-1/4 -left-12 w-64 h-64 bg-violet-400/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Community Stories</h2>
              <p className="text-slate-500 text-lg">Don’t just take our word for it—hear from the people who are redefining learning.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Jenkins",
                  role: "Graphic Designer",
                  image: "https://i.pravatar.cc/150?u=sarah",
                  text: "SkillSwap changed how I learn. I traded my UI design skills for a full Python course. The community is amazing and verified!",
                  rating: 5
                },
                {
                  name: "David Chen",
                  role: "Stack Developer",
                  image: "https://i.pravatar.cc/150?u=david",
                  text: "The exchange was instant and seamless. I'm now learning Advanced React from a senior dev in exchange for my AWS knowledge.",
                  rating: 5
                },
                {
                  name: "Elena Rodriguez",
                  role: "Marketing Specialist",
                  image: "https://i.pravatar.cc/150?u=elena",
                  text: "I was skeptical at first, but the manual verification of courses makes a huge difference. Highly recommend for any professional!",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <Card key={i} spotlight className="p-8 h-full flex flex-col border-slate-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm relative group overflow-visible">
                  <div className="absolute -top-4 -right-4 h-10 w-10 bg-violet-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                    <Quote className="h-5 w-5 fill-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg font-medium leading-relaxed mb-8">
                      "{testimonial.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="h-14 w-14 rounded-full p-1 border-2 border-violet-500/20 group-hover:border-violet-500/50 transition-colors">
                      <div className="h-full w-full rounded-full overflow-hidden bg-slate-200">
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-50 text-base">{testimonial.name}</h4>
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wider">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
