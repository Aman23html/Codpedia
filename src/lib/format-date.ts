import { APP_TIME_ZONE } from "@/constants/attendance";

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

export function formatDateTimeFullIST(date: Date | string | null | undefined) {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    timeZone: APP_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}