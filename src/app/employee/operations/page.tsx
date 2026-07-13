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
    <div className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 lg:px-12 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-150px] left-[25%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
              <Activity className="h-3.5 w-3.5" />
              Operations Workspace
            </div>

            <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-5xl">
              Daily Operations Submission
            </h1>

            <p className="max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
              Submit your operations work only inside your active 
              attendance window. The work cycle starts from your check-in time,
              not from the calendar date.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
            />
          </div>
        </div>
      </header>

      <section
        className={`rounded-[30px] border p-6 shadow-sm backdrop-blur-xl ${
          canSubmitWork
            ? "border-emerald-500/20 bg-emerald-500/10"
            : "border-red-500/20 bg-red-500/10"
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`rounded-2xl p-3 ${
                canSubmitWork
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {canSubmitWork ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-black text-[var(--foreground)]">
                {canSubmitWork
                  ? "Work submission is unlocked"
                  : "Work submission is locked"}
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[var(--muted-foreground)]">
                {canSubmitWork
                  ? `You can save or submit operations work until ${formatDateTime(
                      windowInfo?.windowEnd
                    )}.`
                  : "Please check in first. Operations work can only be filled during the active  attendance window."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
              Rule
            </p>

            <p className="mt-1 text-sm font-black text-[var(--foreground)]">
              Check-In + 14 Hours
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OperationsForm report={report} canSubmitWork={!!canSubmitWork} />
        </div>

        <div className="space-y-8">
          <SubmissionStatus
            status={status}
            submittedAt={formatDateTime(report?.submittedAt)}
          />

          <ManagerRemarks remarks={report?.reviewRemarks ?? ""} />
        </div>
      </div>

      <OperationsHistory reports={history} />
    </div>
  );
}

function HeaderMetric({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "red" | "purple" | "amber";
}) {
  const styles = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    red: "border-red-500/20 bg-red-500/10 text-red-500",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-500",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  };

  return (
    <div className="min-w-[140px] rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className={`rounded-xl border p-2 ${styles[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          Live
        </span>
      </div>

      <p className="text-lg font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}