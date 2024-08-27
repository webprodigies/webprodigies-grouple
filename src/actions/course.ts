"use server"

import { client } from "@/lib/prisma"

export const onGetGroupCourses = async (groupid: string) => {
  try {
    const courses = await client.course.findMany({
      where: {
        groupId: groupid,
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    })

    if (courses && courses.length > 0) {
      return { status: 200, courses }
    }

    return {
      status: 404,
      message: "No courses found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onCreateGroupCourse = async (
  groupid: string,
  name: string,
  image: string,
  description: string,
  courseid: string,
  privacy: string,
  published: boolean,
) => {
  try {
    const course = await client.group.update({
      where: {
        id: groupid,
      },
      data: {
        courses: {
          create: {
            id: courseid,
            name,
            thumbnail: image,
            description,
            privacy,
            published,
          },
        },
      },
    })

    if (course) {
      return { status: 200, message: "Course successfully created" }
    }

    return { status: 404, message: "Group not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}
export const onGetCourseModules = async (courseId: string) => {
  try {
    const modules = await client.module.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        section: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })

    if (modules && modules.length > 0) {
      return { status: 200, modules }
    }

    return {
      status: 404,
      message: "No modules found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onCreateCourseModule = async (
  courseId: string,
  name: string,
  moduleId: string,
) => {
  try {
    const courseModule = await client.course.update({
      where: {
        id: courseId,
      },
      data: {
        modules: {
          create: {
            title: name,
            id: moduleId,
          },
        },
      },
    })

    if (courseModule) {
      return { status: 200, message: "Module successfully create" }
    }

    return {
      status: 404,
      message: "No courses found",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onUpdateModule = async (
  moduleId: string,
  type: "NAME" | "DATA",
  content: string,
) => {
  try {
    if (type === "NAME") {
      const title = await client.module.update({
        where: {
          id: moduleId,
        },
        data: {
          title: content,
        },
      })

      if (title) {
        return { status: 200, message: "Name successfully updated" }
      }

      return {
        status: 404,
        message: "Module not found!",
      }
    }
  } catch (error) {
    return { status: 400, message: "Something went wrong" }
  }
}

export const onUpdateSection = async (
  sectionId: string,
  type: "NAME" | "COMPLETE",
  content: string,
) => {
  try {
    if (type === "NAME") {
      await client.section.update({
        where: {
          id: sectionId,
        },
        data: {
          name: content,
        },
      })

      return { status: 200, message: "Section successfully updated" }
    }
    if (type === "COMPLETE") {
      await client.section.update({
        where: {
          id: sectionId,
        },
        data: {
          complete: true,
        },
      })

      return { status: 200, message: "Section successfully completed" }
    }

    return { status: 404, message: "Section not found" }
  } catch (error) {
    return { status: 400, message: "Something went wrong!" }
  }
}

export const onCreateModuleSection = async (
  moduleId: string,
  sectionid: string,
) => {
  try {
    const section = await client.module.update({
      where: {
        id: moduleId,
      },
      data: {
        section: {
          create: {
            id: sectionid,
          },
        },
      },
    })

    if (section) {
      return { status: 200, message: "New section created" }
    }

    return { status: 404, message: "Module not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onGetSectionInfo = async (sectionid: string) => {
  try {
    const section = await client.section.findUnique({
      where: {
        id: sectionid,
      },
    })

    if (section) {
      return { status: 200, section }
    }

    return { status: 404, message: "Course section not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onUpdateCourseSectionContent = async (
  sectionid: string,
  html: string,
  json: string,
  content: string,
) => {
  try {
    const section = await client.section.update({
      where: {
        id: sectionid,
      },
      data: {
        JsonContent: json,
        htmlContent: html,
        content,
      },
    })

    if (section) {
      return { status: 200, message: "Course content added" }
    }

    return { status: 404, message: "Section not found!" }
  } catch (error) {
    return { status: 400, message: "Oop! something went wrong" }
  }
}
