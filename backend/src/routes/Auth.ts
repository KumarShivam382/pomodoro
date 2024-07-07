import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { number, z } from "zod";
import { createUserSchema } from "../types/types";

export const authRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Register
authRouter.post("/register", async (c) => {
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
      settings: {
        create: {
          workDuration: 25, // Default work duration
          breakDuration: 5, // Default break duration
        },
      },
    },
    include: {
      settings: true,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ token });
});

// Login
authRouter.post("/login", async (c) => {
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

  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ token });
});

// logout
authRouter.post("/logout", async (c) => {
  return c.text("Logged out successfully");
});
