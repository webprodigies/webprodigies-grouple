import { onAuthenticatedUser } from "@/actions/auth"
import { onGetChannelInfo } from "@/actions/channels"
import { onGetGroupInfo } from "@/actions/groups"

import { LeaderBoardCard } from "@/app/group/_components/leaderboard"
import GroupSideWidget from "@/components/global/group-side-widget"
import { currentUser } from "@clerk/nextjs/server"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import Menu from "../../_components/group-navbar"
import CreateNewPost from "./_components/create-post"
import { PostFeed } from "./_components/post-feed"

type Props = {
  params: { channelid: string; groupid: string }
}

const GroupChannelPage = async ({ params }: Props) => {
  const client = new QueryClient()
  const user = await currentUser()
  const authUser = await onAuthenticatedUser()

  await client.prefetchQuery({
    queryKey: ["channel-info"],
    queryFn: () => onGetChannelInfo(params.channelid),
  })

  await client.prefetchQuery({
    queryKey: ["about-group-info"],
    queryFn: () => onGetGroupInfo(params.groupid),
  })

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="grid lg:grid-cols-4 grid-cols-1 w-full flex-1 h-0 gap-x-5 px-5 s">
        <div className="col-span-1 lg:inline relative hidden py-5">
          <LeaderBoardCard light />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-y-5 py-5">
          <Menu orientation="desktop" />
          <CreateNewPost
            userImage={user?.imageUrl!}
            channelid={params.channelid}
            username={user?.firstName!}
          />

          <PostFeed channelid={params.channelid} userid={authUser.id!} />
        </div>
        <div className="col-span-1 hidden lg:inline relative py-5">
          <GroupSideWidget light />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default GroupChannelPage
