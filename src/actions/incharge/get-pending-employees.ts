"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/current-user";
import { User } from "@/models/User";
import { VerificationDocument } from "@/models/VerificationDocument";
import { Role, UserStatus } from "@/constants/enums";

export async function getPendingEmployees() {
  await connectDB();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== Role.INCHARGE) {
    throw new Error("Unauthorized");
  }

  const employees: any[] = await User.find({
    department: currentUser.departmentId,
    role: Role.EMPLOYEE,
    status: UserStatus.PENDING_APPROVAL,
  })
    .populate({
      path: "department",
      select: "name type departmentCode shortCode",
    })
    .sort({
      createdAt: -1,
    })
    .lean();

  const employeeIds = employees.map((employee: any) => employee._id);

  const documents = await VerificationDocument.find({
    user: {
      $in: employeeIds,
    },
  }).lean();

  const documentMap = new Map(
    documents.map((doc: any) => [doc.user.toString(), doc])
  );

  const result = employees.map((employee: any) => ({
    ...employee,
    id: employee._id.toString(),
    documents: documentMap.get(employee._id.toString())
      ? [documentMap.get(employee._id.toString())]
      : [],
  }));

  return JSON.parse(JSON.stringify(result));
}