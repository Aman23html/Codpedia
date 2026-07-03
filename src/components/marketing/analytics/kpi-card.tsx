type Props = {
  title: string;
  value: number;
};

export default function KpiCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white">
        {value}
      </h2>
    </div>
  );
}