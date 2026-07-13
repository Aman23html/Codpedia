import { getAttendanceHistory } from "@/actions/attendance/get-attendance-history";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  TimerReset,
  CalendarDays,
} from "lucide-react";

function getWindowEnd(checkIn: Date | string | null) {
  if (!checkIn) return "-";

  return new Date(
    new Date(checkIn).getTime() + 14 * 60 * 60 * 1000
  ).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDuration(checkIn: Date | string | null, checkOut: Date | string | null) {
  if (!checkIn) return "-";

  const start = new Date(checkIn).getTime();
  const end = checkOut ? new Date(checkOut).getTime() : Date.now();

  const diff = Math.max(0, end - start);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

function isWindowActive(checkIn: Date | string | null) {
  if (!checkIn) return false;

  const windowEnd = new Date(
    new Date(checkIn).getTime() + 24 * 60 * 60 * 1000
  );

  return new Date() <= windowEnd;
}

type AttendanceRecord = {
  id: string;
  attendanceDate: string | Date;
  checkIn: string | Date | null;
  checkOut: string | Date | null;
  status: "PRESENT" | "HALF_DAY" | "ABSENT";
};

export default async function AttendancePage() {
  const records: AttendanceRecord[] =
  await getAttendanceHistory();

  const totalDays = records.length;
  const presentDays = records.filter((record) => record.status === "PRESENT").length;
  const halfDays = records.filter((record) => record.status === "HALF_DAY").length;

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-32 pb-24 lg:px-12 max-w-[1400px] mx-auto space-y-10">
      <header className="rounded-[34px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[var(--primary)]">
              <Clock className="h-3.5 w-3.5" />
               Attendance Cycle
            </div>

            <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] lg:text-5xl">
              Attendance History
            </h1>

            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[var(--muted-foreground)]">
              Attendance is tracked from your check-in time.
              After that window ends, your next check-in starts a new attendance cycle.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <HeaderStat
              title="Total"
              value={totalDays}
              icon={CalendarDays}
              tone="blue"
            />

            <HeaderStat
              title="Present"
              value={presentDays}
              icon={CheckCircle2}
              tone="emerald"
            />

            <HeaderStat
              title="Half Day"
              value={halfDays}
              icon={AlertCircle}
              tone="amber"
            />
          </div>
        </div>
      </header>

      <section className="rounded-[28px] border border-[var(--primary)]/20 bg-[var(--primary)]/10 p-6">
        <div className="flex items-start gap-4">
          <TimerReset className="mt-1 h-6 w-6 text-[var(--primary)]" />

          <div>
            <h2 className="text-lg font-black text-[var(--foreground)]">
              Important Attendance Rule
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted-foreground)]">
              Your attendance and work submission window remains active for Given shift .
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 shadow-sm backdrop-blur-xl">
        <div className="border-b border-[var(--border)]/60 px-8 py-6">
          <h2 className="text-2xl font-black text-[var(--foreground)]">
            Attendance Ledger
          </h2>

          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            Check-in,  window end, checkout, duration and status history.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]/50">
                {[
                  "Cycle Date",
                  "Check In",
                  "Window Ends",
                  "Check Out",
                  "Duration",
                  "Window",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]/60">
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-8 py-16 text-center text-sm font-semibold text-[var(--muted-foreground)]"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const activeWindow = isWindowActive(record.checkIn);

                  return (
                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-[var(--background)]/60"
                    >
                      <td className="whitespace-nowrap px-8 py-6 font-bold text-[var(--foreground)]">
                        {new Date(record.attendanceDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td className="whitespace-nowrap px-8 py-6 font-mono text-sm text-[var(--muted-foreground)]">
                        {record.checkIn
                          ? new Date(record.checkIn).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>

                      <td className="whitespace-nowrap px-8 py-6 font-mono text-sm font-bold text-[var(--primary)]">
                        {getWindowEnd(record.checkIn)}
                      </td>

                      <td className="whitespace-nowrap px-8 py-6 font-mono text-sm text-[var(--muted-foreground)]">
                        {record.checkOut
                          ? new Date(record.checkOut).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>

                      <td className="whitespace-nowrap px-8 py-6 font-mono text-sm font-black text-[var(--foreground)]">
                        {getDuration(record.checkIn, record.checkOut)}
                      </td>

                      <td className="whitespace-nowrap px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                            activeWindow && !record.checkOut
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                              : "border-slate-500/20 bg-slate-500/10 text-slate-500"
                          }`}
                        >
                          {activeWindow && !record.checkOut ? "Active" : "Closed"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                            record.status === "PRESENT"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                              : "border-amber-500/20 bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {record.status === "PRESENT" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {record.status.replaceAll("_", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function HeaderStat({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  tone: "blue" | "emerald" | "amber";
}) {
  const styles = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 shadow-sm">
      <div className={`mb-3 inline-flex rounded-xl border p-2 ${styles[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-2xl font-black text-[var(--foreground)]">{value}</p>

      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
    </div>
  );
}