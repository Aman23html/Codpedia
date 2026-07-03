export type MarketingAnalyticsSearchParams = {
  search?: string | string[];
  status?: string | string[];
  country?: string | string[];
  platform?: string | string[];
  dateRange?: string | string[];
  from?: string | string[];
  to?: string | string[];
  minGroups?: string | string[];
  maxGroups?: string | string[];
  minPosts?: string | string[];
  maxPosts?: string | string[];
  minLogin?: string | string[];
  maxLogin?: string | string[];
  minClean?: string | string[];
  maxClean?: string | string[];
  sortBy?: string | string[];
  sortOrder?: string | string[];
};

function getValue(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function getNumber(value?: string | string[]) {
  const raw = getValue(value);
  const number = Number(raw);

  if (!raw) return undefined;
  if (!Number.isFinite(number)) return undefined;

  return number;
}

export function parseMarketingFilters(
  searchParams?: MarketingAnalyticsSearchParams
) {
  return {
    search: getValue(searchParams?.search),
    status: getValue(searchParams?.status),
    country: getValue(searchParams?.country),
    platform: getValue(searchParams?.platform),
    dateRange: getValue(searchParams?.dateRange) || "month",
    from: getValue(searchParams?.from),
    to: getValue(searchParams?.to),

    minGroups: getNumber(searchParams?.minGroups),
    maxGroups: getNumber(searchParams?.maxGroups),
    minPosts: getNumber(searchParams?.minPosts),
    maxPosts: getNumber(searchParams?.maxPosts),
    minLogin: getNumber(searchParams?.minLogin),
    maxLogin: getNumber(searchParams?.maxLogin),
    minClean: getNumber(searchParams?.minClean),
    maxClean: getNumber(searchParams?.maxClean),

    sortBy: getValue(searchParams?.sortBy) || "lastReportDate",
    sortOrder: getValue(searchParams?.sortOrder) || "desc",
  };
}

export function getMarketingDateRange(filters: {
  dateRange?: string;
  from?: string;
  to?: string;
}) {
  const now = new Date();

  let start: Date | undefined;
  let end: Date | undefined;

  if (filters.from) {
    start = new Date(filters.from);
    start.setHours(0, 0, 0, 0);
  }

  if (filters.to) {
    end = new Date(filters.to);
    end.setHours(23, 59, 59, 999);
  }

  if (!start && !end) {
    if (filters.dateRange === "today") {
      start = new Date();
      start.setHours(0, 0, 0, 0);

      end = new Date();
      end.setHours(23, 59, 59, 999);
    }

    if (filters.dateRange === "week") {
      start = new Date();
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    }

    if (filters.dateRange === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (filters.dateRange === "year") {
      start = new Date(now.getFullYear(), 0, 1);
    }
  }

  const dateFilter: any = {};

  if (start) dateFilter.gte = start;
  if (end) dateFilter.lte = end;

  return Object.keys(dateFilter).length > 0 ? dateFilter : undefined;
}