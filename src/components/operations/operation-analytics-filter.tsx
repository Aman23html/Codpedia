import Link from "next/link";

const filters = [
  {
    label: "Today",
    value: "TODAY",
  },
  {
    label: "7 Days",
    value: "7_DAYS",
  },
  {
    label: "30 Days",
    value: "30_DAYS",
  },
  {
    label: "All",
    value: "ALL",
  },
];

export default function OperationAnalyticsFilter({
  activeFilter,
}: {
  activeFilter: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const active = activeFilter === filter.value;

        return (
          <Link
            key={filter.value}
            href={`/employee/operations/analytics?filter=${filter.value}`}
            className={`rounded-xl border px-5 py-3 text-sm font-black transition ${
              active
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-[var(--card)]/40 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}