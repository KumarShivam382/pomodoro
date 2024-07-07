import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { jwt, sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { z } from "zod";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/Auth";
import { pomodoroRouter } from "./routes/pomodoro";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.route("/users", userRouter);
app.route("/pomodoro-sessions", pomodoroRouter);
app.route("/", authRouter);

app.get("/", async (c) => {
  return c.json("Hello Pomodoro");
});

export default app;
