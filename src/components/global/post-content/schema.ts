import { z } from "zod"

export const CreateChannelPost = z.object({
  title: z.string(),
  content: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  htmlcontent: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  jsoncontent: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
})
