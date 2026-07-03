// src/lib/users/display-employee-id.ts

export function displayEmployeeId(user: {
  employeeCode?: string | null;
}) {
  return user.employeeCode || "Not Generated";
}