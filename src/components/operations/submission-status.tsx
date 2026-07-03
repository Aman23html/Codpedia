import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default function SubmissionStatus({
  status,
  submittedAt,
}: {
  status: string;
  submittedAt: string | null;
}) {
  const config = getStatusConfig(status);

  const Icon = config.icon;

  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-sm backdrop-blur-xl">
      <h2 className="mb-4 text-lg font-black text-[var(--foreground)]">
        Submission Status
      </h2>

      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-3 ${config.bg} ${config.text}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className={`font-bold ${config.text}`}>
            {config.label}
          </p>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {submittedAt
              ? `Submitted at ${submittedAt}`
              : "Your operations report is still in draft mode."}
          </p>
        </div>
      </div>
    </section>
  );
}

function getStatusConfig(status: string) {
  switch (status) {
    case "SUBMITTED":
      return {
        label: "Submitted for Incharge Review",
        bg: "bg-blue-500/10",
        text: "text-blue-500",
        icon: Clock3,
      };

    case "APPROVED":
      return {
        label: "Approved by Incharge",
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        icon: CheckCircle2,
      };

    case "REJECTED":
      return {
        label: "Rejected by Incharge",
        bg: "bg-red-500/10",
        text: "text-red-500",
        icon: XCircle,
      };

    case "CORRECTION_REQUIRED":
      return {
        label: "Correction Required",
        bg: "bg-amber-500/10",
        text: "text-amber-500",
        icon: AlertCircle,
      };

    default:
      return {
        label: "Draft",
        bg: "bg-slate-500/10",
        text: "text-[var(--muted-foreground)]",
        icon: Clock3,
      };
  }
}