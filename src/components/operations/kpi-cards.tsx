import { FileText, Handshake, UserCheck, ShieldCheck } from "lucide-react";

export default function OperationsKpiCards({
  queriesGenerated,
  dealsDone,
  tutorAssigned,
  status,
}: {
  queriesGenerated: number;
  dealsDone: number;
  tutorAssigned: number;
  status: string;
}) {
  const cards = [
    {
      title: "Query Generated",
      value: queriesGenerated,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Deals Done",
      value: dealsDone,
      icon: Handshake,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Tutor Assigned",
      value: tutorAssigned,
      icon: UserCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Report Status",
      value: status.replaceAll("_", " "),
      icon: ShieldCheck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-[24px] border border-[var(--border)] bg-[var(--card)]/60 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                {card.title}
              </p>

              <div className={`rounded-xl p-3 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>

            <h3 className="mt-5 text-3xl font-black text-[var(--foreground)]">
              {card.value}
            </h3>
          </div>
        );
      })}
    </section>
  );
}