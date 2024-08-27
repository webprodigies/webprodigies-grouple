"use client"
import { Card } from "@/components/ui/card"
import { useCourses } from "@/hooks/courses"
import { truncateString } from "@/lib/utils"
import Link from "next/link"

type Props = {
  groupid: string
}

const CourseList = ({ groupid }: Props) => {
  const { data } = useCourses(groupid)

  if (data?.status !== 200) {
    return <></>
  }

  return data.courses?.map((course) => (
    <Link href={`/group/${groupid}/courses/${course.id}`} key={course.id}>
      <Card className="bg-transparent border-themeGray h-full rounded-xl overflow-hidden">
        <img
          src={`https://ucarecdn.com/${course.thumbnail}/`}
          alt="cover"
          className="h-4/6 w-full opacity-60"
        />
        <div className="h-2/6 flex flex-col justify-center pl-5">
          <h2 className="text-lg text-white font-semibold">{course.name}</h2>
          <p className="text-sm text-themeTextGray">
            {truncateString(course.description)}
          </p>
        </div>
      </Card>
    </Link>
  ))
}

export default CourseList
