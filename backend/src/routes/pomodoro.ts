import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { taskSchema } from "../types/types";

export const pomodoroRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

pomodoroRouter.use("/*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authHeader = c.req.header("Authorization") || "";
  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = await verify(token, c.env.JWT_SECRET);

    if (!user || typeof user.id !== "string") {
      return c.json({ error: "Unauthorized" }, 403);
    }
    c.set("userId", user.id);
    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 403);
  } finally {
    await prisma.$disconnect();
  }
});

// Create Task
pomodoroRouter.post("/:sessionId/tasks", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const sessionId = c.req.param("sessionId");
  const body = await c.req.json();
  const result = taskSchema.safeParse(body);
  if (!result.success) {
    return c.json(
      { error: "Invalid input data", issues: result.error.issues },
      400
    );
  }
  const { title, completed } = result.data;

  const task = await prisma.task.create({
    data: {
      title,
      completed: completed || false,
      pomodoroSession: {
        connect: {
          id: sessionId,
        },
      },
    },
  });

  return c.json(task);
});

// Update Task
pomodoroRouter.put("/:sessionId/tasks/:taskId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const sessionId = c.req.param("sessionId");
  const taskId = c.req.param("taskId");
  const body = await c.req.json();
  const result = taskSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      { error: "Invalid input data", issues: result.error.issues },
      400
    );
  }
  const { title, completed } = result.data;

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
      pomodoroSessionId: sessionId,
    },
    data: {
      title,
      completed,
    },
  });
  return c.json(updatedTask);
});

// Delete Task
pomodoroRouter.delete("/:sessionId/tasks/:taskId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const sessionId = c.req.param("sessionId");
  const taskId = c.req.param("taskId");

  const taskgiven = await prisma.task.findFirst({
    where: {
      id: taskId,
      pomodoroSessionId: sessionId,
    },
  });

  if (!taskgiven) {
    return c.json("No task found");
  }

  await prisma.task.delete({
    where: {
      id: taskId,
      pomodoroSessionId: sessionId,
    },
  });
  return c.text("Task deleted successfully");
});
