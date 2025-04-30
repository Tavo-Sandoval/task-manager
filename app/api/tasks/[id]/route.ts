import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const authConfig = {
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
  session: { strategy: 'jwt' as const },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = parseInt(params.id);
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Task title is required." }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = parseInt(params.id);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID." }, { status: 400 });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
