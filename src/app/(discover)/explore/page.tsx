import { onGetExploreGroup } from "@/actions/groups"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import ExplorePageContent from "./_components/explore-content"

type Props = {}

const ExplorePage = async (props: Props) => {
  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ["fitness"],
    queryFn: () => onGetExploreGroup("fitness", 0),
  })

  await query.prefetchQuery({
    queryKey: ["music"],
    queryFn: () => onGetExploreGroup("music", 0),
  })

  await query.prefetchQuery({
    queryKey: ["lifestyle"],
    queryFn: () => onGetExploreGroup("lifestyle", 0),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <ExplorePageContent layout="SLIDER" />
    </HydrationBoundary>
  )
}

export default ExplorePage
