import { z } from "zod"

export const CreateGroupSubscriptionSchema = z.object({
  price: z.string().min(1, { message: "field cannot be empty" }),
})
