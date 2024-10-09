import { z } from "zod";

export const sendMessageSchema = z.object({
  username: z.string(),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters." })
    .max(300, { message: "Content must not be longer than 300 characters." }),
});
