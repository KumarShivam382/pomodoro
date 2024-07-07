import { z } from "zod";

export const taskSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
});

export const createPomodoroSessionSchema = z.object({
  startTime: z.instanceof(Date),
  endTime: z.instanceof(Date),
  tasks: z.array(taskSchema),
});

export const createUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export const settingsSchema = z.object({
  workDuration: z.number().positive(),
  breakDuration: z.number().positive(),
});
