"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export function CountryCharts({ data }: { data: any[] }) {
  // Graceful fallback if data is empty or malformed
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[var(--muted-foreground)]">
        <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm font-medium">No trend data available for this timeframe.</p>
      </div>
    );
  }

  // Dynamically extract the top 3 countries from the data stream to use as our 3 data lines
  const allKeys = new Set<string>();
  data.forEach(d => Object.keys(d).forEach(k => k !== 'date' && allKeys.add(k)));
  const countries = Array.from(allKeys).slice(0, 3); 

  // Premium UI colors for the lines
  const styles = [
    { stroke: "#3B82F6", fill: "url(#colorBlue)" },    // Vercel Blue
    { stroke: "#10B981", fill: "url(#colorEmerald)" }, // Supabase Green
    { stroke: "#8B5CF6", fill: "url(#colorPurple)" },  // Stripe Purple
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="date" 
          stroke="#64748b" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          dy={10} 
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          dx={-10} 
        />
        
        <Tooltip 
          contentStyle={{ backgroundColor: '#060B14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }} 
          itemStyle={{ color: '#fff', fontWeight: 'bold' }}
        />
        
        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }} />
        
        {/* Render a line for up to 3 countries */}
        {countries.map((country, i) => (
          <Area 
            key={country}
            type="monotone" 
            name={country}
            dataKey={country} 
            stroke={styles[i]?.stroke || "#fff"} 
            fill={styles[i]?.fill || "#fff"} 
            strokeWidth={3}
            activeDot={{ r: 6, strokeWidth: 0, fill: styles[i]?.stroke || "#fff" }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}