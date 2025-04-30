import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // Validate session
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = parseInt(params.id);
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Task title is required." }, { status: 400 });
    }

    // Update the task
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
    const session = await getServerSession(authOptions);

    // Validate session
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = parseInt(params.id);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID." }, { status: 400 });
    }

    // Delete the task
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
