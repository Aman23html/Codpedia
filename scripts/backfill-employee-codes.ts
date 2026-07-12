import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Department } from "@/models/Department";
import { COMPANY_CONFIG } from "@/constants/company";

function getNumberFromCode(code: string | null | undefined) {
  if (!code) return 0;

  const lastPart = code.split("-").pop();
  const number = Number(lastPart);

  return Number.isNaN(number) ? 0 : number;
}

async function main() {
  await connectDB();

  const users: any[] = await User.find({
    $or: [
      { employeeCode: null },
      { employeeCode: { $exists: false } },
      { employeeCode: "" },
    ],
  })
    .populate({
      path: "department",
      select: "name type shortCode departmentCode",
    })
    .sort({
      createdAt: 1,
    });

  if (users.length === 0) {
    console.log("No users found without employee code.");
    process.exit(0);
  }

  console.log(`Found ${users.length} users without employee code.`);

  const counters: Record<string, number> = {};

  for (const user of users) {
    if (!user.department) {
      console.log(`Skipped ${user.fullName}: No department found`);
      continue;
    }

    const department = await Department.findById(user.department._id).lean();

    if (!department) {
      console.log(`Skipped ${user.fullName}: Department not found`);
      continue;
    }

    const shortCode = department.shortCode;

    if (!shortCode) {
      console.log(`Skipped ${user.fullName}: Department shortCode missing`);
      continue;
    }

    const codePrefix = `${COMPANY_CONFIG.COMPANY_CODE}-${shortCode}-${COMPANY_CONFIG.EMPLOYEE_CODE_PREFIX}-`;

    if (!counters[codePrefix]) {
      const existingUsers = await User.find({
        employeeCode: {
          $regex: `^${codePrefix}`,
        },
      })
        .select("employeeCode")
        .lean();

      const highestNumber = existingUsers.reduce((highest: number, item: any) => {
        const currentNumber = getNumberFromCode(item.employeeCode);
        return currentNumber > highest ? currentNumber : highest;
      }, 0);

      counters[codePrefix] = highestNumber + 1;
    }

    let employeeCode = `${codePrefix}${String(counters[codePrefix]).padStart(
      COMPANY_CONFIG.EMPLOYEE_NUMBER_LENGTH,
      "0"
    )}`;

    while (
      await User.findOne({
        employeeCode,
      })
        .select("_id")
        .lean()
    ) {
      counters[codePrefix] += 1;

      employeeCode = `${codePrefix}${String(counters[codePrefix]).padStart(
        COMPANY_CONFIG.EMPLOYEE_NUMBER_LENGTH,
        "0"
      )}`;
    }

    await User.findByIdAndUpdate(user._id, {
      employeeCode,
    });

    console.log(`${user.fullName} → ${employeeCode}`);

    counters[codePrefix] += 1;
  }

  console.log("Employee code backfill completed successfully.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Backfill failed:", error);
  process.exit(1);
});