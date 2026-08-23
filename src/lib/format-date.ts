import { APP_TIME_ZONE } from "@/constants/attendance";

export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getDatePartsInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

export function startOfDayIST(date: Date = new Date()) {
  const { year, month, day } = getDatePartsInTimeZone(date, APP_TIME_ZONE);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - IST_OFFSET_MS);
}

export function endOfDayIST(date: Date = new Date()) {
  const { year, month, day } = getDatePartsInTimeZone(date, APP_TIME_ZONE);
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999) - IST_OFFSET_MS);
}

export function parseDateOnlyIST(value: string | Date) {
  if (value instanceof Date) return new Date(value);

  if (typeof value !== "string") return new Date(value);

  const match = /^\d{4}-\d{2}-\d{2}$/.exec(value);

  if (!match) return new Date(value);

  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - IST_OFFSET_MS);
}

export function formatTimeIST(date: Date | string | null | undefined) {
  if (!date) return "-";

  return new Date(date).toLocaleTimeString("en-IN", {
    timeZone: APP_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateIST(date: Date | string | null | undefined) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    timeZone: APP_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTimeIST(date: Date | string | null | undefined) {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    timeZone: APP_TIME_ZONE,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}