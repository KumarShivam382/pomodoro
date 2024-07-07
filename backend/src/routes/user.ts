import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { z } from "zod";
import {
  createUserSchema,
  updateUserSchema,
  createPomodoroSessionSchema,
  taskSchema,
  settingsSchema,
} from "../types/types";

type taskParams = z.infer<typeof taskSchema>;

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.use("/*", async (c, next) => {
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

// Create User
userRouter.get("/all", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const users = await prisma.user.findMany({});
  return c.json(users);
});

// Get User
userRouter.get("/:userId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.param("userId");
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      pomodoroSessions: true,
      settings: true,
    },
  });
  if (!user) {
    c.status(404);
    return c.text("User not found");
  }
  return c.json({ user });
});

// Update User
userRouter.put("/:userId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.param("userId");
  const body = await c.req.json();
  const result = updateUserSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      { error: "Invalid input data", issues: result.error.issues },
      400
    );
  }
  const { username, password } = result.data;
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
      password,
    },
  });
  return c.json(updatedUser);
});

// Delete User
userRouter.delete("/:userId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.req.param("userId");

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    return c.json("User not found");
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  return c.text("User deleted successfully");
});

// Create Pomodoro Session

userRouter.post("/:userId/pomodoro-sessions", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();

    const result = createPomodoroSessionSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { error: "Invalid input data", issues: result.error.issues },
        400
      );
    }
    const { startTime, endTime, tasks } = result.data;

    const tasksToCreate: taskParams[] = tasks.map((task: taskParams) => ({
      title: task.title,
      completed: task.completed,
    }));

    const session = await prisma.pomodoroSession.create({
      data: {
        startTime,
        endTime,
        user: {
          connect: {
            id: userId,
          },
        },
        tasks: {
          create: tasksToCreate,
        },
      },
      include: {
        tasks: true,
      },
    });

    return c.json(session);
  } catch (error) {
    console.error("Error creating Pomodoro session:", error);
    c.status(500);
    return c.json({ error: "Failed to create Pomodoro session" });
  }
});

// Get Pomodoro Sessions for User
userRouter.get("/:userId/pomodoro-sessions", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.param("userId");
  const sessions = await prisma.pomodoroSession.findMany({
    where: {
      userId,
    },
    include: {
      tasks: true,
    },
  });
  return c.json(sessions);
});

// Get User Settings
userRouter.get("/:userId/settings", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.param("userId");
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return c.json("No user Found");
  }

  const settings = await prisma.userSettings.findFirst({
    where: {
      userId,
    },
  });
  return c.json(settings);
});

// Update User Settings
userRouter.put("/:userId/settings", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.param("userId");
  const body = await c.req.json();

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return c.json("No user Found");
  }

  const result = settingsSchema.safeParse(body);
  if (!result.success) {
    return c.json(
      { error: "Invalid input data", issues: result.error.issues },
      400
    );
  }
  const { workDuration, breakDuration } = result.data;

  const updatedSettings = await prisma.userSettings.update({
    where: { userId },
    data: { workDuration, breakDuration },
  });
  return c.json(updatedSettings);
});
