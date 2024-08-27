import { z } from "zod"

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 2 // 2MB
export const ACCEPTED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"]

export const UpdateGallerySchema = z.object({
  videourl: z
    .string()
    .refine(
      (url) =>
        /https?:\/\/(.+?\.)(?:youtube|loom)\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/.test(
          url ?? "",
        ),
      "Invalid url, embedded videos must either be loom or youtube urls",
    )
    .optional()
    .or(z.literal("").transform(() => undefined)),
  image: z
    .any()
    .refine(
      (images: FileList) => {
        if (!images.length) {
          return true
        }
        if (images.length > 4) {
          return false
        }
        const fileValidity = Array.from(images).find(
          (file) => file.size > MAX_UPLOAD_SIZE,
        )

        if (fileValidity) {
          return false
        }

        return true
      },
      { message: "Looks like your images are to big or to many" },
    )
    .optional(),
})
