import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/config";

const prisma = new PrismaClient();

// En Next.js 13.1.1, los handlers de ruta tienen una firma específica
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = context.params.id;
    const taskId = parseInt(id);
    const { title } = await request.json();

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

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = context.params.id;
    const taskId = parseInt(id);

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