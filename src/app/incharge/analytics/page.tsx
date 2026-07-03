import Link from "next/link";
import { getInchargeDepartment } from "@/actions/incharge/get-incharge-department";
import { 
  BarChart3, 
  Megaphone, 
  Activity, 
  Wallet, 
  BookOpen, 
  Globe,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

// ========================================================
// DYNAMIC DEPARTMENT CONFIGURATION
// ========================================================
const departmentConfig = {
  MARKETING: {
    slug: "marketing",
    icon: Megaphone,
    description: "Campaign ROI, lead generation, and brand reach metrics.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "rgba(168,85,247,0.15)",
  },
  OPERATIONS: {
    slug: "operations",
    icon: Activity,
    description: "Workflow efficiency, resource allocation, and daily output.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "rgba(16,185,129,0.15)",
  },
  ACCOUNTS: {
    slug: "accounts",
    icon: Wallet,
    description: "Financial health, budget burn rates, and payroll analytics.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.15)",
  },
  TUTOR: {
    slug: "tutor",
    icon: BookOpen,
    description: "Student engagement, curriculum delivery, and quality scores.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "rgba(59,130,246,0.15)",
  },
  DIGITAL_MARKETING: {
    slug: "digital-marketing",
    icon: Globe,
    description: "SEO performance, web traffic, and digital conversion rates.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    glow: "rgba(236,72,153,0.15)",
  },
} as const;

export default async function AnalyticsPage() {
  // Fetch the logged-in Incharge's department securely from the server
  const department = await getInchargeDepartment();

  // Match the database department type to our visual config
  const config = department && departmentConfig[department.type as keyof typeof departmentConfig];

  // Graceful fallback if user has no department or an invalid type
  if (!department || !config) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-md p-8 rounded-3xl bg-[var(--card)]/40 border border-[var(--border)] backdrop-blur-xl">
          <AlertCircle className="w-12 h-12 text-[var(--muted-foreground)] mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Department Not Found</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Your account is not currently linked to a recognized analytics division. Please contact the system administrator.</p>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    // Top padding ensures safe clearance from the navbar
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-16 lg:pt-32 lg:px-12 max-w-[1600px] mx-auto">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)]/50 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 shadow-inner">
            <BarChart3 className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[var(--primary)]">
              Performance Metrics
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[var(--foreground)] tracking-tight leading-none mb-3">
            Department Analytics
          </h1>
          <p className="text-[var(--muted-foreground)] text-base font-medium max-w-2xl">
            Access deep-dive analytics, historical trends, and real-time performance indicators for your specific operational division.
          </p>
        </div>

        {/* Quick Status Widget */}
        <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center text-[#2ECC71]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Data Sync</span>
            <span className="text-sm font-black text-[var(--foreground)] leading-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* DYNAMIC ANALYTICS CARD                     */}
      {/* ========================================== */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href={`/incharge/analytics/${config.slug}`}
          className="group relative flex flex-col rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl p-7 transition-all duration-500 hover:-translate-y-1 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          style={{ '--hover-border-color': config.glow } as React.CSSProperties}
        >
          {/* Dynamic Hover Glow effect */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[50px] pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top, ${config.glow}, transparent 70%)` }}
          />

          {/* Background Mesh Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15] group-hover:opacity-[0.25] transition-opacity" />

          <div className="relative z-10 flex flex-col h-full">
            
            {/* Icon & Mini-Chart decorative element */}
            <div className="flex justify-between items-start mb-8">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] ${config.bg} ${config.color} ring-1 ring-current/20 group-hover:scale-110 group-hover:shadow-md transition-all duration-500`}>
                <Icon className="h-7 w-7" />
              </div>
              
              {/* Decorative static sparkline */}
              <div className="flex items-end gap-1 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                <div className={`w-1.5 h-3 rounded-full ${config.bg.replace('/10', '/50')}`} />
                <div className={`w-1.5 h-5 rounded-full ${config.bg.replace('/10', '/70')}`} />
                <div className={`w-1.5 h-4 rounded-full ${config.bg.replace('/10', '/60')}`} />
                <div className={`w-1.5 h-7 rounded-full ${config.color.replace('text-', 'bg-')}`} />
              </div>
            </div>

            <h2 className={`text-2xl font-extrabold text-[var(--foreground)] ${config.color.replace('text-', 'group-hover:text-')} transition-colors duration-300 tracking-tight mb-2`}>
              {department.name}
            </h2>

            <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed mb-8 flex-1 font-medium">
              {config.description}
            </p>

            {/* Call to Action Footer */}
            <div className={`mt-auto flex items-center pt-5 border-t border-[var(--border)]/60 text-sm font-bold text-[var(--foreground)] ${config.color.replace('text-', 'group-hover:text-')} transition-colors duration-300`}>
              <span className="tracking-wide">View Analytics Report</span>
              <div className={`ml-auto flex h-8 w-8 items-center justify-center rounded-full ${config.bg} transition-all duration-300 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}>
                <ArrowRight className={`h-4 w-4 ${config.color}`} />
              </div>
            </div>
          </div>

          {/* Shine Sweep Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
          
          {/* Injecting CSS variable to handle the border color override cleanly */}
          <style dangerouslySetInnerHTML={{ __html: `
            .group:hover { border-color: var(--hover-border-color); }
          `}} />
        </Link>
      </div>
      
    </div>
  );
}