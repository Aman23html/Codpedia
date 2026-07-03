import { PrismaClient, DepartmentType } from "@prisma/client";

const prisma = new PrismaClient();

const DEPARTMENT_CODE_PREFIX: Record<DepartmentType, string> = {
  MARKETING: "MKT",
  OPERATIONS: "OPS",
  TUTOR: "TUT",
  ACCOUNTS: "ACC",
  DIGITAL_MARKETING: "DMK",
};

function getNumberFromCode(code: string | null) {
  if (!code) return 0;

  const lastPart = code.split("-").pop();
  const number = Number(lastPart);

  return Number.isNaN(number) ? 0 : number;
}

async function main() {
  const users = await prisma.user.findMany({
    where: {
      employeeCode: null,
    },
    include: {
      department: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (users.length === 0) {
    console.log("No users found without employee code.");
    return;
  }

  console.log(`Found ${users.length} users without employee code.`);

  const counters: Record<string, number> = {};

  for (const user of users) {
    if (!user.department) {
      console.log(`Skipped ${user.fullName}: No department found`);
      continue;
    }

    const prefix = DEPARTMENT_CODE_PREFIX[user.department.type];

    if (!prefix) {
      console.log(`Skipped ${user.fullName}: Invalid department type`);
      continue;
    }

    const codePrefix = `CPS-${prefix}-`;

    if (!counters[codePrefix]) {
      const existingUsers = await prisma.user.findMany({
        where: {
          employeeCode: {
            startsWith: codePrefix,
          },
        },
        select: {
          employeeCode: true,
        },
      });

      const highestNumber = existingUsers.reduce((highest, item) => {
        const currentNumber = getNumberFromCode(item.employeeCode);
        return currentNumber > highest ? currentNumber : highest;
      }, 0);

      counters[codePrefix] = highestNumber + 1;
    }

    let employeeCode = `${codePrefix}${String(counters[codePrefix]).padStart(
      3,
      "0"
    )}`;

    while (
      await prisma.user.findUnique({
        where: {
          employeeCode,
        },
        select: {
          id: true,
        },
      })
    ) {
      counters[codePrefix] += 1;

      employeeCode = `${codePrefix}${String(counters[codePrefix]).padStart(
        3,
        "0"
      )}`;
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        employeeCode,
      },
    });

    console.log(`${user.fullName} → ${employeeCode}`);

    counters[codePrefix] += 1;
  }

  console.log("Employee code backfill completed successfully.");
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });