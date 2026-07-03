const activities = [
  {
    title: "Workspace Opened",
    time: "Today",
  },
  {
    title: "Draft Pending",
    time: "Not submitted",
  },
];

export default function ActivityTimeline() {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)]/60 p-6">
      <h2 className="mb-5 text-lg font-black text-[var(--foreground)]">
        Activity Timeline
      </h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />

            <div>
              <p className="text-sm font-bold text-[var(--foreground)]">
                {activity.title}
              </p>

              <p className="text-xs text-[var(--muted-foreground)]">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}