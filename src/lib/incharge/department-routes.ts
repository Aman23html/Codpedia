import { DepartmentType } from "@prisma/client";

export function getInchargeDepartmentRoutes(department: DepartmentType) {
  switch (department) {
    case DepartmentType.OPERATIONS:
      return {
        reportLabel: "Operations Reports",
        analyticsLabel: "Operations Analytics",
        reportsHref: "/incharge/operations/reports",
        analyticsHref: "/incharge/operations/analytics",
        queueTitle: "Operations Submission Queue",
        actionTitle: "Operations Reports",
      };

    case DepartmentType.ACCOUNTS:
      return {
        reportLabel: "Accounts Reports",
        analyticsLabel: "Accounts Analytics",
        reportsHref: "/incharge/accounts/reports",
        analyticsHref: "/incharge/accounts/analytics",
        queueTitle: "Accounts Submission Queue",
        actionTitle: "Accounts Reports",
      };

    case DepartmentType.TUTOR:
      return {
        reportLabel: "Tutor Reports",
        analyticsLabel: "Tutor Analytics",
        reportsHref: "/incharge/tutor/reports",
        analyticsHref: "/incharge/tutor/analytics",
        queueTitle: "Tutor Submission Queue",
        actionTitle: "Tutor Reports",
      };

    case DepartmentType.DIGITAL_MARKETING:
      return {
        reportLabel: "Digital Reports",
        analyticsLabel: "Digital Analytics",
        reportsHref: "/incharge/digital-marketing/reports",
        analyticsHref: "/incharge/digital-marketing/analytics",
        queueTitle: "Digital Marketing Queue",
        actionTitle: "Digital Reports",
      };

    case DepartmentType.MARKETING:
    default:
      return {
        reportLabel: "Marketing Reports",
        analyticsLabel: "Marketing Analytics",
        reportsHref: "/incharge/reports",
        analyticsHref: "/incharge/analytics",
        queueTitle: "Marketing Audit Queue",
        actionTitle: "Marketing Reports",
      };
  }
}