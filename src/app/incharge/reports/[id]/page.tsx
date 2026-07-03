import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ReviewActions from "@/components/marketing/review-actions";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  MessageCircle,
  Send,
  Users,
  Key,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Fingerprint,
  Database,
  BarChart3,
  MapPin,
  Trash2,
} from "lucide-react";

function startOfDay(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfDay(date: Date) {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function formatOnlyDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatCountry(country: string) {
  if (country === "NORTH_AMERICA") return "North America";
  if (country === "EUROPE") return "Europe";
  if (country === "AUSTRALIA") return "Australia";
  return country?.replaceAll("_", " ") || "-";
}

function getStatusConfig(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      };

    case "REJECTED":
      return {
        icon: XCircle,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
      };

    default:
      return {
        icon: AlertCircle,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
      };
  }
}

function totalGroups(report: any) {
  return (
    (report.whatsappGroupsJoined ?? 0) +
    (report.telegramGroupsJoined ?? 0) +
    (report.facebookGroupsJoined ?? 0)
  );
}

function totalPosts(report: any) {
  return (
    (report.whatsappPostsDone ?? 0) +
    (report.telegramPostsDone ?? 0) +
    (report.facebookPostsDone ?? 0)
  );
}

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const selectedReport = await prisma.marketingReport.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          employeeCode: true,
          fullName: true,
          username: true,
          email: true,
          phone: true,
          profileImageUrl: true,
          department: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!selectedReport) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)]/50 text-[var(--muted-foreground)]">
            <FileText className="h-8 w-8" />
          </div>

          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Report Not Found
          </h2>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            The requested report does not exist or has been removed.
          </p>

          <Link
            href="/incharge"
            className="mt-6 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[var(--primary)]/90"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const sameDayReports = await prisma.marketingReport.findMany({
    where: {
      userId: selectedReport.userId,
      reportDate: {
        gte: startOfDay(selectedReport.reportDate),
        lte: endOfDay(selectedReport.reportDate),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          employeeCode: true,
          fullName: true,
          username: true,
          email: true,
          phone: true,
          profileImageUrl: true,
          department: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const latestReport = sameDayReports[0] || selectedReport;
  const user = selectedReport.user;

  const summary = sameDayReports.reduce(
    (acc, report) => {
      acc.whatsappGroupsJoined += report.whatsappGroupsJoined ?? 0;
      acc.whatsappPostsDone += report.whatsappPostsDone ?? 0;

      acc.telegramGroupsJoined += report.telegramGroupsJoined ?? 0;
      acc.telegramPostsDone += report.telegramPostsDone ?? 0;

      acc.facebookGroupsJoined += report.facebookGroupsJoined ?? 0;
      acc.facebookPostsDone += report.facebookPostsDone ?? 0;

      acc.resourceLogin += report.resourceLogin ?? 0;
      acc.accountClean += report.accountClean ?? 0;

      acc.totalGroups += totalGroups(report);
      acc.totalPosts += totalPosts(report);

      if (report.status === "APPROVED") acc.approved += 1;
      if (report.status === "PENDING") acc.pending += 1;
      if (report.status === "REJECTED") acc.rejected += 1;

      return acc;
    },
    {
      whatsappGroupsJoined: 0,
      whatsappPostsDone: 0,

      telegramGroupsJoined: 0,
      telegramPostsDone: 0,

      facebookGroupsJoined: 0,
      facebookPostsDone: 0,

      resourceLogin: 0,
      accountClean: 0,

      totalGroups: 0,
      totalPosts: 0,

      approved: 0,
      pending: 0,
      rejected: 0,
    }
  );

  const countryMap = new Map<
    string,
    {
      country: string;
      countryLabel: string;
      reports: number;
      whatsappGroupsJoined: number;
      whatsappPostsDone: number;
      telegramGroupsJoined: number;
      telegramPostsDone: number;
      facebookGroupsJoined: number;
      facebookPostsDone: number;
      resourceLogin: number;
      accountClean: number;
      totalGroups: number;
      totalPosts: number;
      approved: number;
      pending: number;
      rejected: number;
    }
  >();

  for (const report of sameDayReports) {
    const country = report.country || "OTHER";

    if (!countryMap.has(country)) {
      countryMap.set(country, {
        country,
        countryLabel: formatCountry(country),
        reports: 0,

        whatsappGroupsJoined: 0,
        whatsappPostsDone: 0,

        telegramGroupsJoined: 0,
        telegramPostsDone: 0,

        facebookGroupsJoined: 0,
        facebookPostsDone: 0,

        resourceLogin: 0,
        accountClean: 0,

        totalGroups: 0,
        totalPosts: 0,

        approved: 0,
        pending: 0,
        rejected: 0,
      });
    }

    const row = countryMap.get(country)!;

    row.reports += 1;

    row.whatsappGroupsJoined += report.whatsappGroupsJoined ?? 0;
    row.whatsappPostsDone += report.whatsappPostsDone ?? 0;

    row.telegramGroupsJoined += report.telegramGroupsJoined ?? 0;
    row.telegramPostsDone += report.telegramPostsDone ?? 0;

    row.facebookGroupsJoined += report.facebookGroupsJoined ?? 0;
    row.facebookPostsDone += report.facebookPostsDone ?? 0;

    row.resourceLogin += report.resourceLogin ?? 0;
    row.accountClean += report.accountClean ?? 0;

    row.totalGroups += totalGroups(report);
    row.totalPosts += totalPosts(report);

    if (report.status === "APPROVED") row.approved += 1;
    if (report.status === "PENDING") row.pending += 1;
    if (report.status === "REJECTED") row.rejected += 1;
  }

  const countries = Array.from(countryMap.values());

  const statusConfig = getStatusConfig(latestReport.status);
  const StatusIcon = statusConfig.icon;

  const employeeId = user.employeeCode || "Not Generated";
  const totalOutput =
    summary.totalGroups +
    summary.totalPosts +
    summary.resourceLogin +
    summary.accountClean;

  return (
    <div className="min-h-screen w-full bg-[var(--background)] font-sans text-[var(--foreground)] selection:bg-[var(--primary)]/20">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 bg-[var(--primary)]/5 opacity-50 blur-[120px]" />

      <main className="mx-auto max-w-7xl p-6 pt-28 md:p-10 md:pt-32">
        <Link
          href="/incharge"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <header className="mb-10 rounded-[34px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] shadow-sm">
              <Globe className="h-3.5 w-3.5 text-[var(--primary)]" />
              {countries.map((item) => item.countryLabel).join(", ") || "-"}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {latestReport.status}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-[var(--primary)] shadow-sm">
              <Fingerprint className="h-3.5 w-3.5" />
              {employeeId}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl">
                {user.fullName}
              </h1>

              <p className="mt-3 text-sm font-medium text-[var(--muted-foreground)]">
                Combined marketing report details for{" "}
                {formatOnlyDate(selectedReport.reportDate)}. All countries
                submitted by this employee on this date are summed here.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <HeaderMini title="Reports" value={sameDayReports.length} />
              <HeaderMini title="Countries" value={countries.length} />
              <HeaderMini title="Output" value={totalOutput} />
            </div>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Total Groups"
            value={summary.totalGroups}
            icon={Users}
            tone="emerald"
            isLarge
          />

          <StatCard
            label="Total Posts"
            value={summary.totalPosts}
            icon={FileText}
            tone="sky"
            isLarge
          />

          <StatCard
            label="Resource Login"
            value={summary.resourceLogin}
            icon={Key}
            tone="purple"
            isLarge
          />

          <StatCard
            label="Account Clean"
            value={summary.accountClean}
            icon={ShieldCheck}
            tone="amber"
            isLarge
          />
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/45 p-7 shadow-sm backdrop-blur-xl">
              <h2 className="mb-5 flex items-center gap-3 text-xl font-black tracking-tight text-[var(--foreground)]">
                <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
                Platform Totals
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatCard
                  label="WhatsApp Groups"
                  value={summary.whatsappGroupsJoined}
                  icon={MessageCircle}
                  tone="emerald"
                />

                <StatCard
                  label="WhatsApp Posts"
                  value={summary.whatsappPostsDone}
                  icon={MessageCircle}
                  tone="emerald"
                />

                <StatCard
                  label="Telegram Groups"
                  value={summary.telegramGroupsJoined}
                  icon={Send}
                  tone="sky"
                />

                <StatCard
                  label="Telegram Posts"
                  value={summary.telegramPostsDone}
                  icon={Send}
                  tone="sky"
                />

                <StatCard
                  label="Facebook Groups"
                  value={summary.facebookGroupsJoined}
                  icon={User}
                  tone="blue"
                />

                <StatCard
                  label="Facebook Posts"
                  value={summary.facebookPostsDone}
                  icon={User}
                  tone="blue"
                />
              </div>
            </section>

            <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)]/45 shadow-sm backdrop-blur-xl">
              <div className="border-b border-[var(--border)]/60 p-7">
                <h2 className="flex items-center gap-3 text-xl font-black tracking-tight text-[var(--foreground)]">
                  <MapPin className="h-5 w-5 text-[var(--primary)]" />
                  Country-wise Combined Details
                </h2>

                <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
                  Every country submitted on the same day is grouped and summed
                  properly below.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="border-b border-[var(--border)]/60 bg-[var(--background)]/50">
                    <tr>
                      <TableHead>Country</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Groups</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Login</TableHead>
                      <TableHead>Clean</TableHead>
                      <TableHead>Status</TableHead>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--border)]/50">
                    {countries.map((country) => (
                      <tr
                        key={country.country}
                        className="transition hover:bg-[var(--background)]/60"
                      >
                        <td className="whitespace-nowrap px-8 py-5">
                          <div>
                            <p className="font-black text-[var(--foreground)]">
                              {country.countryLabel}
                            </p>

                            <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
                              WhatsApp + Telegram + Facebook
                            </p>
                          </div>
                        </td>

                        <TableValue value={country.reports} />
                        <TableValue value={country.totalGroups} />
                        <TableValue value={country.totalPosts} />
                        <TableValue value={country.resourceLogin} />
                        <TableValue value={country.accountClean} />

                        <td className="whitespace-nowrap px-8 py-5">
                          <div className="flex flex-wrap gap-2">
                            <StatusPill
                              label="A"
                              value={country.approved}
                              tone="emerald"
                            />

                            <StatusPill
                              label="P"
                              value={country.pending}
                              tone="amber"
                            />

                            <StatusPill
                              label="R"
                              value={country.rejected}
                              tone="red"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {latestReport.remarks && (
              <div className="flex items-start gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-rose-500">
                    Incharge Remarks
                  </h3>

                  <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--foreground)]">
                    {latestReport.remarks}
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)]/50 bg-[var(--card)] p-6 shadow-sm">
              <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-[var(--foreground)]">
                <Database className="h-4 w-4 text-[var(--primary)]" />
                Report Metadata
              </h3>

              <div className="space-y-4">
                <MetaRow
                  icon={Calendar}
                  label="Report Date"
                  value={formatOnlyDate(selectedReport.reportDate)}
                />

                <MetaRow
                  icon={Calendar}
                  label="Created On"
                  value={formatDate(selectedReport.createdAt)}
                />

                <MetaRow
                  icon={Clock}
                  label="Last Updated"
                  value={formatDate(latestReport.updatedAt)}
                />

                <div className="my-2 border-t border-[var(--border)]/40" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--muted-foreground)]">
                    Selected Report
                  </span>

                  <span className="rounded bg-[var(--muted)] px-2 py-1 font-mono text-xs font-medium text-[var(--muted-foreground)]">
                    {selectedReport.id.substring(0, 8)}...
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--muted-foreground)]">
                    Combined Records
                  </span>

                  <span className="rounded bg-[var(--muted)] px-2 py-1 font-mono text-xs font-black text-[var(--foreground)]">
                    {sameDayReports.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)]/50 bg-[var(--card)] p-6 shadow-sm">
              <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-[var(--foreground)]">
                <User className="h-4 w-4 text-[var(--primary)]" />
                Employee Details
              </h3>

              <div className="space-y-3">
                <InfoLine label="Employee ID" value={employeeId} />
                <InfoLine label="Name" value={user.fullName} />
                <InfoLine label="Email" value={user.email} />
                <InfoLine label="Phone" value={user.phone || "Not Provided"} />
                <InfoLine
                  label="Department"
                  value={user.department?.name || "Marketing"}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--primary)]/20 bg-gradient-to-b from-[var(--primary)]/10 to-[var(--background)] p-6 shadow-lg shadow-[var(--primary)]/5">
              <h3 className="mb-2 text-base font-bold text-[var(--foreground)]">
                Review Actions
              </h3>

              <p className="mb-6 text-xs font-medium text-[var(--muted-foreground)]">
                This button currently reviews the selected report. If you want
                one click to approve/reject all combined country records, we need
                to update ReviewActions to accept multiple report IDs.
              </p>

              <div className="w-full [&>div]:w-full [&_button]:w-full [&_button]:rounded-xl [&_button]:font-bold [&_button]:shadow-sm">
                <ReviewActions
  reportIds={sameDayReports.map((report) => report.id)}
  redirectTo="/incharge"
