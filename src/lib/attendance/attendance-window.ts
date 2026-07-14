import { ATTENDANCE_WINDOW_HOURS } from "@/constants/attendance";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function getAttendanceDateFromCheckIn(checkIn: Date) {
  const utcTime = checkIn.getTime();

  const istDate = new Date(utcTime + IST_OFFSET_MS);

  istDate.setUTCHours(0, 0, 0, 0);

  return new Date(istDate.getTime() - IST_OFFSET_MS);
}

export function getAttendanceWindowEnd(checkIn: Date | string) {
  const windowEnd = new Date(checkIn);
  windowEnd.setHours(windowEnd.getHours() + ATTENDANCE_WINDOW_HOURS);
  return windowEnd;
}