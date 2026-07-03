export const ATTENDANCE_WINDOW_HOURS = 24;

export function getAttendanceWindowEnd(checkIn: Date) {
  const end = new Date(checkIn);
  end.setHours(end.getHours() + ATTENDANCE_WINDOW_HOURS);
  return end;
}

export function isAttendanceWindowActive(checkIn: Date) {
  const now = new Date();
  const windowEnd = getAttendanceWindowEnd(checkIn);

  return now <= windowEnd;
}

export function getAttendanceDateFromCheckIn(checkIn: Date) {
  const date = new Date(checkIn);
  date.setHours(0, 0, 0, 0);
  return date;
}