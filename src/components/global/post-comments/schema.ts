import { z } from "zod"

export const CreateCommentSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment must have atleast 1 character" }),
})
