"use client";


import { ATTENDANCE_WINDOW_HOURS } from "@/constants/attendance";
import { formatTimeIST, formatDateTimeIST } from "@/lib/format-date";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { checkIn } from "@/actions/attendance/check-in";
import { checkOut } from "@/actions/attendance/check-out";
import Link from "next/link";
import {
  LogIn,
  LogOut,
  Clock,
  ArrowRight,
  Hourglass,
  TimerReset,
  AlertCircle,
} from "lucide-react";

function getWindowEnd(checkIn: Date) {
  const end = new Date(checkIn);
  end.setHours(end.getHours() + ATTENDANCE_WINDOW_HOURS);
  return end;
}

export function AttendanceCard({ attendance }: { attendance: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

function handleCheckIn() {
  startTransition(async () => {
    try {
      await checkIn();
      router.refresh();
    } catch (error) {
      console.error("CHECK IN ERROR:", error);
      alert(error instanceof Error ? error.message : "Check-in failed");
      router.refresh();
    }
  });
}

function handleCheckOut() {
  startTransition(async () => {
    try {
      await checkOut();
      router.refresh();
    } catch (error) {
      console.error("CHECK OUT ERROR:", error);
      alert(error instanceof Error ? error.message : "Check-out failed");
      router.refresh();
    }
  });
}

  let workingHours = "--h --m";
  let windowEndText = "--";
  let remainingText = "No active window";
  let isWindowActive = false;

  if (attendance?.checkIn) {
    const checkInDate = new Date(attendance.checkIn);
    const windowEnd = getWindowEnd(checkInDate);
    const now = new Date();

    isWindowActive = now <= windowEnd;

    const endTime = attendance.checkOut
      ? new Date(attendance.checkOut).getTime()
      : Date.now();

    const diff = Math.max(0, endTime - checkInDate.getTime());

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    workingHours = `${hours}h ${minutes}m`;

    windowEndText = windowEnd.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    const remaining = Math.max(0, windowEnd.getTime() - now.getTime());

    const remainingHours = Math.floor(remaining / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    remainingText = isWindowActive
      ? `${remainingHours}h ${remainingMinutes}m left`
      : "Window expired";
  }

  const isCheckedIn = !!attendance?.checkIn;
  const isCheckedOut = !!attendance?.checkOut;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl transition-all duration-300">
      <div
        className={`pointer-events-none absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl ${
          isCheckedIn && !isCheckedOut
            ? "bg-emerald-500/10"
            : "bg-[var(--primary)]/5"
        }`}
      />

      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-[var(--border)]/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-xl p-2.5 ${
              isCheckedIn && !isCheckedOut
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-[var(--primary)]/10 text-[var(--primary)]"
            }`}
          >
            <Clock className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tight text-[var(--foreground)]">
              Shift Telemetry
            </h3>

            <p className="mt-1 text-xs font-bold text-[var(--muted-foreground)]">
              Attendance window works for your given working hours.
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ${
            isCheckedOut
              ? "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
              : isCheckedIn
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                : "border-amber-500/20 bg-amber-500/10 text-amber-500"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isCheckedOut
                ? "bg-slate-400"
                : isCheckedIn
                  ? "animate-pulse bg-emerald-500"
                  : "bg-amber-500"
            }`}
          />

          {isCheckedOut
            ? "Shift Concluded"
            : isCheckedIn
              ? "Active 14h Window"
              : "Not Checked In"}
        </span>
      </div>

      <div className="relative z-10 mb-6 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <TimerReset className="mt-0.5 h-5 w-5 text-[var(--primary)]" />

            <div>
              <p className="text-sm font-black text-[var(--foreground)]">
                 Attendance Rule
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-[var(--muted-foreground)]">
                Your attendance and daily work can be updated only from check-in
                time until your working hours.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
              Window Status
            </p>

            <p className="mt-1 text-sm font-black text-[var(--foreground)]">
              {remainingText}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <TelemetryField
          label="Punch In"
          value={
            attendance?.checkIn
              ? formatTimeIST(attendance.checkIn)
              // new Date(attendance.checkIn).toLocaleTimeString("en-IN", {
              //     hour: "2-digit",
              //     minute: "2-digit",
              //   })
              : "--:--"
          }
        />

        <TelemetryField
          label="Punch Out"
          value={
            attendance?.checkOut
              ? formatTimeIST(attendance.checkOut)
              // new Date(attendance.checkOut).toLocaleTimeString("en-IN", {
              //     hour: "2-digit",
              //     minute: "2-digit",
              //   })
              : "--:--"
          }
        />

        <TelemetryField
          label="Duration"
          value={workingHours}
          isHighlight={isCheckedIn && !isCheckedOut}
        />

        <TelemetryField
          label="Window Ends"
          value={windowEndText}
          isHighlight={isWindowActive}
        />
      </div>

      {attendance?.checkIn && !isWindowActive && (
        <div className="relative z-10 mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-500">
          <AlertCircle className="mt-0.5 h-5 w-5" />

          <p className="text-sm font-bold">
            This attendance window has expired. Please start a new check-in
            cycle.
          </p>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-4 border-t border-[var(--border)]/40 pt-6 sm:flex-row">
        {!isCheckedIn ? (
          <button
            disabled={isPending}
            onClick={handleCheckIn}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <LogIn className="h-5 w-5" />
            Start Check-In
          </button>
        ) : !isCheckedOut && isWindowActive ? (
          <button
            disabled={isPending}
            onClick={handleCheckOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <LogOut className="h-5 w-5" />
            Conclude Shift
          </button>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 px-6 py-4 text-xs font-bold text-[var(--muted-foreground)] sm:w-auto sm:justify-start">
            <Hourglass className="h-4 w-4" />
            {isCheckedOut
              ? "This shift is concluded."
              : "Attendance window expired."}
          </div>
        )}

        <Link
          href="/employee/attendance"
          className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-6 py-4 text-xs font-black uppercase tracking-wider text-[var(--muted-foreground)] transition-all hover:border-[var(--primary)]/30 hover:text-[var(--foreground)] sm:ml-auto sm:w-auto"
        >
          View Ledger
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function TelemetryField({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-5 shadow-inner transition-colors ${
        isHighlight
          ? "border-[var(--primary)]/20 bg-[var(--primary)]/5"
          : "border-[var(--border)]/80 bg-[var(--background)]/60"
      }`}
    >
      <p
        className={`mb-2 text-[10px] font-black uppercase tracking-widest ${
          isHighlight
            ? "text-[var(--primary)]"
            : "text-[var(--muted-foreground)]"
        }`}
      >
        {label}
      </p>

      <p
        className={`font-mono text-2xl font-black tracking-tight ${
          isHighlight ? "text-[var(--primary)]" : "text-[var(--foreground)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}