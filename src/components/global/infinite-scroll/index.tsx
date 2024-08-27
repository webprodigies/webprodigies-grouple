"use client"

import { useInfiniteScroll } from "@/hooks/infinite-scroll"
import Skeleton from "../skeleton"

type Props = {
  action: "GROUPS" | "POSTS"
  children: React.ReactNode
  identifier: string
  paginate: number
  search?: boolean
  loading?: "POST"
}

const InfiniteScrollObserver = ({
  action,
  children,
  identifier,
  paginate,
  search,
  loading,
}: Props) => {
  const { observerElement, isFetching } = useInfiniteScroll(
    action,
    identifier,
    paginate,
    search,
  )

  return (
    <>
      {children}
      <div ref={observerElement}>
        {isFetching && <Skeleton element={loading || "CARD"} />}
      </div>
    </>
  )
}

export default InfiniteScrollObserver
