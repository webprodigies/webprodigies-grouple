import { Loader } from "@/components/global/loader"
import { PostReply } from "@/components/global/post-reply"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useGetReplies } from "@/hooks/channels"

import { Chat, Heart } from "@/icons"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

type UserCommentProps = {
  image: string
  username: string
  content: string
  optimistic?: boolean
  onReply?(): void
  reply?: { comment?: string; reply: boolean }
  id: string
  postid: string
  replyCount?: number
  commentid?: string | null
  replied?: boolean | null
  activeComment?: string
  onActiveComment?(): void
  noReply?: boolean
}

export const UserComment = ({
  image,
  username,
  content,
  optimistic,
  onReply,
  reply,
  id,
  postid,
  replyCount,
  activeComment,
  onActiveComment,
  noReply,
}: UserCommentProps) => {
  const { data, isFetching } = useGetReplies(activeComment!)

  return (
    <div className={cn("flex gap-x-3", optimistic ? "opacity-50" : "")}>
      <div className="flex flex-col gap-y-1">
        <Avatar>
          <AvatarImage src={image} alt="user" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <Separator
          orientation="vertical"
          className="flex-1 h-0 self-center bg-themeGray"
        />
      </div>
      <div className="flex flex-col items-start mt-2 w-full pb-5 gap-y-2">
        <h3 className="font-semibold text-sm">{username}</h3>
        <p className="font-light text-sm">{content}</p>
        <div className="flex gap-x-5 items-center">
          <span className="flex items-center text-themeTextGray text-xs gap-x-1">
            <Heart />
            Like
          </span>
          {!noReply && (
            <span
              {...(!optimistic && {
                onClick: onReply,
              })}
              className="flex items-center cursor-pointer text-themeTextGray text-xs gap-x-1"
            >
              <Chat />
              Reply
            </span>
          )}
        </div>
        {replyCount && replyCount > 0 ? (
          <>
            <Loader loading={isFetching && activeComment === id}>
              {data?.replies &&
                data.replies?.length > 0 &&
                data.replies.map(
                  (rep) =>
                    rep.commentId === id && (
                      <UserComment
                        key={rep.id}
                        content={rep.content}
                        id={rep.id}
                        postid={postid}
                        username={`${rep.user.firstname} ${rep.user.lastname}`}
                        image={rep.user.image!}
                        reply={reply}
                        onReply={onReply}
                        noReply
                      />
                    ),
                )}
            </Loader>
            <span
              onClick={onActiveComment}
              className="hover:bg-themeGray text-sm cursor-pointer p-2 rounded-lg"
            >
              Load more replies
            </span>
          </>
        ) : (
          <></>
        )}
        {reply?.comment === id && reply.reply && (
          <PostReply
            postid={postid}
            commentid={id}
            username={username}
            image={image}
          />
        )}
      </div>
    </div>
  )
}
