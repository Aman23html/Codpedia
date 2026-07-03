import { prisma } from "@/lib/prisma";
import { DepartmentType } from "@prisma/client";

const DEPARTMENT_CODE_PREFIX: Record<DepartmentType, string> = {
  MARKETING: "MKT",
  OPERATIONS: "OPS",
  TUTOR: "TUT",
  ACCOUNTS: "ACC",
  DIGITAL_MARKETING: "DMK",
};

export async function generateEmployeeCode(departmentId: string) {
  const department = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
    select: {
      type: true,
    },
  });

  if (!department) {
    throw new Error("Department not found.");
  }

  const prefix = DEPARTMENT_CODE_PREFIX[department.type];

  if (!prefix) {
    throw new Error("Invalid department type.");
  }

  const codePrefix = `CPS-${prefix}-`;

  const lastUser = await prisma.user.findFirst({
    where: {
      employeeCode: {
        startsWith: codePrefix,
      },
    },
    orderBy: {
      employeeCode: "desc",
    },
    select: {
      employeeCode: true,
    },
  });

  let nextNumber = 1;

  if (lastUser?.employeeCode) {
    const lastNumber = Number(lastUser.employeeCode.split("-").pop());

    if (!Number.isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  const paddedNumber = String(nextNumber).padStart(3, "0");

  return `${codePrefix}${paddedNumber}`;
}