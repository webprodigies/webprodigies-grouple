import { z } from "zod"

export const SendNewMessageSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty" }),
})
