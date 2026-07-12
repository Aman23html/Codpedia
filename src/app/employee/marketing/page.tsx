import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import { getTodayAttendance } from "@/actions/attendance/get-today-attendance";
import { getTodayReports } from "@/actions/marketing/get-today-reports";
import MarketingClient from "./marketing-client";

import { DepartmentType, Role } from "@/constants/enums";

function getWindowInfo(checkIn?: Date | string | null) {
  if (!checkIn) {
    return {
      isActive: false,
      windowEnd: null,
      remainingText: "No Check-In",
    };
  }

  const now = new Date();

  const windowEnd = new Date(checkIn);
  windowEnd.setHours(windowEnd.getHours() + 24);

  const diff = Math.max(0, windowEnd.getTime() - now.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const isActive = now <= windowEnd;

  return {
    isActive,
    windowEnd,
    remainingText: isActive ? `${hours}h ${minutes}m left` : "Expired",
  };
}

export default async function MarketingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== Role.EMPLOYEE) {
    redirect("/unauthorized");
  }

  if (!user.department || user.department.type !== DepartmentType.MARKETING) {
    redirect("/employee");
  }

  const [attendance, reports] = await Promise.all([
    getTodayAttendance(),
    getTodayReports(),
  ]);

  const windowInfo = getWindowInfo(attendance?.checkIn);

  const regions = ["NORTH_AMERICA", "EUROPE", "AUSTRALIA"] as const;

  return (
    <MarketingClient
      initialReports={reports}
      regions={regions}
      canSubmitWork={windowInfo.isActive}
      attendanceInfo={{
        checkIn: attendance?.checkIn
          ? new Date(attendance.checkIn).toISOString()
          : null,
        checkOut: attendance?.checkOut
          ? new Date(attendance.checkOut).toISOString()
          : null,
        windowEnd: windowInfo.windowEnd
          ? windowInfo.windowEnd.toISOString()
          : null,
        remainingText: windowInfo.remainingText,
      }}
    />
  );
}