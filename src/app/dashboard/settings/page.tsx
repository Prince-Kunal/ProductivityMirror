import { createClient } from "@/utils/supabase/server";
import { getDebugInfo } from "@/lib/date";
import { Settings, Shield, Globe, Bell, Heart, LogOut } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const debug = getDebugInfo();

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Settings</h1>
        <p className="mt-1 text-sm text-white/40">
          Personalize your calm reflective operating system.
        </p>
      </div>

      {/* Profile Section */}
      <div className="glass-card rounded-3xl border border-white/5 p-6 flex flex-col sm:flex-row items-center gap-4 bg-white/[0.01]">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-inner shadow-white/20 select-none">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-white/95">{user?.email?.split("@")[0]}</h3>
          <p className="text-sm text-white/35">{user?.email}</p>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Timezone & Core Sync */}
        <div className="glass-card rounded-3xl border border-white/5 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-white/90">Timezone & Alignment</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Current Region</span>
              <span className="text-sm font-medium text-white/80">{debug.configuredTimezone}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Server Timezone</span>
              <span className="text-sm font-medium text-white/45">{debug.serverTimezone}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-white/50">Local Clock</span>
              <span className="text-xs font-mono text-white/85 bg-white/5 px-2 py-1 rounded">
                {debug.localNow.split(" ")[1]} (IST)
              </span>
            </div>
          </div>
        </div>

        {/* Calm UX Options */}
        <div className="glass-card rounded-3xl border border-white/5 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-indigo-400" />
            <h3 className="font-semibold text-white/90">Calm Experience</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div>
                <p className="text-sm font-medium text-white/80">Reflective Mode</p>
                <p className="text-xs text-white/35">Focus on consistency over speed</p>
              </div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div>
                <p className="text-sm font-medium text-white/80">Zero Pressure UI</p>
                <p className="text-xs text-white/35">Hide distracting productivity tickers</p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="glass-card rounded-3xl border border-white/5 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-white/90">Security & Storage</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Data Provider</span>
              <span className="text-sm font-medium text-white/80">Supabase DB</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-white/50">Google Integration</span>
              <span className="text-sm font-medium text-emerald-400">Authenticated</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-white/50">Row Level Security</span>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/20">
                ENABLED
              </span>
            </div>
          </div>
        </div>

        {/* Wellness & Guidance */}
        <div className="glass-card rounded-3xl border border-white/5 p-6 flex flex-col justify-between gap-5 bg-gradient-to-br from-indigo-950/10 via-background to-background">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-5 w-5 text-rose-400" />
              <h3 className="font-semibold text-white/90">Your Wellness Partner</h3>
            </div>
            <p className="text-xs leading-relaxed text-white/40">
              Mirror is architected to keep your mind tranquil. If you notice yourself overplanning or struggling with deep work, the system automatically suggests backing off. Rest is productivity.
            </p>
          </div>
          <div className="text-xs text-white/25 italic">
            "To reflect is to understand, not to judge."
          </div>
        </div>

      </div>
    </div>
  );
}
