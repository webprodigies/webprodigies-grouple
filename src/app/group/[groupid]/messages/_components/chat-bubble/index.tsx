import { cn } from "@/lib/utils"

type ChatBubbeProps = {
  senderid: string | null
  createdAt: Date
  message: string
  userid: string
}

export const ChatBubble = ({
  senderid,
  createdAt,
  message,
  userid,
}: ChatBubbeProps) => {
  return (
    <div
      className={cn(
        senderid === userid
          ? "self-end bg-themeBlack max-w-[60%] min-w-[15%]"
          : "self-start bg-themeGray max-w-[60%] min-w-[15%]",
        "px-4 py-2 rounded-xl text-xl flex flex-col",
      )}
    >
      <p>{message}</p>
      <p className={cn("text-xs text-themeTextGray")}>
        {createdAt && (
          <>
            {createdAt.getHours()} {createdAt.getMinutes()}{" "}
            {createdAt.getHours() > 12 ? "pm" : "am"}
          </>
        )}
      </p>
    </div>
  )
}
