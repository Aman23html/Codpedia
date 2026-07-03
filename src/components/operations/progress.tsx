import { CheckCircle2, Clock3, AlertCircle } from "lucide-react";

const steps = [
  {
    key: "DRAFT",
    label: "Draft",
  },
  {
    key: "SUBMITTED",
    label: "Submitted",
  },
  {
    key: "REVIEW",
    label: "Incharge Review",
  },
];

function getStepIndex(status: string) {
  if (status === "DRAFT") return 0;

  if (status === "SUBMITTED") return 1;

  if (
    status === "APPROVED" ||
    status === "REJECTED" ||
    status === "CORRECTION_REQUIRED"
  ) {
    return 2;
  }

  return 0;
}

export default function OperationsProgress({ status }: { status: string }) {
  const currentIndex = getStepIndex(status);
  const hasIssue = status === "REJECTED" || status === "CORRECTION_REQUIRED";

  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-black text-[var(--foreground)]">
        Submission Progress
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const done = index <= currentIndex;

          return (
            <div
              key={step.key}
              className={`rounded-2xl border p-5 transition ${
                hasIssue && index === 2
                  ? "border-red-500/30 bg-red-500/10 text-red-500"
                  : done
                    ? "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
              }`}
            >
              <div className="mb-3">
                {hasIssue && index === 2 ? (
                  <AlertCircle className="h-5 w-5" />
                ) : done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Clock3 className="h-5 w-5" />
                )}
              </div>

              <p className="text-xs font-black uppercase tracking-widest">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}