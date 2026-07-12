import Image from "next/image";
import Link from "next/link";

import {
  CheckCircle2,
  Clock,
  User,
  XCircle,
  Fingerprint,
  Search,
  CalendarDays,
  Filter,
  RotateCcw,
  FileText,
  Globe,
} from "lucide-react";

import { getAllReports } from "@/actions/incharge/get-all-reports";
import { ReportRowActions } from "@/components/incharge/report-row-actions";

function getStatusBadge(status: string) {
  const s = status.toUpperCase();

  if (s === "APPROVED") {
    return {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      icon: CheckCircle2,
    };
  }

  if (s === "REJECTED") {
    return {
      bg: "bg-rose-500/10",
      text: "text-rose-500",
      border: "border-rose-500/20",
      icon: XCircle,
    };
  }

  return {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
    icon: Clock,
  };
}

function getInitials(name: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getEmployeeId(user: { employeeCode?: string | null }) {
  return user.employeeCode || "Not Generated";
}

function formatCountry(report: CombinedReport) {
  if (report.countryLabels) return report.countryLabels;

  if (!report.country) return "-";

  return String(report.country)
    .split(",")
    .map((item) => item.trim().replaceAll("_", " "))
    .join(", ");
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function buildStatusHref({
  status,
  search,
  from,
  to,
}: {
  status: string;
  search?: string;
  from?: string;
  to?: string;
}) {
  const params = new URLSearchParams();

  params.set("status", status);

  if (search) params.set("search", search);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  return `?${params.toString()}`;
}

type ReportUser = {
  fullName: string;
  employeeCode?: string | null;
  profileImageUrl?: string | null;
};

type CombinedReport = {
  id: string;
  rowId?: string;
  latestReportId?: string;
  reportIds: string[];

  userId: string;
  combinedDateKey: string;
  reportDate: string | Date;

  status: "PENDING" | "APPROVED" | "REJECTED";
  remarks?: string | null;

  country?: string | null;
  countryLabels?: string | null;

  totalGroupsJoined?: number;
  whatsappGroupsJoined?: number;
  telegramGroupsJoined?: number;
  facebookGroupsJoined?: number;

  totalPostsDone?: number;
  whatsappPostsDone?: number;
  telegramPostsDone?: number;
  facebookPostsDone?: number;

  resourceLogin?: number;
  accountClean?: number;
  totalReports: number;

  user: ReportUser;
};

export default async function ReportsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const statusTab = (searchParams?.status as string) || "ALL";
  const search = (searchParams?.search as string) || "";
  const from = (searchParams?.from as string) || "";
  const to = (searchParams?.to as string) || "";

  const reports: CombinedReport[] =
  await getAllReports(searchParams);

  return (
    <div className="relative z-0 min-h-screen w-full overflow-x-hidden bg-[var(--background)] font-sans text-[var(--foreground)] selection:bg-[var(--primary)]/20">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[90%] max-w-[800px] -translate-x-1/2 rounded-full bg-[var(--primary)]/5 opacity-50 blur-[80px] md:h-[600px] md:blur-[120px]" />

      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 md:px-8 lg:px-10 lg:py-16">
        <header className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 md:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3 py-1.5 shadow-sm">
            <FileText className="h-3.5 w-3.5 text-[var(--primary)]" />

            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
              Marketing Reports
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl lg:text-5xl">
            Employee Report Ledger
          </h1>

          <p className="mb-6 max-w-2xl text-xs font-medium leading-relaxed text-[var(--muted-foreground)] sm:text-sm md:mb-8">
            Same employee reports are combined date-wise. If one employee submits
            or updates multiple country reports on the same day, it will appear
            as one combined row.
          </p>

          <div className="mb-6 flex w-full overflow-x-auto pb-2 sm:pb-0">
            <div className="flex min-w-max items-center gap-2 rounded-2xl border border-[var(--border)]/50 bg-[var(--card)]/40 p-1.5 shadow-sm backdrop-blur-md">
              {["ALL", "APPROVED", "PENDING", "REJECTED"].map((tab) => (
                <Link
                  key={tab}
                  href={buildStatusHref({
                    status: tab,
                    search,
                    from,
                    to,
                  })}
                  className={`relative whitespace-nowrap rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-xs ${
                    statusTab === tab
                      ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/25"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab}
                </Link>
              ))}
            </div>
          </div>

          <form className="grid grid-cols-1 gap-4 rounded-3xl border border-[var(--border)]/50 bg-[var(--card)]/40 p-4 shadow-sm backdrop-blur-xl sm:grid-cols-2 sm:p-5 lg:grid-cols-[1.5fr_1fr_1fr_auto_auto]">
            <input type="hidden" name="status" value={statusTab} />

            <div className="group relative sm:col-span-2 lg:col-span-1">
              <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] sm:mb-2">
                Search Employee
              </label>

              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]" />

                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Name, email, phone, or ID..."
                  className="h-11 w-full rounded-2xl border border-[var(--border)]/60 bg-[var(--background)]/50 pl-11 pr-4 text-xs font-semibold text-[var(--foreground)] outline-none transition-all placeholder:text-[var(--muted-foreground)]/70 focus:border-[var(--primary)]/50 focus:bg-[var(--background)] focus:ring-4 focus:ring-[var(--primary)]/10 sm:h-12 sm:text-sm"
                />
              </div>
            </div>

            <div className="group relative col-span-1">
              <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] sm:mb-2">
                From Date
              </label>

              <div className="relative w-full">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)] sm:left-4" />

                <input
                  type="date"
                  name="from"
                  defaultValue={from}
                  className="h-11 w-full rounded-2xl border border-[var(--border)]/60 bg-[var(--background)]/50 pl-9 pr-3 text-xs font-semibold text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)]/50 focus:bg-[var(--background)] focus:ring-4 focus:ring-[var(--primary)]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                />
              </div>
            </div>

            <div className="group relative col-span-1">
              <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] sm:mb-2">
                To Date
              </label>

              <div className="relative w-full">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)] sm:left-4" />

                <input
                  type="date"
                  name="to"
                  defaultValue={to}
                  className="h-11 w-full rounded-2xl border border-[var(--border)]/60 bg-[var(--background)]/50 pl-9 pr-3 text-xs font-semibold text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)]/50 focus:bg-[var(--background)] focus:ring-4 focus:ring-[var(--primary)]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-2 flex flex-row gap-3 sm:col-span-2 sm:mt-0 lg:col-span-1 lg:items-end lg:gap-0 lg:pb-[2px]">
              <button
                type="submit"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--primary)]/30 active:scale-95 sm:h-12 sm:px-6 sm:text-xs lg:flex-none"
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Apply
              </button>
            </div>

            <div className="flex flex-row gap-3 sm:col-span-2 lg:col-span-1 lg:items-end lg:gap-0 lg:pb-[2px]">
              <Link
                href="?status=ALL"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border)]/60 bg-[var(--background)]/50 px-4 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)] active:scale-95 sm:h-12 sm:px-6 sm:text-xs lg:flex-none"
              >
                <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Clear
              </Link>
            </div>
          </form>
        </header>

        <div className="w-full animate-in fade-in slide-in-from-bottom-8 fill-mode-both duration-700 delay-100">
          <div className="w-full overflow-hidden rounded-3xl border border-[var(--border)]/50 bg-[var(--card)] shadow-sm">
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--border)]">
              <table className="w-full min-w-[1000px] border-collapse text-left lg:min-w-[1200px]">
                <thead>
                  <tr className="border-b border-[var(--border)]/40 bg-[var(--muted)]/20">
                    {[
                      "Personnel & Date",
                      "Employee ID",
                      "Country",
                      "Groups",
                      "Posts",
                      "Login / Clean",
                      "Combined",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]/80 sm:px-6"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--border)]/30">
                  {reports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-16 text-center sm:px-6 sm:py-24"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)]/50 text-[var(--muted-foreground)] sm:h-16 sm:w-16">
                            <Search className="h-6 w-6 sm:h-8 sm:w-8" />
                          </div>

                          <h3 className="text-base font-bold text-[var(--foreground)] sm:text-lg">
                            No Reports Found
                          </h3>

                          <p className="mt-1 px-4 text-xs font-medium text-[var(--muted-foreground)] sm:text-sm">
                            Try adjusting your filters or date range to find
                            what you are looking for.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => {
                      const groupsJoined =
                        report.totalGroupsJoined ??
                        (report.whatsappGroupsJoined ?? 0) +
                          (report.telegramGroupsJoined ?? 0) +
                          (report.facebookGroupsJoined ?? 0);

                      const postsDone =
                        report.totalPostsDone ??
                        (report.whatsappPostsDone ?? 0) +
                          (report.telegramPostsDone ?? 0) +
                          (report.facebookPostsDone ?? 0);

                      const employeeId = getEmployeeId(report.user);
                      const initials = getInitials(report.user.fullName);
                      const statusStyle = getStatusBadge(report.status);
                      const StatusIcon = statusStyle.icon;

                      return (
                        <tr
                          key={report.rowId || `${report.userId}-${report.combinedDateKey}`}
                          className="group transition-colors hover:bg-[var(--muted)]/30"
                        >
                          <td className="px-4 py-4 sm:px-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--background)] text-xs font-bold text-[var(--foreground)] shadow-sm ring-2 ring-transparent transition-all group-hover:ring-[var(--primary)]/20 sm:h-10 sm:w-10">
                                {report.user.profileImageUrl ? (
                                  <Image
                                    src={report.user.profileImageUrl}
                                    alt={report.user.fullName}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                ) : (
                                  <>
                                    <User className="h-3.5 w-3.5 text-[var(--muted-foreground)] sm:h-4 sm:w-4" />
                                    <span className="sr-only">{initials}</span>
                                  </>
                                )}
                              </div>

                              <div className="flex min-w-[120px] flex-col">
                                <p className="truncate text-xs font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)] sm:text-sm">
                                  {report.user.fullName}
                                </p>

                                <p className="mt-0.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] sm:text-[10px]">
                                  {formatDate(report.reportDate)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border)]/60 bg-[var(--background)] px-2 py-1 font-mono text-[10px] font-bold text-[var(--muted-foreground)] shadow-sm transition-colors group-hover:border-[var(--primary)]/30 group-hover:text-[var(--primary)] sm:px-2.5 sm:text-[11px]">
                              <Fingerprint className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              {employeeId}
                            </span>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <div className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-[var(--foreground)] sm:gap-2 sm:text-sm">
                              <Globe className="h-3.5 w-3.5 text-[var(--muted-foreground)] sm:h-4 sm:w-4" />
                              {formatCountry(report)}
                            </div>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <span className="font-mono text-xs font-bold text-[var(--foreground)] sm:text-sm">
                              {Number(groupsJoined).toLocaleString("en-IN")}
                            </span>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <span className="font-mono text-xs font-bold text-[var(--foreground)] sm:text-sm">
                              {Number(postsDone).toLocaleString("en-IN")}
                            </span>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <div className="flex items-center whitespace-nowrap font-mono text-xs sm:text-sm">
                              <span className="font-bold text-[var(--primary)]">
                                {report.resourceLogin ?? 0}
                              </span>

                              <span className="mx-1 text-[var(--muted-foreground)]/50 sm:mx-1.5">
                                /
                              </span>

                              <span className="font-bold text-amber-500">
                                {report.accountClean ?? 0}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[var(--muted)] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)] shadow-inner sm:px-3 sm:text-[10px]">
                              {report.totalReports} Report
                              {report.totalReports > 1 ? "s" : ""}
                            </span>
                          </td>

                          <td className="px-4 py-4 sm:px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wider shadow-sm sm:px-2.5 sm:text-[10px] ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                              <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              {report.status}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-right sm:px-6">
                            <div className="flex justify-end opacity-100 transition-opacity lg:opacity-70 lg:group-hover:opacity-100">
                              <ReportRowActions
                                reportId={report.latestReportId || report.id}
                                reportIds={report.reportIds}
                                currentStatus={report.status}
                                currentRemarks={report.remarks ?? null}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}