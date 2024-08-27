import { z } from "zod"

export const AddCustomDomainSchema = z.object({
  domain: z.string().min(1, { message: "You must enter a domain" }),
})
