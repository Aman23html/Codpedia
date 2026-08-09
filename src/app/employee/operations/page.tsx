import { redirect } from "next/navigation";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FileText,
  Lock,
  TimerReset,
} from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getTodayAttendance } from "@/actions/attendance/get-today-attendance";
import { getTodayOperationReport } from "@/actions/operations/get-today-operation-report";
import { getOperationHistory } from "@/actions/operations/get-operation-history";

import OperationsForm from "@/components/operations/operations-form";
import SubmissionStatus from "@/components/operations/submission-status";
import ManagerRemarks from "@/components/operations/manager-remarks";
import OperationsHistory from "@/components/operations/operations-history";

import { DepartmentType, Role } from "@/constants/enums";

// ============================================================================
// HELPER FUNCTIONS (UNCHANGED LOGIC)
// ============================================================================

function getWindowEnd(checkIn: Date | string) {
  const end = new Date(checkIn);
  end.setHours(end.getHours() + 14);
  return end;
}

function getRemainingTime(checkIn: Date | string) {
  const windowEnd = getWindowEnd(checkIn);
  const now = new Date();

  const diff = Math.max(0, windowEnd.getTime() - now.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    windowEnd,
    text: `${hours}h ${minutes}m left`,
    isActive: now <= windowEnd,
  };
}

function formatDateTime(date?: Date | string | null) {
  if (!date) return null;

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default async function OperationsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    date?: string;
  }>;
}) {
  const params = await searchParams;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== Role.EMPLOYEE) {
    redirect("/unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.OPERATIONS) {
    redirect("/employee");
  }

  const [attendance, report, history] = await Promise.all([
    getTodayAttendance(),
    getTodayOperationReport(),
    getOperationHistory({
      status: params?.status ?? "ALL",
      date: params?.date,
    }),
  ]);

  const attendanceActive = !!attendance?.checkIn;

  const windowInfo = attendance?.checkIn
    ? getRemainingTime(attendance.checkIn)
    : null;

  const canSubmitWork = attendanceActive && windowInfo?.isActive;

  const status = report?.status ?? "DRAFT";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-8 pt-20 sm:gap-6 sm:px-5 sm:py-12 md:pt-24 lg:gap-8 lg:px-6">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <header className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] sm:text-xs">
            <Activity className="h-3 w-3 shrink-0" />
            <span>Operations Workspace</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Daily Operations Submission
          </h1>

          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            Submit your operations work only inside your active attendance window. The work cycle starts from your check-in time, not from the calendar date.
          </p>
        </div>

        {/* Compact Metrics Row */}
        <div className="grid shrink-0 grid-cols-2 gap-2 w-full md:w-auto md:flex md:flex-row md:gap-3">
          <HeaderMetric
            title="Attendance"
            value={canSubmitWork ? "Active" : "Locked"}
            icon={canSubmitWork ? CheckCircle2 : Lock}
            tone={canSubmitWork ? "emerald" : "red"}
          />
          <HeaderMetric
            title="Report"
            value={status.replaceAll("_", " ")}
            icon={FileText}
            tone="blue"
          />
          <HeaderMetric
            title="Window"
            value={windowInfo?.text ?? "No Check-In"}
            icon={TimerReset}
            tone={canSubmitWork ? "purple" : "amber"}
            className="col-span-2 md:col-span-1"
          />
        </div>
      </header>

      {/* ========================================== */}
      {/* STATUS BANNER                              */}
      {/* ========================================== */}
      <section
        className={`flex flex-col gap-4 rounded-xl border p-4 shadow-sm transition-colors sm:p-5 md:flex-row md:items-center md:justify-between ${
          canSubmitWork
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
        }`}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="mt-0.5 shrink-0">
            {canSubmitWork ? (
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight sm:text-lg">
              {canSubmitWork
                ? "Work submission is unlocked"
                : "Work submission is locked"}
            </h2>

            <p className="mt-1 text-xs font-medium opacity-90 sm:text-sm">
              {canSubmitWork
                ? `You can save or submit operations work until ${formatDateTime(
                    windowInfo?.windowEnd
                  )}.`
                : "Please check in first. Operations work can only be filled during the active attendance window."}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-md border border-current/20 bg-current/10 px-3 py-2 text-current md:self-stretch md:flex md:flex-col md:justify-center">
          <p className="text-[9px] font-semibold uppercase tracking-wider opacity-80">
            Rule
          </p>
          <p className="mt-0.5 whitespace-nowrap text-xs font-semibold sm:text-sm">
            Check-In + 14 Hours
          </p>
        </div>
      </section>

      {/* ========================================== */}
      {/* MAIN CONTENT GRID                          */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 sm:gap-6">
        <div className="lg:col-span-2 flex flex-col min-w-0">
          <OperationsForm report={report} canSubmitWork={!!canSubmitWork} />
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <SubmissionStatus
            status={status}
            submittedAt={formatDateTime(report?.submittedAt)}
          />
          <ManagerRemarks remarks={report?.reviewRemarks ?? ""} />
        </div>
      </div>

      <div className="mt-2 min-w-0">
        <OperationsHistory reports={history} />
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function HeaderMetric({
  title,
  value,
  icon: Icon,
  tone,
  className = "",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "red" | "purple" | "amber";
  className?: string;
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    red: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  };

  return (
    <div className={`flex flex-col items-start justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 shadow-sm flex-1 md:flex-none md:min-w-[130px] ${className}`}>
      <div className="mb-1.5 flex items-center gap-2">
        <div className={`flex items-center justify-center rounded-md border p-1 ${styles[tone]}`}>
          <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
          {title}
        </span>
      </div>
      <p className="truncate text-sm font-semibold text-[var(--foreground)] sm:text-base">
        {value}
      </p>
    </div>
  );
}