import { useLikeChannelPost } from "@/hooks/channels"
import { Like, Unlike } from "@/icons"
import { cn } from "@/lib/utils"
import { MessageCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

type InteractionsProps = {
  id: string
  optimisitc?: boolean
  userid?: string
  likedUser?: string
  likes: number
  comments: number
  likeid?: string
  page?: boolean
}

export const Interactions = ({
  id,
  optimisitc,
  userid,
  likedUser,
  likes,
  comments,
  likeid,
  page,
}: InteractionsProps) => {
  const { mutate, isPending } = useLikeChannelPost(id)
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2",
        page ? "" : "px-6",
      )}
    >
      <div className="flex gap-5 text-[#757272] text-sm">
        <span className="flex gap-1 justify-center items-center">
          {optimisitc ? (
            <Unlike />
          ) : isPending ? (
            <span className="cursor-pointer">
              {userid === likedUser ? <Unlike /> : <Like />}
            </span>
          ) : likedUser === userid ? (
            <span
              onClick={() =>
                mutate({
                  likeid: likeid!,
                })
              }
              className="cursor-pointer"
            >
              <Like />
            </span>
          ) : (
            <span
              className="cursor-pointer"
              onClick={() =>
                mutate({
                  likeid: uuidv4(),
                })
              }
            >
              <Unlike />
            </span>
          )}
          {isPending ? (likedUser === userid ? likes - 1 : likes + 1) : likes}
        </span>

        <span className="flex gap-1 justify-center items-center">
          <MessageCircle size={16} />
          {comments}
        </span>
      </div>
    </div>
  )
}
