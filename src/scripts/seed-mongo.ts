import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({
  path: ".env",
});

import { connectDB } from "@/lib/mongodb";
import { Department } from "@/models/Department";
import { User } from "@/models/User";
import { Role, UserStatus } from "@/constants/enums";
import { COMPANY_CONFIG, DEPARTMENT_CONFIG } from "@/constants/company";

async function seedDepartments() {
  console.log("Seeding departments...");

  const departments = Object.values(DEPARTMENT_CONFIG).map((department) => ({
    name: department.name,
    type: department.type,
    shortCode: department.shortCode,
    departmentCode: `${COMPANY_CONFIG.COMPANY_CODE}-${COMPANY_CONFIG.DEPARTMENT_CODE_PREFIX}-${department.shortCode}`,
  }));

  for (const department of departments) {
    await Department.findOneAndUpdate(
      { type: department.type },
      department,
      {
        upsert: true,
        returnDocument: "after",
      }
    );
  }

  console.log("Departments seeded successfully.");
}

async function seedOwner() {
  console.log("Seeding owner...");

  const ownerEmail = process.env.OWNER_MAIL;
  const ownerPassword = process.env.OWNER_PASS;
  const ownerUsername = process.env.OWNER_USERNAME || "owner";

  if (!ownerEmail || !ownerPassword) {
    throw new Error("OWNER_MAIL or OWNER_PASS is missing in .env file.");
  }

  const marketingDepartment = await Department.findOne({
    type: "MARKETING" ,
  });

  if (!marketingDepartment) {
    throw new Error("Marketing department not found.");
  }

  const existingOwnerByUsername = await User.findOne({
    username: ownerUsername.toLowerCase(),
  });

  const existingOwnerByEmail = await User.findOne({
    email: ownerEmail.toLowerCase(),
  });

  if (
    existingOwnerByUsername &&
    existingOwnerByEmail &&
    existingOwnerByUsername._id.toString() !== existingOwnerByEmail._id.toString()
  ) {
    throw new Error(
      "Owner username and owner email belong to different users. Please clean the database manually."
    );
  }

  const passwordHash = await bcrypt.hash(ownerPassword, 10);

  const ownerData = {
    fullName: "System Owner",
    username: ownerUsername.toLowerCase(),
    email: ownerEmail.toLowerCase(),
    phone: "9999999999",
    passwordHash,
    role: Role.OWNER,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    department: marketingDepartment._id,
    employeeCode: `${COMPANY_CONFIG.COMPANY_CODE}-OWNER-001`,
  };

  if (existingOwnerByUsername || existingOwnerByEmail) {
    const ownerId = existingOwnerByUsername?._id || existingOwnerByEmail!._id;

    await User.findByIdAndUpdate(ownerId, ownerData, {
      returnDocument: "after",
    });

    console.log("Owner updated successfully.");
  } else {
    await User.create(ownerData);

    console.log("Owner created successfully.");
  }
}

async function main() {
  await connectDB();

  await seedDepartments();
  await seedOwner();

  console.log("MongoDB seed completed successfully.");
  process.exit(0);
}

main().catch((error) => {
  console.error("MongoDB seed failed:", error);
  process.exit(1);
});