import { onAuthenticatedUser } from "@/actions/auth"
import { onGetPostComments, onGetPostInfo } from "@/actions/groups"

import GroupSideWidget from "@/components/global/group-side-widget"
import { PostCommentForm } from "@/components/global/post-comments"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import { PostComments } from "./_components/comments"
import { PostInfo } from "./_components/post-info"

const PostPage = async ({ params }: { params: { postid: string } }) => {
  const client = new QueryClient()

  await client.prefetchQuery({
    queryKey: ["unique-post"],
    queryFn: () => onGetPostInfo(params.postid),
  })

  await client.prefetchQuery({
    queryKey: ["post-comments"],
    queryFn: () => onGetPostComments(params.postid),
  })

  const user = await onAuthenticatedUser()

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="grid grid-cols-4 px-5 py-5 gap-x-10">
        <div className="col-span-4 lg:col-span-3">
          <PostInfo id={params.postid} />
          <PostCommentForm
            username={user.username!}
            image={user.image!}
            postid={params.postid}
          />
          <PostComments postid={params.postid} />
        </div>
        <div className="col-span-1 hidden lg:inline relative">
          <GroupSideWidget light />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default PostPage
