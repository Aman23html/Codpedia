import { DepartmentType } from "@prisma/client";

export function getEmployeeWorkspace(department?: DepartmentType | null) {
  switch (department) {
    case DepartmentType.OPERATIONS:
      return {
        badge: "Operations Center",
        focus: "Submit Operations Report",
        reportHref: "/employee/operations",
        reportTitle: "Submit Operations Report",
      };

    case DepartmentType.MARKETING:
      return {
        badge: "Marketing Center",
        focus: "Submit Marketing Report",
        reportHref: "/employee/marketing",
        reportTitle: "Submit Marketing Report",
      };

    case DepartmentType.ACCOUNTS:
      return {
        badge: "Accounts Center",
        focus: "Submit Accounts Report",
        reportHref: "/employee/accounts",
        reportTitle: "Submit Accounts Report",
      };

    case DepartmentType.TUTOR:
      return {
        badge: "Tutor Center",
        focus: "Submit Tutor Report",
        reportHref: "/employee/tutor",
        reportTitle: "Submit Tutor Report",
      };

    case DepartmentType.DIGITAL_MARKETING:
      return {
        badge: "Digital Marketing Center",
        focus: "Submit Digital Marketing Report",
        reportHref: "/employee/digital-marketing",
        reportTitle: "Submit Digital Report",
      };

    default:
      return {
        badge: "Employee Center",
        focus: "Submit Daily Report",
        reportHref: "/employee",
        reportTitle: "Daily Report",
      };
  }
}