import { onGetGroupCourses } from "@/actions/course"
import CourseCreate from "@/components/global/create-course"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import CourseList from "./_components/course-list"

type Props = {
  params: {
    groupid: string
  }
}

const CoursesPage = async ({ params }: Props) => {
  const client = new QueryClient()

  await client.prefetchQuery({
    queryKey: ["group-courses"],
    queryFn: () => onGetGroupCourses(params.groupid),
  })

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="container grid lg:grid-cols-2 2xl:grid-cols-3 py-10 gap-5">
        <CourseCreate groupid={params.groupid} />
        <CourseList groupid={params.groupid} />
      </div>
    </HydrationBoundary>
  )
}

export default CoursesPage
