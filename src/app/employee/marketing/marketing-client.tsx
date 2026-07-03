"use client";

import { useCallback, useState, useTransition } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Database,
  Eraser,
  KeyRound,
  Loader2,
  Lock,
  Megaphone,
  Save,
  ShieldAlert,
  TimerReset,
  TrendingUp,
} from "lucide-react";

import CountryReportCard from "@/components/marketing/country-report-card";
import { saveMarketingReport } from "@/actions/marketing/save-report";

type Region = "NORTH_AMERICA" | "EUROPE" | "AUSTRALIA";

interface MarketingClientProps {
  initialReports: any[];
  regions: readonly Region[];
  canSubmitWork: boolean;
  attendanceInfo: {
    checkIn: string | null;
    checkOut: string | null;
    windowEnd: string | null;
    remainingText: string;
  };
}

function formatDateTime(value: string | null) {
  if (!value) return "--";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MarketingClient({
  initialReports,
  regions,
  canSubmitWork,
  attendanceInfo,
}: MarketingClientProps) {
  const [isPending, startTransition] = useTransition();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [reportsData, setReportsData] = useState<Record<Region, any>>(() => {
    const initialState = {} as Record<Region, any>;

    regions.forEach((region) => {
      initialState[region] =
        initialReports.find((report) => report.country === region) || {
          whatsappGroupsJoined: 0,
          whatsappPostsDone: 0,
          telegramGroupsJoined: 0,
          telegramPostsDone: 0,
          facebookGroupsJoined: 0,
          facebookPostsDone: 0,
        };
    });

    return initialState;
  });

  const [resourceLogin, setResourceLogin] = useState<number>(() => {
    const found = initialReports.find(
      (report) => report.resourceLogin !== undefined
    );

    return found ? found.resourceLogin : 0;
  });

  const [accountClean, setAccountClean] = useState<number>(() => {
    const found = initialReports.find(
      (report) => report.accountClean !== undefined
    );

    return found ? found.accountClean : 0;
  });

  const handleRegionChange = useCallback(
    (region: Region, newData: any) => {
      if (!canSubmitWork) return;

      setReportsData((prev) => ({
        ...prev,
        [region]: newData,
      }));

      setHasUnsavedChanges(true);
      setSaveStatus("idle");
    },
    [canSubmitWork]
  );

  const totalGroups = regions.reduce((sum, region) => {
    const data = reportsData[region];

    return (
      sum +
      Number(data.whatsappGroupsJoined ?? 0) +
      Number(data.telegramGroupsJoined ?? 0) +
      Number(data.facebookGroupsJoined ?? 0)
    );
  }, 0);

  const totalPosts = regions.reduce((sum, region) => {
    const data = reportsData[region];

    return (
      sum +
      Number(data.whatsappPostsDone ?? 0) +
      Number(data.telegramPostsDone ?? 0) +
      Number(data.facebookPostsDone ?? 0)
    );
  }, 0);

  function handleGlobalSave() {
    if (!canSubmitWork) {
      setSaveStatus("error");
      setFeedbackMessage(
        "Please check in first. Marketing workspace is locked."
      );
      return;
    }

    setSaveStatus("idle");

    startTransition(async () => {
      try {
        const savePromises = regions.map((region) => {
          const regionData = reportsData[region];

          return saveMarketingReport({
            country: region,

            whatsappGroupsJoined: Number(
              regionData.whatsappGroupsJoined ?? 0
            ),
            whatsappPostsDone: Number(regionData.whatsappPostsDone ?? 0),

            telegramGroupsJoined: Number(
              regionData.telegramGroupsJoined ?? 0
            ),
            telegramPostsDone: Number(regionData.telegramPostsDone ?? 0),

            facebookGroupsJoined: Number(
              regionData.facebookGroupsJoined ?? 0
            ),
            facebookPostsDone: Number(regionData.facebookPostsDone ?? 0),

            resourceLogin: Number(resourceLogin ?? 0),
            accountClean: Number(accountClean ?? 0),
          });
        });

        await Promise.all(savePromises);

        setSaveStatus("success");
        setHasUnsavedChanges(false);
        setFeedbackMessage("Marketing work synchronized successfully.");

        setTimeout(() => {
          setSaveStatus("idle");
        }, 4000);
      } catch (error: any) {
        setSaveStatus("error");
        setFeedbackMessage(error.message || "Failed to save marketing work.");
      }
    });
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] px-6 pt-32 pb-32 text-[var(--foreground)] lg:px-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/5 blur-[128px]" />
        <div className="absolute right-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[128px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-10">
        <header className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 p-8 shadow-sm backdrop-blur-xl lg:p-10">
          <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[380px] w-[380px] rounded-full bg-[var(--primary)]/10 blur-[90px]" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
                <Megaphone className="h-3.5 w-3.5" />
                Marketing Workspace
              </div>

              <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-5xl">
                Regional Marketing Submission
              </h1>

              <p className="max-w-3xl text-base font-medium leading-7 text-[var(--muted-foreground)]">
                Submit WhatsApp, Telegram, Facebook, resource login, and account
                cleaning work only inside your active 24-hour attendance window.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <HeaderMetric
                title="Workspace"
                value={canSubmitWork ? "Unlocked" : "Locked"}
                icon={canSubmitWork ? CheckCircle2 : Lock}
                tone={canSubmitWork ? "emerald" : "red"}
              />

              <HeaderMetric
                title="Groups"
                value={totalGroups}
                icon={BarChart3}
                tone="blue"
              />

              <HeaderMetric
                title="Posts"
                value={totalPosts}
                icon={TrendingUp}
                tone="purple"
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
                    ? "Marketing submission is unlocked"
                    : "Marketing submission is locked"}
                </h2>

                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[var(--muted-foreground)]">
                  {canSubmitWork
                    ? `You can update marketing work until ${formatDateTime(
                        attendanceInfo.windowEnd
                      )}.`
                    : "Please check in first. Marketing work can only be filled during the active 24-hour attendance window."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <WindowBox
                label="Check In"
                value={formatDateTime(attendanceInfo.checkIn)}
              />

              <WindowBox
                label="Window Ends"
                value={formatDateTime(attendanceInfo.windowEnd)}
              />

              <WindowBox
                label="Remaining"
                value={attendanceInfo.remainingText}
              />
            </div>
          </div>
        </section>

        {!canSubmitWork && (
          <section className="rounded-[30px] border border-red-500/20 bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <Lock className="mt-1 h-6 w-6 text-red-500" />

              <div>
                <h2 className="text-xl font-black text-[var(--foreground)]">
                  Check-in required before filling marketing work
                </h2>

                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted-foreground)]">
                  Your daily marketing workspace opens only after attendance
                  check-in and remains active for exactly 24 hours from check-in
                  time. After that, a new cycle starts from the next check-in.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {regions.map((region) => (
            <div
              key={region}
              className={`group relative h-full ${
                !canSubmitWork ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <div className="absolute -inset-px rounded-[32px] bg-gradient-to-b from-[var(--primary)]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <CountryReportCard
                country={region}
                data={reportsData[region]}
                onChange={(newData: any) =>
                  handleRegionChange(region, newData)
                }
              />

              {!canSubmitWork && (
                <div className="absolute inset-0 flex items-center justify-center rounded-[32px] bg-[var(--background)]/50 backdrop-blur-[2px]">
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-red-500">
                    Locked
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        <section
          className={`rounded-[30px] border border-[var(--border)] bg-[var(--card)]/40 p-7 shadow-sm backdrop-blur-xl ${
            !canSubmitWork ? "opacity-60" : ""
          }`}
        >
          <div className="mb-6 border-b border-[var(--border)] pb-5">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[var(--foreground)]">
              <ShieldAlert className="h-4 w-4 text-[var(--primary)]" />
              Shared Marketing Utilities
            </h3>

            <p className="mt-2 text-xs font-semibold text-[var(--muted-foreground)]">
              Resource login and account clean values are applied with your
              regional marketing submission.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <UtilityInput
              label="Resource Login"
              value={resourceLogin}
              icon={KeyRound}
              disabled={!canSubmitWork}
              onChange={(value) => {
                setResourceLogin(value);
                setHasUnsavedChanges(true);
                setSaveStatus("idle");
              }}
            />

            <UtilityInput
              label="Account Clean"
              value={accountClean}
              icon={Eraser}
              disabled={!canSubmitWork}
              onChange={(value) => {
                setAccountClean(value);
                setHasUnsavedChanges(true);
                setSaveStatus("idle");
              }}
            />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-4">
          <MetricBlock
            label="Countries"
            value={String(regions.length)}
            icon={Database}
          />

          <MetricBlock
            label="Total Groups"
            value={String(totalGroups)}
            icon={BarChart3}
          />

          <MetricBlock
            label="Total Posts"
            value={String(totalPosts)}
            icon={TrendingUp}
          />

          <MetricBlock label="Window Rule" value="24H" icon={TimerReset} />
        </section>
      </div>

      <div
        className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          hasUnsavedChanges || saveStatus !== "idle"
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-20 scale-90 opacity-0"
        }`}
      >
        <div className="flex items-center gap-6 rounded-full border border-[var(--border)] bg-[var(--foreground)] px-5 py-3 text-[var(--background)] shadow-2xl">
          <div className="flex items-center gap-2.5 pl-1">
            {saveStatus === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : saveStatus === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            )}

            <span className="whitespace-nowrap text-xs font-semibold">
              {saveStatus === "error"
                ? feedbackMessage
                : saveStatus === "success"
                  ? feedbackMessage
                  : canSubmitWork
                    ? "Unsaved marketing work detected"
                    : "Workspace locked"}
            </span>
          </div>

          {saveStatus !== "success" && (
            <button
              onClick={handleGlobalSave}
              disabled={isPending || !canSubmitWork}
              className="flex items-center gap-2 rounded-full bg-[var(--background)] px-4 py-2 text-xs font-bold text-[var(--foreground)] transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : canSubmitWork ? (
                <Save className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}

              {isPending
                ? "Saving..."
                : canSubmitWork
                  ? "Commit Changes"
                  : "Locked"}
            </button>
          )}
        </div>
      </div>
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
  value: string | number;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "red" | "purple";
}) {
  const styles = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    red: "border-red-500/20 bg-red-500/10 text-red-500",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="min-w-[135px] rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className={`rounded-xl border p-2 ${styles[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          Live
        </span>
      </div>

      <p className="text-2xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}

function WindowBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function UtilityInput({
  label,
  value,
  icon: Icon,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-5 shadow-inner transition focus-within:border-[var(--primary)]/50">
      <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
          {label}
        </label>

        <input
          type="number"
          min={0}
          disabled={disabled}
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full bg-transparent p-0 text-lg font-black text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]/30 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

function MetricBlock({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-5 w-fit rounded-2xl bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-3xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </p>
    </div>
  );
}