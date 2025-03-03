import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com", password: "hashedpassword1" },
      { name: "Bob", email: "bob@example.com", password: "hashedpassword2" },
      { name: "Charlie", email: "charlie@example.com", password: "hashedpassword3" },
    ],
  });
  console.log("✅ Sample users created!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
