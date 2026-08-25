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
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  OPERATIONS: {
    slug: "operations",
    icon: Activity,
    description: "Workflow efficiency, resource allocation, and daily output.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  ACCOUNTS: {
    slug: "accounts",
    icon: Wallet,
    description: "Financial health, budget burn rates, and payroll analytics.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  TUTOR: {
    slug: "tutor",
    icon: BookOpen,
    description: "Student engagement, curriculum delivery, and quality scores.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  DIGITAL_MARKETING: {
    slug: "digital-marketing",
    icon: Globe,
    description: "SEO performance, web traffic, and digital conversion rates.",
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
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
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] items-center justify-center p-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
            <AlertCircle className="h-5 w-5 text-[var(--muted-foreground)]" />
          </div>
          <h2 className="text-[15px] font-semibold text-[var(--foreground)]">Department Not Found</h2>
          <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed">
            Your account is not currently linked to a recognized analytics division. Please contact the system administrator.
          </p>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-5 pt-20 sm:gap-5 sm:px-5 md:pt-24 lg:px-6">
      
      {/* ========================================== */}
      {/* 1. COMPACT HEADER & STATUS                 */}
      {/* ========================================== */}
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-[var(--border)]/60 pb-5">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
            <BarChart3 className="h-3 w-3 shrink-0" />
            <span>Performance Metrics</span>
          </div>
          
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Department Analytics
          </h1>
          
          <p className="max-w-2xl text-[13px] text-[var(--muted-foreground)] sm:text-sm">
            Access deep-dive analytics, historical trends, and real-time performance indicators for your specific operational division.
          </p>
        </div>

        {/* Compact Status Widget */}
        <div className="flex shrink-0 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2ECC71]/10 text-[#2ECC71]">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Data Sync
            </span>
            <span className="flex items-center gap-1.5 text-[12px] font-semibold leading-none text-[var(--foreground)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2ECC71]" />
              Live
            </span>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. DENSE ANALYTICS MODULES GRID            */}
      {/* ========================================== */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href={`/incharge/analytics/${config.slug}`}
          className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:border-[var(--primary)] hover:bg-[var(--accent)]/50 sm:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${config.bg} ${config.color} ${config.border}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex flex-col">
                <h2 className="text-[15px] font-semibold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                  {department.name} Analytics
                </h2>
                <p className="mt-0.5 text-[12px] font-medium text-[var(--muted-foreground)] line-clamp-2 leading-snug">
                  {config.description}
                </p>
              </div>
            </div>

            {/* Static decorative sparkline using currentColor inheritance */}
            <div className={`hidden h-8 items-end gap-1 sm:flex ${config.color} opacity-40 transition-opacity group-hover:opacity-100`}>
              <div className="h-3 w-1.5 rounded-sm bg-current opacity-50" />
              <div className="h-5 w-1.5 rounded-sm bg-current opacity-70" />
              <div className="h-4 w-1.5 rounded-sm bg-current opacity-60" />
              <div className="h-7 w-1.5 rounded-sm bg-current opacity-100" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--border)]/60 pt-3">
            <span className="text-[12px] font-semibold text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)]">
              View Analytics Report
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--background)] transition-colors group-hover:bg-[var(--primary)]/10">
              <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)]" />
            </div>
          </div>
        </Link>
      </div>
      
    </div>
  );
}