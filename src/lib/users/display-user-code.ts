export function displayUserCode(user: {
  id: string;
  employeeCode?: string | null;
}) {
  return user.employeeCode || "Not Generated";
}