import { BadgeCheck, CalendarDays } from "lucide-react";

export default function OperationsHero({
  user,
  today,
  status,
}: {
  user: any;
  today: Date;
  status: string;
}) {
  const date = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/20 via-slate-900 to-purple-600/20 p-8 shadow-2xl">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blue-400">
            <BadgeCheck className="h-4 w-4" />
            Operations Workspace
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl">
            Good Morning, {user.fullName}
          </h1>

          <p className="mt-3 text-slate-400">
            Submit today's operations work and track verification status.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-slate-300">
              {user.department?.name} Department
            </span>

            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-slate-300">
              <CalendarDays className="h-4 w-4" />
              {date}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            Current Status
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            {status.replaceAll("_", " ")}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Today's report is not submitted yet.
          </p>
        </div>
      </div>
    </section>
  );
}