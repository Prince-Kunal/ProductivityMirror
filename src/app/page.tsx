import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Calendar, Target } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -right-[10%] top-[20%] h-[30%] w-[30%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20" />
            <span className="text-xl font-bold tracking-tight text-white/90">Productivity Mirror</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Productivity Analytics Reimagined
          </div>
          
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Reflect on your <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
              deepest work.
            </span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
            A minimal, calming personal productivity system built around your Google Calendar. 
            Track focus, analyze trends, and find your optimal flow state without the stress.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 w-full sm:w-auto rounded-full bg-white px-8 text-base font-semibold text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Activity, title: "Energy Tracking", desc: "Correlate your tasks with energy levels." },
              { icon: Calendar, title: "Calendar Sync", desc: "Seamlessly integrates with Google Calendar." },
              { icon: Target, title: "Deep Work", desc: "Measure and optimize your focus sessions." },
            ].map((feature, i) => (
              <div key={i} className="glass-card flex flex-col items-center rounded-3xl p-8 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                  <feature.icon className="h-6 w-6 text-white/70" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white/90">{feature.title}</h3>
                <p className="text-sm text-white/50">{feature.desc}</p>
              </div>
            ))}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-8 text-center text-sm text-white/40">
          <p>© {new Date().getFullYear()} Productivity Mirror. Crafted for focus.</p>
        </footer>
      </div>
    </div>
  );
}
