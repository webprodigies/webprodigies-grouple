import { onGetPaginatedPosts, onSearchGroups } from "@/actions/groups"
import { onInfiniteScroll } from "@/redux/slices/infinite-scroll-slice"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

export const useInfiniteScroll = (
  action: "GROUPS" | "CHANNEL" | "POSTS",
  identifier: string,
  paginate: number,
  search?: boolean,
  query?: string,
) => {
  const observerElement = useRef<HTMLDivElement>(null)
  const dispatch: AppDispatch = useDispatch()
  const { data } = useAppSelector((state) => state.infiniteScrollReducer)

  const {
    refetch,
    isFetching,
    isFetched,
    data: paginatedData,
  } = useQuery({
    queryKey: ["infinite-scroll"],
    queryFn: async () => {
      if (search) {
        if (action === "GROUPS") {
          const response = await onSearchGroups(
            action,
            query as string,
            paginate + data.length,
          )
          if (response && response.groups) {
            return response.groups
          }
        }
      } else {
        if (action === "POSTS") {
          const response = await onGetPaginatedPosts(
            identifier,
            paginate + data.length,
          )
          if (response && response.posts) {
            return response.posts
          }
        }
      }
      return null
    },
    enabled: false,
  })

  if (isFetched && paginatedData)
    dispatch(onInfiniteScroll({ data: paginatedData }))

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) refetch()
    })
    observer.observe(observerElement.current as Element)
    return () => observer.disconnect()
  }, [])
  return { observerElement, isFetching }
}
