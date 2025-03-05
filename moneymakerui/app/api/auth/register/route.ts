import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // ✅ Validate input
    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`❌ Registration failed: Email ${email} already exists.`);
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 400 });
    }

    // ✅ Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    console.log(`✅ User registered successfully: ${newUser.email}`);

    return new Response(JSON.stringify({ message: "User created", user: newUser }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
