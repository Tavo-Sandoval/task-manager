import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id.toString(), email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function GET() {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { user: { email: session.user.email as string } },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Task title is required." }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        user: {
          connect: { email: session.user.email as string },
        },
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
