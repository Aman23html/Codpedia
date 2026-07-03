"use client";

import { CheckCircle2, XCircle, Clock, Globe } from "lucide-react";

type Props = {
  country: "NORTH_AMERICA" | "EUROPE" | "AUSTRALIA";
  data: any;
  onChange: (updatedData: any) => void;
};

export default function CountryReportCard({ country, data, onChange }: Props) {
  const status = data?.status ?? "PENDING";

  // Unified change handler that reports back to the parent MarketingClient
  const handleChange = (field: string, value: number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="flex flex-col h-full rounded-[32px] border border-[var(--border)]/50 bg-[var(--card)]/20 backdrop-blur-xl p-6 lg:p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:border-[var(--primary)]/30 group">
      
      {/* HEADER SECTION */}
      <div className="mb-6 flex items-center justify-between border-b border-[var(--border)]/60 pb-6">
        <h2 className="text-lg lg:text-xl font-extrabold flex items-center gap-3 tracking-tight text-[var(--foreground)]">
          <div className="p-2.5 bg-[var(--primary)]/10 rounded-xl border border-[var(--primary)]/20 text-[var(--primary)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white">
            <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          {country.replaceAll("_", " ")}
        </h2>
        <StatusBadge status={status} />
      </div>

      {/* METADATA PLATFORM */}
      {data?.updatedAt && (
        <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-[var(--background)]/60 p-4 border border-[var(--border)]/50 text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest shadow-inner">
          <div className="flex justify-between items-center">
            <span>Last Sync</span>
            <span className="text-[var(--foreground)] bg-[var(--card)] px-2.5 py-1 rounded-md border border-[var(--border)] shadow-sm">
              {new Date(data.updatedAt).toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
})}
            </span>
          </div>
          {data.remarks && (
            <div className="text-amber-500 pt-3 border-t border-[var(--border)]/50">
              Remarks: {data.remarks}
            </div>
          )}
        </div>
      )}

      {/* METRICS INPUT FIELDS */}
      <div className="space-y-6 flex-1">
        <Section 
          title="WhatsApp" 
          groups={data?.whatsappGroupsJoined || 0} 
          posts={data?.whatsappPostsDone || 0} 
          onGroupsChange={(val: number) => handleChange("whatsappGroupsJoined", val)}
          onPostsChange={(val: number) => handleChange("whatsappPostsDone", val)}
        />
        <Section 
          title="Telegram" 
          groups={data?.telegramGroupsJoined || 0} 
          posts={data?.telegramPostsDone || 0} 
          onGroupsChange={(val: number) => handleChange("telegramGroupsJoined", val)}
          onPostsChange={(val: number) => handleChange("telegramPostsDone", val)}
        />
        <Section 
          title="Facebook" 
          groups={data?.facebookGroupsJoined || 0} 
          posts={data?.facebookPostsDone || 0} 
          onGroupsChange={(val: number) => handleChange("facebookGroupsJoined", val)}
          onPostsChange={(val: number) => handleChange("facebookPostsDone", val)}
        />
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────────

function Section({ title, groups, posts, onGroupsChange, onPostsChange }: any) {
  return (
    <div className="space-y-3 p-4 rounded-2xl bg-[var(--background)]/30 border border-[var(--border)]/30 transition-colors hover:bg-[var(--background)]/60">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50" />
        {title} Activity
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Groups" value={groups} onChange={onGroupsChange} />
        <InputField label="Posts" value={posts} onChange={onPostsChange} />
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div className="group/input">
      <label className="mb-1.5 block text-[10px] font-bold uppercase text-[var(--muted-foreground)] tracking-widest group-focus-within/input:text-[var(--primary)] transition-colors">
        {label}
      </label>
      <input
        type="number"
        value={value === 0 ? "" : value} // UX trick: Don't show '0' to make typing faster
        placeholder="0"
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-[var(--border)]/60 bg-[var(--background)] px-4 py-2.5 font-black text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/30 focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] outline-none transition-all shadow-inner hover:border-[var(--border)]"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  };
  
  const style = configs[status as keyof typeof configs] || configs.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${style} shadow-sm`}>
      {status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
      {status === "REJECTED" && <XCircle className="w-3 h-3" />}
      {status === "PENDING" && <Clock className="w-3 h-3 animate-pulse" />}
      {status}
    </span>
  );
}