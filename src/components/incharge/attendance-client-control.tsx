"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  Search, Download, Printer, MoreVertical, 
  Eye, Edit, ChevronLeft, ChevronRight 
} from "lucide-react";

// --- Types (you might want to move this to a shared types file) ---
type AttendanceRecord = {
  id: string;
  user: { fullName: string; employeeCode?: string; };
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: string;
};

// --- Helper to format time for CSV ---
const formatTimeForCSV = (date: Date | null) => date ? new Date(date).toLocaleTimeString('en-IN') : 'N/A';
const formatDateForCSV = (date: Date) => new Date(date).toLocaleDateString('en-IN');
const getWorkHoursForCSV = (checkIn: Date | null, checkOut: Date | null) => {
    if (!checkIn || !checkOut) return "0h 0m";
    const diff = checkOut.getTime() - checkIn.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    return `${hours}h ${minutes}m`;
}

// ===== 1. HEADER ACTIONS COMPONENT =====
export function AttendanceHeaderActions({ records }: { records: AttendanceRecord[] }) {

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const headers = ["Employee Code", "Full Name", "Date", "Status", "Check In", "Check Out", "Work Hours"];
    const csvRows = [
      headers.join(','),
      ...records.map(r => [
        r.user.employeeCode || r.id,
        `"${r.user.fullName}"`,
        formatDateForCSV(r.date),
        r.status,
        formatTimeForCSV(r.checkIn),
        formatTimeForCSV(r.checkOut),
        getWorkHoursForCSV(r.checkIn, r.checkOut)
      ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] transition-colors">
        <Printer className="w-4 h-4" /> Print
      </button>
      <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
        <Download className="w-4 h-4" /> Download Report
      </button>
    </div>
  );
}

// ===== 2. FILTERS COMPONENT =====
export function AttendanceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for debounced search
  const [inputValue, setInputValue] = useState(searchParams.get('query') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset page to 1 when filters change
      params.set('page', '1'); 
      return params.toString();
    },
    [searchParams]
  );

  // Debounce effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== (searchParams.get('query') || '')) {
         router.push(pathname + '?' + createQueryString('query', inputValue));
      }
    }, 300); // 300ms delay

    return () => clearTimeout(handler);
  }, [inputValue, pathname, router, createQueryString, searchParams]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(pathname + '?' + createQueryString(e.target.name, e.target.value));
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]/50">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by name or Employee ID..." 
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select 
          name="date"
          value={searchParams.get('date') || 'Today'}
          onChange={handleSelectChange}
          className="px-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] font-medium"
        >
          <option>Today</option>
          <option>Yesterday</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
        <select
          name="status"
          value={searchParams.get('status') || 'All Statuses'}
          onChange={handleSelectChange}
          className="px-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] font-medium"
        >
          <option>All Statuses</option>
          <option>PRESENT</option>
          <option>ABSENT</option>
          <option>LATE</option>
          <option>LEAVE</option>
          <option>HALF_DAY</option>
        </select>
      </div>
    </div>
  );
}

// ===== 3. PAGINATION COMPONENT =====
export function AttendancePagination({ currentPage, totalRecords, recordsPerPage }: { currentPage: number, totalRecords: number, recordsPerPage: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(pathname + '?' + params.toString());
  };
  
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--background)]/50">
      <p className="text-sm text-[var(--muted-foreground)] font-medium">
        Showing <strong className="text-[var(--foreground)]">{startRecord}-{endRecord}</strong> of <strong className="text-[var(--foreground)]">{totalRecords}</strong> records
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded-md hover:bg-[var(--border)] text-[var(--muted-foreground)] disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronLeft className="w-5 h-5"/>
        </button>
        {/* Simple pagination numbers for brevity. You can expand this logic. */}
        {[...Array(totalPages)].map((_, i) => (
          <button 
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md text-sm font-bold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-[var(--border)]'}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded-md hover:bg-[var(--border)] text-[var(--muted-foreground)] disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
}

// ===== 4. ROW ACTIONS COMPONENT =====
export function AttendanceRowActions({ recordId }: { recordId: string }) {
  const handleView = () => alert(`Viewing details for record: ${recordId}`);
  const handleEdit = () => alert(`Editing record: ${recordId}`);

  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={handleView} className="p-1.5 hover:bg-[var(--background)] rounded-md text-[var(--muted-foreground)] hover:text-blue-600 transition-colors" title="View Details">
        <Eye className="w-4 h-4" />
      </button>
      <button onClick={handleEdit} className="p-1.5 hover:bg-[var(--background)] rounded-md text-[var(--muted-foreground)] hover:text-blue-600 transition-colors" title="Edit Record">
        <Edit className="w-4 h-4" />
      </button>
      <button className="p-1.5 hover:bg-[var(--background)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
}