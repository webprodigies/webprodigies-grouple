"use client"
import { UserComment } from "@/app/group/[groupid]/channel/[channelid]/[postid]/_components/comments/user-comment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePostReply } from "@/hooks/channels"

import { Send } from "lucide-react"

type PostReplyProps = {
  commentid: string
  postid: string
  username: string
  image: string
}

export const PostReply = ({
  commentid,
  postid,
  username,
  image,
}: PostReplyProps) => {
  const { register, onCreateReply, variables, isPending } = usePostReply(
    commentid,
    postid,
  )
  return (
    <div className="flex flex-col gap-y-5 w-full">
      {isPending && variables && (
        <UserComment
          postid={postid}
          id={variables.replyid}
          optimistic
          username={username}
          image={image}
          content={variables.comment}
        />
      )}
      <form
        onSubmit={onCreateReply}
        className="flex items-center border-2 bg-transparent py-2 px-3 mt-5 border-themeGray rounded-xl overflow-hidden"
      >
        <Input
          {...register("comment")}
          className="flex-1 bg-transparent border-none outline-none"
          placeholder="Add a comment..."
        />
        <Button variant="ghost" className="p-0 hover:bg-transparent">
          <Send className="text-themeGray" />
        </Button>
      </form>
    </div>
  )
}
