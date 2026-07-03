import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function VerificationCard({
  status,
}: {
  status: string;
}) {
  const isVerified = status === "VERIFIED";
  const isMismatch =
    status === "MISMATCH" ||
    status === "CORRECTION_REQUIRED" ||
    status === "REJECTED";

  return (
    <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">
            Google Sheet Verification
          </h2>

          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Your submitted values will be verified against the synced operations sheet.
          </p>
        </div>

        <div
          className={`rounded-2xl p-4 ${
            isVerified
              ? "bg-emerald-500/10 text-emerald-500"
              : isMismatch
                ? "bg-red-500/10 text-red-500"
                : "bg-amber-500/10 text-amber-500"
          }`}
        >
          {isVerified ? (
            <ShieldCheck className="h-6 w-6" />
          ) : (
            <ShieldAlert className="h-6 w-6" />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center">
        {status === "DRAFT" ? (
          <>
            <p className="font-bold text-[var(--foreground)]">
              Submit report to start verification
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Google Sheet comparison starts only after submission.
            </p>
          </>
        ) : isVerified ? (
          <>
            <p className="font-bold text-emerald-500">
              Verified Successfully
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Employee submission matched Google Sheet records.
            </p>
          </>
        ) : isMismatch ? (
          <>
            <p className="font-bold text-red-500">
              Mismatch Found
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Please check manager remarks for correction details.
            </p>
          </>
        ) : (
          <>
            <p className="font-bold text-amber-500">
              Waiting for Google Sheet Sync
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Your report is locked and waiting for verification.
            </p>
          </>
        )}
      </div>
    </section>
  );
}