import { HtmlParser } from "@/components/global/html-parser"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PostAuthor } from "./post-author"
import { Interactions } from "./interactions"

type PostCardProps = {
  userimage?: string
  username?: string
  html: string
  channelname: string
  title: string
  likes: number
  comments: number
  postid: string
  likedUser?: string
  userid?: string
  likeid?: string
  optimisitc?: boolean
}

export const PostCard = ({
  userimage,
  username,
  html,
  channelname,
  title,
  likes,
  comments,
  postid,
  likedUser,
  userid,
  likeid,
  optimisitc,
}: PostCardProps) => {
  const pathname = usePathname()
  return (
    <Card className="border-themeGray bg-[#1A1A1D] first-letter:rounded-2xl overflow-hidden">
      <CardContent className="p-3 flex flex-col gap-y-6 items-start">
        <PostAuthor
          image={userimage}
          username={username}
          channel={channelname}
        />
        <Link href={`${pathname}/${postid}`} className="w-full">
          <div className="flex flex-col gap-y-3">
            <h2 className="text-2xl">{title}</h2>
            <HtmlParser html={html} />
          </div>
        </Link>
      </CardContent>
      <Separator orientation="horizontal" className="bg-themeGray mt-3" />
      <Interactions
        id={postid}
        userid={userid}
        likes={likes}
        comments={comments}
        likedUser={likedUser}
        likeid={likeid}
        optimisitc={optimisitc}
      />
    </Card>
  )
}
