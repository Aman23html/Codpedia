import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.department.count();

  console.log("Departments:", count);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });