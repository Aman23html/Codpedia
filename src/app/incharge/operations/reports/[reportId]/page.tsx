import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  ArrowLeft,
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Fingerprint,
  Handshake,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  Building2,
  ClipboardCheck,
  MessageSquareText,
  Activity,
  Sparkles,
} from "lucide-react";

import { getCurrentUser } from "@/lib/current-user";
import { getOperationReportDetails } from "@/actions/incharge/operations/get-operation-report-details";
import OperationReviewActions from "@/components/incharge/operations/operation-review-actions";

import { DepartmentType, Role } from "@/constants/enums";

function getInitials(name: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(date?: Date | string | null) {
  if (!date) return "Not Available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: Date | string | null) {
  if (!date) return "Not Available";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OperationReportDetailPage({
  params,
}: {
  params: Promise<{
    reportId: string;
  }>;
}) {
  const { reportId } = await params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== Role.INCHARGE) {
    redirect("/unauthorized");
  }

  if (
    !currentUser.department ||
    currentUser.department.type !== DepartmentType.OPERATIONS
  ) {
    redirect("/incharge");
  }

  const report = await getOperationReportDetails(reportId);

  if (!report) {
    notFound();
  }

  const employeeId = report.user.employeeCode || "Not Generated";
  const initials = getInitials(report.user.fullName);
  

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-28 pb-24 lg:px-12 lg:pt-32 max-w-[1700px] mx-auto space-y-10">
      <header className="relative overflow-hidden rounded-[38px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
        <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-140px] left-[20%] h-[320px] w-[320px] rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10">
          <Link
            href="/incharge/operations/reports"
            className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)] transition hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Link>

          <div className="grid gap-8 xl:grid-cols-12 xl:items-end">
            <div className="xl:col-span-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
                <ClipboardCheck className="h-3.5 w-3.5" />
                Operations Report Review
              </div>

              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[26px] border border-[var(--border)] bg-gradient-to-tr from-[var(--primary)] to-purple-600 text-2xl font-black text-white shadow-lg">
                  {report.user.profileImageUrl ? (
                    <Image
                      src={report.user.profileImageUrl}
                      alt={report.user.fullName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div>
                  <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-6xl">
                    {report.user.fullName}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 font-mono text-xs font-black text-[var(--primary)]">
                      <Fingerprint className="h-4 w-4" />
                      {employeeId}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                      <Building2 className="h-4 w-4 text-[var(--primary)]" />
                      {report.user.department.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-4">
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--background)]/70 p-6 shadow-inner">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                      Current Status
                    </p>

                    <p className="mt-1 text-lg font-black text-[var(--foreground)]">
                      {String(report.status).replaceAll("_", " ")}
                    </p>
                  </div>

                  <StatusBadge status={String(report.status)} />
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                    Report Date
                  </p>

                  <p className="mt-1 text-sm font-black text-[var(--foreground)]">
                    {formatDate(report.reportDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <MetricCard
          title="Query Generated"
          value={report.queryGenerated}
          icon={FileText}
          tone="blue"
        />

        <MetricCard
          title="Deals Done"
          value={report.dealsDone}
          icon={Handshake}
          tone="emerald"
        />

        <MetricCard
          title="Tutor Assigned"
          value={report.tutorAssigned}
          icon={UserCheck}
          tone="purple"
        />

        <MetricCard
          title="Deals Amount"
          value={`₹${Number(report.dealsDoneAmount || 0).toLocaleString(
            "en-IN"
          )}`}
          icon={BadgeIndianRupee}
          tone="amber"
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section className="rounded-[36px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <div className="mb-8 flex items-start justify-between gap-5">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
                  <Activity className="h-3.5 w-3.5" />
                  Submitted Data
                </div>

                <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">
                  Operations Performance Summary
                </h2>

                <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
                  Employee-submitted operational output for this report cycle.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <DataBlock
                title="Query Generated"
                value={report.queryGenerated}
                subtitle="Total queries created by employee"
              />

              <DataBlock
                title="Deals Done"
                value={report.dealsDone}
                subtitle="Completed deal count"
              />

              <DataBlock
                title="Tutor Assigned"
                value={report.tutorAssigned}
                subtitle="Tutor allocation count"
              />

              <DataBlock
                title="Deal Amount"
                value={`₹${Number(report.dealsDoneAmount || 0).toLocaleString(
                  "en-IN"
                )}`}
                subtitle="Total converted amount"
              />
            </div>
          </section>

          <section className="rounded-[36px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
                <MessageSquareText className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-[var(--foreground)]">
                  Work Notes
                </h2>

                <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
                  Notes submitted by the employee for this operations report.
                </p>
              </div>
            </div>

            <div className="rounded-[26px] border border-[var(--border)] bg-[var(--background)]/70 p-6">
              <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">
                {report.workNotes || "No work notes submitted by employee."}
              </p>
            </div>
          </section>

          <section className="rounded-[36px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-[var(--foreground)]">
                  Review Decision
                </h2>

                <p className="mt-1 text-sm font-medium text-[var(--muted-foreground)]">
                  Verify, reject, or request correction for this report.
                </p>
              </div>
            </div>

            <div className="rounded-[26px] border border-[var(--border)] bg-[var(--background)]/70 p-6">
              <OperationReviewActions
                reportId={report.id || report._id}
                status={report.status}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-8 lg:col-span-4">
          <section className="rounded-[36px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-[var(--foreground)]">
              <UserCheck className="h-5 w-5 text-[var(--primary)]" />
              Employee Information
            </h2>

            <div className="space-y-5">
              <InfoRow
                icon={Fingerprint}
                label="Employee ID"
                value={employeeId}
                mono
              />

              <InfoRow
                icon={UserCheck}
                label="Name"
                value={report.user.fullName}
              />

              <InfoRow icon={Mail} label="Email" value={report.user.email} />

              <InfoRow
                icon={Phone}
                label="Phone"
                value={report.user.phone || "Not Provided"}
              />

              <InfoRow
                icon={Building2}
                label="Department"
                value={report.user.department?.name || "Operations"}
              />

              <InfoRow
                icon={CalendarDays}
                label="Joined"
                value={formatDate(report.user.createdAt)}
              />
            </div>
          </section>

          <section className="rounded-[36px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-[var(--foreground)]">
              <Clock className="h-5 w-5 text-[var(--primary)]" />
              Report Timeline
            </h2>

            <div className="space-y-5">
              <TimelineItem
                title="Report Date"
                value={formatDate(report.reportDate)}
              />

              <TimelineItem
                title="Submitted At"
                value={formatDateTime(report.submittedAt)}
              />

              <TimelineItem
                title="Reviewed At"
                value={formatDateTime((report as any).reviewedAt)}
              />

              <TimelineItem
                title="Last Updated"
                value={formatDateTime(report.updatedAt)}
              />
            </div>
          </section>

          <section className="rounded-[36px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-[var(--foreground)]">
              {/* <Sparkles className="h-5 w-5 text-purple-500" /> */}
              Review Remarks
            </h2>

            <div className="rounded-[26px] border border-[var(--border)] bg-[var(--background)]/70 p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">
                {(report as any).reviewRemarks ||
                  "No review remarks added yet."}
              </p>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "purple" | "amber";
}) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <div className="group rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-[var(--primary)]/30">
      <div className="mb-6 flex items-center justify-between">
        <div className={`rounded-2xl border p-3 ${styles[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <h3 className="text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function DataBlock({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--background)]/70 p-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-black text-[var(--foreground)]">
        {value}
      </h3>

      <p className="mt-2 text-xs font-semibold text-[var(--muted-foreground)]">
        {subtitle}
      </p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-3">
      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        <Icon className="h-4 w-4 text-[var(--primary)]" />
        {label}
      </span>

      <span
        className={`max-w-[190px] truncate text-sm font-bold text-[var(--foreground)] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TimelineItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
      <div className="mt-0.5 rounded-xl bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
        <Clock className="h-4 w-4" />
      </div>

      <div>
        <p className="text-sm font-black text-[var(--foreground)]">{title}</p>

        <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    SUBMITTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    VERIFIED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    CORRECTION_REQUIRED:
      "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <span
      className={`inline-flex rounded-xl border px-5 py-3 text-xs font-black uppercase tracking-widest ${
        styles[status] ?? styles.DRAFT
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}