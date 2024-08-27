import { createClient } from "@supabase/supabase-js"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export const truncateString = (string: string) => {
  return string.slice(0, 60) + "..."
}

export const validateURLString = (url: string) => {
  const youtubeRegex = new RegExp("www.youtube.com")
  const loomRegex = new RegExp("www.loom.com")

  if (youtubeRegex.test(url)) {
    return {
      url,
      type: "YOUTUBE",
    }
  }

  if (loomRegex.test(url)) {
    return {
      url,
      type: "LOOM",
    }
  } else {
    return {
      url: undefined,
      type: "IMAGE",
    }
  }
}
