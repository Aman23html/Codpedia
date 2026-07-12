"use server";

import { getCurrentUser } from "@/lib/current-user";
import { getPendingReports } from "@/actions/marketing/get-pending-reports";
import { getPendingOperationReports } from "@/actions/operations/get-pending-operation-reports";
import { DepartmentType, Role } from "@/constants/enums";

export async function getDepartmentPendingReports() {
  const user = await getCurrentUser();

  if (!user || user.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  if (!user.department) {
    return [];
  }

  switch (user.department.type) {
    case DepartmentType.MARKETING:
      return getPendingReports();

    case DepartmentType.OPERATIONS:
      return getPendingOperationReports();

    default:
      return [];
  }
}