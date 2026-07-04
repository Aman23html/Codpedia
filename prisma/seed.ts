import bcrypt from "bcryptjs";
import {
  PrismaClient,
  DepartmentType,
  Role,
  UserStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding departments...");

  await prisma.department.createMany({
    data: [
      {
        name: "Marketing",
        type: DepartmentType.MARKETING,
      },
      {
        name: "Operations",
        type: DepartmentType.OPERATIONS,
      },
      {
        name: "Tutor",
        type: DepartmentType.TUTOR,
      },
      {
        name: "Accounts",
        type: DepartmentType.ACCOUNTS,
      },
      {
        name: "Digital Marketing",
        type: DepartmentType.DIGITAL_MARKETING,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Departments seeded successfully.");

  const ownerEmail = process.env.OWNER_MAIL;
  const ownerPassword = process.env.OWNER_PASS;
  const ownerUsername = process.env.OWNER_USERNAME || "owner";

  if (!ownerEmail || !ownerPassword) {
    throw new Error("OWNER_MAIL or OWNER_PASS is missing in .env file.");
  }

  const marketingDepartment = await prisma.department.findUnique({
    where: {
      type: DepartmentType.MARKETING,
    },
  });

  if (!marketingDepartment) {
    throw new Error("Marketing department not found.");
  }

  const existingOwnerByUsername = await prisma.user.findUnique({
    where: {
      username: ownerUsername,
    },
  });

  const existingOwnerByEmail = await prisma.user.findUnique({
    where: {
      email: ownerEmail,
    },
  });

  if (
    existingOwnerByUsername &&
    existingOwnerByEmail &&
    existingOwnerByUsername.id !== existingOwnerByEmail.id
  ) {
    throw new Error(
      "Owner username and owner email belong to different users. Please clean the database manually."
    );
  }

  const passwordHash = await bcrypt.hash(ownerPassword, 10);

  if (existingOwnerByUsername || existingOwnerByEmail) {
    await prisma.user.update({
      where: {
        id: existingOwnerByUsername?.id || existingOwnerByEmail!.id,
      },
      data: {
        fullName: "System Owner",
        username: ownerUsername,
        email: ownerEmail,
        passwordHash,
        role: Role.OWNER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        departmentId: marketingDepartment.id,
      },
    });

    console.log("Owner updated successfully.");
  } else {
    await prisma.user.create({
      data: {
        fullName: "System Owner",
        username: ownerUsername,
        email: ownerEmail,
        phone: "9999999999",
        passwordHash,
        role: Role.OWNER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        departmentId: marketingDepartment.id,
      },
    });

    console.log("Owner created successfully.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });