"use client";

import React, { useMemo, useState } from "react";
import {
  AlertOctagon,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  XCircle,
} from "lucide-react";

function numberValue(value: unknown) {
  return typeof value === "number" ? value : Number(value || 0);
}

function getReportDate(report: any) {
  return report.reportDate || report.createdAt;
}

function getDateKey(date: Date | string) {
  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
}

function getDateLabel(date: Date | string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatCountry(country: string) {
  if (!country) return "-";
  if (country === "NORTH_AMERICA") return "North America";
  if (country === "EUROPE") return "Europe";
  if (country === "AUSTRALIA") return "Australia";
  return country.replaceAll("_", " ");
}

function getTotals(reports: any[]) {
  return reports.reduce(
    (acc, report) => {
      acc.waGrp += numberValue(report.whatsappGroupsJoined);
      acc.waPost += numberValue(report.whatsappPostsDone);
      acc.tgGrp += numberValue(report.telegramGroupsJoined);
      acc.tgPost += numberValue(report.telegramPostsDone);
      acc.fbGrp += numberValue(report.facebookGroupsJoined);
      acc.fbPost += numberValue(report.facebookPostsDone);
      acc.resLgn += numberValue(report.resourceLogin);
      acc.accCln += numberValue(report.accountClean);

      if (report.status === "APPROVED") acc.approved += 1;
      if (report.status === "REJECTED") acc.rejected += 1;
      if (report.status === "PENDING") acc.pending += 1;

      return acc;
    },
    {
      waGrp: 0,
      waPost: 0,
      tgGrp: 0,
      tgPost: 0,
      fbGrp: 0,
      fbPost: 0,
      resLgn: 0,
      accCln: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
    }
  );
}

function isWrongSubmissionFromTotals(totals: {
  waGrp: number;
  waPost: number;
  tgGrp: number;
  tgPost: number;
  fbGrp: number;
  fbPost: number;
  resLgn: number;
  accCln: number;
}) {
  const sum =
    totals.waGrp +
    totals.waPost +
    totals.tgGrp +
    totals.tgPost +
    totals.fbGrp +
    totals.fbPost +
    totals.resLgn +
    totals.accCln;

  return sum === 0;
}

function getCombinedStatus(totals: {
  approved: number;
  rejected: number;
  pending: number;
}) {
  if (totals.rejected > 0) return "REJECTED";
  if (totals.pending > 0) return "PENDING";
  if (totals.approved > 0) return "APPROVED";
  return "PENDING";
}

export default function GroupedAuditTable({ reports }: { reports: any[] }) {
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {}
  );

  const groupedReports = useMemo(() => {
    const dateMap = new Map<
      string,
      {
        dateKey: string;
        dateLabel: string;
        reports: any[];
        countries: {
          country: string;
          countryLabel: string;
          reports: any[];
          totals: ReturnType<typeof getTotals>;
          status: string;
          invalid: boolean;
        }[];
        totals: ReturnType<typeof getTotals>;
      }
    >();

    for (const report of reports) {
      const date = getReportDate(report);
      const dateKey = getDateKey(date);
      const dateLabel = getDateLabel(date);

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          dateKey,
          dateLabel,
          reports: [],
          countries: [],
          totals: getTotals([]),
        });
      }

      dateMap.get(dateKey)!.reports.push(report);
    }

    const dateGroups = Array.from(dateMap.values()).map((dateGroup) => {
      const countryMap = new Map<string, any[]>();

      for (const report of dateGroup.reports) {
        const country = report.country || "UNKNOWN";

        if (!countryMap.has(country)) {
          countryMap.set(country, []);
        }

        countryMap.get(country)!.push(report);
      }

      const countries = Array.from(countryMap.entries()).map(
        ([country, countryReports]) => {
          const totals = getTotals(countryReports);

          return {
            country,
            countryLabel: formatCountry(country),
            reports: countryReports,
            totals,
            status: getCombinedStatus(totals),
            invalid: isWrongSubmissionFromTotals(totals),
          };
        }
      );

      countries.sort((a, b) => a.countryLabel.localeCompare(b.countryLabel));

      const totals = getTotals(dateGroup.reports);

      return {
        ...dateGroup,
        countries,
        totals,
      };
    });

    dateGroups.sort(
      (a, b) =>
        new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime()
    );

    return dateGroups;
  }, [reports]);

  function toggleDate(dateKey: string) {
    setExpandedDates((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1400px] text-left">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--card)]/80">
            {[
              "",
              "Date / Country",
              "WA Grp",
              "WA Post",
              "TG Grp",
              "TG Post",
              "FB Grp",
              "FB Post",
              "Res Lgn",
              "Acc Cln",
              "Status",
            ].map((heading, index) => (
              <TableHead key={`${heading}-${index}`}>{heading}</TableHead>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--border)]/50">
          {groupedReports.length === 0 ? (
            <tr>
              <td
                colSpan={11}
                className="px-8 py-16 text-center font-bold text-[var(--muted-foreground)]"
              >
                No reports found.
              </td>
            </tr>
          ) : (
            groupedReports.map((dateGroup) => {
              const isExpanded = expandedDates[dateGroup.dateKey];

              return (
                <React.Fragment key={dateGroup.dateKey}>
                  <tr
                    onClick={() => toggleDate(dateGroup.dateKey)}
                    className="cursor-pointer bg-[var(--card)]/20 transition-colors duration-200 hover:bg-[var(--primary)]/5"
                  >
                    <td className="w-10 px-6 py-5 text-[var(--muted-foreground)]">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-[var(--primary)]" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </td>
                    <TableCell bold>
                      {dateGroup.dateLabel}
                      <span className="ml-2 text-[10px] font-normal text-[var(--muted-foreground)]">
                        ({dateGroup.reports.length} Reports •{" "}
                        {dateGroup.countries.length} Countries)
                      </span>
                    </TableCell>
                    <TableCell mono bold>
                      {dateGroup.totals.waGrp}
                    </TableCell>
                    <TableCell mono bold>
                      {dateGroup.totals.waPost}
                    </TableCell>
                    <TableCell mono bold>
                      {dateGroup.totals.tgGrp}
                    </TableCell>
                    <TableCell mono bold>
                      {dateGroup.totals.tgPost}
                    </TableCell>
                    <TableCell mono bold>
                      {dateGroup.totals.fbGrp}
                    </TableCell>
                    <TableCell mono bold>
                      {dateGroup.totals.fbPost}
                    </TableCell>
                    <TableCell mono bold>
                      {dateGroup.totals.resLgn}
                    </TableCell>
                    <TableCell mono bold>
                      {dateGroup.totals.accCln}
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                        Daily Aggregate
                      </span>
                    </TableCell>
                  </tr>

                  {isExpanded &&
                    dateGroup.countries.map((countryGroup) => (
                      <tr
                        key={`${dateGroup.dateKey}-${countryGroup.country}`}
                        className="border-l-4 border-l-[var(--primary)]/50 bg-[var(--background)] transition-colors hover:bg-[var(--card)]/40"
                      >
                        <td className="px-6 py-4" />
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--muted-foreground)]/50" />
                            <span>{countryGroup.countryLabel}</span>
                            <span className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                              {countryGroup.reports.length} Report
                              {countryGroup.reports.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        </td>
                        <TableCell mono>{countryGroup.totals.waGrp}</TableCell>
                        <TableCell mono>{countryGroup.totals.waPost}</TableCell>
                        <TableCell mono>{countryGroup.totals.tgGrp}</TableCell>
                        <TableCell mono>{countryGroup.totals.tgPost}</TableCell>
                        <TableCell mono>{countryGroup.totals.fbGrp}</TableCell>
                        <TableCell mono>{countryGroup.totals.fbPost}</TableCell>
                        <TableCell mono>{countryGroup.totals.resLgn}</TableCell>
                        <TableCell mono>{countryGroup.totals.accCln}</TableCell>
                        <TableCell>
                          {countryGroup.invalid ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-500">
                              <AlertOctagon className="h-3 w-3" />
                              Invalid
                            </span>
                          ) : (
                            <StatusBadge status={countryGroup.status} />
                          )}
                        </TableCell>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableHead({ children }: { children?: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
      {children}
    </th>
  );
}

function TableCell({
  children,
  mono,
  bold,
}: {
  children?: React.ReactNode;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <td
      className={`whitespace-nowrap px-6 py-5 text-sm ${
        mono ? "font-mono text-[var(--muted-foreground)]" : ""
      } ${bold ? "font-bold text-[var(--foreground)]" : ""}`}
    >
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isApp = status === "APPROVED";
  const isRej = status === "REJECTED";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
        isApp
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
          : isRej
          ? "border-red-500/20 bg-red-500/10 text-red-500"
          : "border-amber-500/20 bg-amber-500/10 text-amber-500"
      }`}
    >
      {isApp && <CheckCircle2 className="h-3 w-3" />}
      {isRej && <XCircle className="h-3 w-3" />}
      {!isApp && !isRej && <Clock className="h-3 w-3" />}
      {status}
    </span>
  );
}