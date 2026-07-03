import { MessageSquareText } from "lucide-react";

export default function ManagerRemarks({
  remarks,
}: {
  remarks: string;
}) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)]/60 p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[var(--foreground)]">
        <MessageSquareText className="h-5 w-5 text-blue-500" />
        Manager Remarks
      </h2>

      {remarks ? (
        <p className="text-sm text-[var(--foreground)]">
          {remarks}
        </p>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">
          No remarks yet.
        </p>
      )}
    </section>
  );
}