/>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function HeaderMini({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4 text-center shadow-sm">
      <p className="text-2xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)]">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </span>

      <span className="max-w-[180px] truncate text-right text-sm font-bold text-[var(--foreground)]">
        {value}
      </span>
    </div>
  );
}

function StatusPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "red";
}) {
  const styles = {
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    red: "border-red-500/20 bg-red-500/10 text-red-500",
  };

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-black ${styles[tone]}`}
    >
      {label}: {value}
    </span>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
      {children}
    </th>
  );
}

function TableValue({ value }: { value: string | number }) {
  return (
    <td className="whitespace-nowrap px-8 py-5 text-sm font-black text-[var(--foreground)]">
      {value}
    </td>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  isLarge = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  tone: "emerald" | "sky" | "blue" | "purple" | "amber";
  isLarge?: boolean;
}) {
  const toneConfig = {
    emerald:
      "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20 group-hover:shadow-emerald-500/10",
    sky: "text-sky-500 bg-sky-500/10 ring-sky-500/20 group-hover:shadow-sky-500/10",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-500/10 ring-blue-500/20 group-hover:shadow-blue-500/10",
    purple:
      "text-purple-500 bg-purple-500/10 ring-purple-500/20 group-hover:shadow-purple-500/10",
    amber:
      "text-amber-500 bg-amber-500/10 ring-amber-500/20 group-hover:shadow-amber-500/10",
  };

  const currentTone = toneConfig[tone];

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)]/50 bg-[var(--card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-xl ${
        isLarge ? "p-6" : "p-5"
      }`}
    >
      <div className="relative z-10 mb-4 flex items-start justify-between">
        <div
          className={`flex items-center justify-center rounded-xl ${currentTone} ring-1 ${
            isLarge ? "h-12 w-12" : "h-10 w-10"
          }`}
        >
          <Icon className={isLarge ? "h-6 w-6" : "h-5 w-5"} />
        </div>
      </div>

      <div className="relative z-10">
        <p
          className={`font-black tracking-tighter text-[var(--foreground)] ${
            isLarge ? "text-4xl" : "text-3xl"
          }`}
        >
          {value.toLocaleString("en-IN")}
        </p>

        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </p>
      </div>

      <div
        className={`absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-[40px] transition-opacity duration-500 group-hover:opacity-100 ${
          currentTone.split(" ")[0].replace("text-", "bg-")
        }`}
      />
    </div>
  );
}