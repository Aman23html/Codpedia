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

const existingOwner =
await prisma.user.findFirst({
where: {
role: Role.OWNER,
},
});

if (existingOwner) {
console.log("Owner already exists.");
return;
}

const marketingDepartment =
await prisma.department.findUnique({
where: {
type: DepartmentType.MARKETING,
},
});

if (!marketingDepartment) {
throw new Error(
"Marketing department not found."
);
}

const passwordHash =
await bcrypt.hash(
"Owner@123",
10
);

await prisma.user.create({
  data: {
    fullName: "System Owner",

    username: "owner",

    email: "owner@codepedia.com",

    phone: "9999999999",

    passwordHash,

    role: Role.OWNER,

    status: UserStatus.ACTIVE,

    emailVerified: true,

    departmentId: marketingDepartment.id,
  },
});

console.log(
"Owner created successfully."
);
}

main()
.catch((error) => {
console.error(error);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});
