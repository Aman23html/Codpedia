export const Role = {
  OWNER: "OWNER",
  INCHARGE: "INCHARGE",
  EMPLOYEE: "EMPLOYEE",
} as const;

export const UserStatus = {
  PENDING_EMAIL: "PENDING_EMAIL",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;

export const DepartmentType = {
  MARKETING: "MARKETING",
  OPERATIONS: "OPERATIONS",
  TUTOR: "TUTOR",
  ACCOUNTS: "ACCOUNTS",
  DIGITAL_MARKETING: "DIGITAL_MARKETING",
} as const;

export const Country = {
  NORTH_AMERICA: "NORTH_AMERICA",
  EUROPE: "EUROPE",
  AUSTRALIA: "AUSTRALIA",
} as const;

export const ReportStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const AttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  HALF_DAY: "HALF_DAY",
  LEAVE: "LEAVE",
} as const;

export const LeaveStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const OperationReportStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  WAITING_FOR_SYNC: "WAITING_FOR_SYNC",
  VERIFIED: "VERIFIED",
  MISMATCH: "MISMATCH",
  CORRECTION_REQUIRED: "CORRECTION_REQUIRED",
  REJECTED: "REJECTED",
} as const;