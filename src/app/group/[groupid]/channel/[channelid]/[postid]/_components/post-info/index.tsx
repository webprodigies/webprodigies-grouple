"use client"

import { HtmlParser } from "@/components/global/html-parser"

import { NoResult } from "@/components/global/search/no-results"
import { useGetPost } from "@/hooks/channels"
import { Interactions } from "../../../_components/post-feed/interactions"
import { PostAuthor } from "../../../_components/post-feed/post-author"

type PostInfoProps = {
  id: string
}

export const PostInfo = ({ id }: PostInfoProps) => {
  const { data } = useGetPost(id)

  if (data?.status !== 200 || !data)
    return (
      <div>
        <NoResult />
      </div>
    )

  return (
    <div className="flex flex-col gap-y-5">
      <PostAuthor
        username={`${data?.post?.author.firstname} ${data?.post?.author.lastname}`}
        image={data.post?.author.image as string}
        channel={data.post?.channel.name as string}
      />
      <div className="flex flex-col gap-y-3">
        <h2 className="text-2xl font-bold">{data.post?.title}</h2>
        <HtmlParser html={data.post?.htmlContent as string} />
      </div>
      <Interactions
        id={id}
        page
        userid={data.post?.authorId}
        likedUser={
          data.post && data.post?.likes.length > 0
            ? data.post.likes[0].userId
            : undefined
        }
        likeid={
          data.post && data.post?.likes.length > 0
            ? data.post.likes[0].id
            : undefined
        }
        likes={data.post?._count.likes!}
        comments={data.post?._count.comments!}
      />
    </div>
  )
}
