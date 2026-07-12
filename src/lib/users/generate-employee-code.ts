import { connectDB } from "@/lib/mongodb";
import { Department } from "@/models/Department";
import { User } from "@/models/User";
import { COMPANY_CONFIG } from "@/constants/company";

export async function generateEmployeeCode(departmentId: string) {
  await connectDB();

  const department = await Department.findById(departmentId)
    .select("shortCode")
    .lean();

  if (!department) {
    throw new Error("Department not found.");
  }

  const codePrefix = `${COMPANY_CONFIG.COMPANY_CODE}-${department.shortCode}-${COMPANY_CONFIG.EMPLOYEE_CODE_PREFIX}-`;

  const lastUser = await User.findOne({
    employeeCode: {
      $regex: `^${codePrefix}`,
    },
  })
    .sort({
      employeeCode: -1,
    })
    .select("employeeCode")
    .lean();

  let nextNumber = 1;

  if (lastUser?.employeeCode) {
    const lastNumber = Number(lastUser.employeeCode.split("-").pop());

    if (!Number.isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  const paddedNumber = String(nextNumber).padStart(
    COMPANY_CONFIG.EMPLOYEE_NUMBER_LENGTH,
    "0"
  );

  return `${codePrefix}${paddedNumber}`;
}