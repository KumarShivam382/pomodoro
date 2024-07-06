import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const taskSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
});

const createPomodoroSessionSchema = z.object({
  startTime: z.instanceof(Date),
  endTime: z.instanceof(Date),
  tasks: z.array(taskSchema),
});

const createUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const updateUserSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

const settingsSchema = z.object({
  workDuration: z.number().positive(),
  breakDuration: z.number().positive(),
});

app.use(async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);
    c.status(500);
    return c.text("Internal Server Error");
  }
});

app.get("/", async (c) => {
  return c.json("Hello Pomodoro");
});

// Create User
app.post("/users", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      { error: "Invalid input data", issues: result.error.issues },
      400
    );
  }
  const { username, email, password } = result.data;

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
  return c.json(user);
});

// Get User
app.get("/users/:userId", async (c) => {
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
  return c.json(user);
});

// Update User
app.put("/users/:userId", async (c) => {
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
app.delete("/users/:userId", async (c) => {
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

app.post("/users/:userId/pomodoro-sessions", async (c) => {
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
app.get("/users/:userId/pomodoro-sessions", async (c) => {
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

// Create Task
app.post("/pomodoro-sessions/:sessionId/tasks", async (c) => {
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
app.put("/pomodoro-sessions/:sessionId/tasks/:taskId", async (c) => {
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
app.delete("/pomodoro-sessions/:sessionId/tasks/:taskId", async (c) => {
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

// Get User Settings
app.get("/users/:userId/settings", async (c) => {
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

  const settings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  return c.json(settings);
});

// Update User Settings
app.put("/users/:userId/settings", async (c) => {
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
    return c.json("NO user Found");
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

// Register
app.post("/register", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const result = createUserSchema.safeParse(body);
  if (!result.success) {
    return c.json(
      { error: "Invalid input data", issues: result.error.issues },
      400
    );
  }
  const { username, email, password } = result.data;

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
  return c.json(user);
});

// Login
app.post("/login", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const result = createUserSchema.safeParse(body);
  if (!result.success) {
    return c.json(
      { error: "Invalid input data", issues: result.error.issues },
      400
    );
  }
  const { username, email, password } = result.data;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return c.json(user);
});

// logout
app.post("/logout", async (c) => {
  return c.text("Logged out successfully");
});

export default app;
