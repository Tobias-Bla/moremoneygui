// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed1 = await bcrypt.hash("password1", 10);
  const hashed2 = await bcrypt.hash("password2", 10);
  const hashed3 = await bcrypt.hash("password3", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Alice",
        email: "alice@example.com",
        passwordHash: hashed1,
      },
      {
        name: "Bob",
        email: "bob@example.com",
        passwordHash: hashed2,
      },
      {
        name: "Charlie",
        email: "charlie@example.com",
        passwordHash: hashed3,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seed completed!");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
