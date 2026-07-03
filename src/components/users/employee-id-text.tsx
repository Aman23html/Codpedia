export function EmployeeIdText({
  user,
  fallback = "Not Generated",
}: {
  user: {
    employeeCode?: string | null;
  };
  fallback?: string;
}) {
  return <>{user.employeeCode || fallback}</>;
}