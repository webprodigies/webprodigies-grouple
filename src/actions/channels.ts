"use server"

import { client } from "@/lib/prisma"
import { onAuthenticatedUser } from "./auth"

export const onGetChannelInfo = async (channelid: string) => {
  try {
    const user = await onAuthenticatedUser()
    const channel = await client.channel.findUnique({
      where: {
        id: channelid,
      },
      include: {
        posts: {
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            channel: {
              select: {
                name: true,
              },
            },
            author: {
              select: {
                firstname: true,
                lastname: true,
                image: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
            likes: {
              where: {
                userId: user.id!,
              },
              select: {
                userId: true,
                id: true,
              },
            },
          },
        },
      },
    })
    return channel
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onCreateNewChannel = async (
  groupid: string,
  data: {
    id: string
    name: string
    icon: string
  },
) => {
  try {
    const channel = await client.group.update({
      where: {
        id: groupid,
      },
      data: {
        channel: {
          create: {
            ...data,
          },
        },
      },
      select: {
        channel: true,
      },
    })

    if (channel) {
      return { status: 200, channel: channel.channel }
    }

    return {
      status: 404,
      message: "Channel could not be created",
    }
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong",
    }
  }
}

export const onUpdateChannelInfo = async (
  channelid: string,
  name?: string,
  icon?: string,
) => {
  try {
    if (name) {
      const channel = await client.channel.update({
        where: {
          id: channelid,
        },
        data: {
          name,
        },
      })

      if (channel) {
        return {
          status: 200,
          message: "Channel name successfully updated",
        }
      }
      return {
        status: 404,
        message: "Channel not found! try again later",
      }
    }
    if (icon) {
      const channel = await client.channel.update({
        where: {
          id: channelid,
        },
        data: {
          icon,
        },
      })
      if (channel) {
        return {
          status: 200,
          message: "Channel icon successfully updated",
        }
      }
      return {
        status: 404,
        message: "Channel not found! try again later",
      }
    } else {
      const channel = await client.channel.update({
        where: {
          id: channelid,
        },
        data: {
          icon,
          name,
        },
      })
      if (channel) {
        return {
          status: 200,
          message: "Channel successfully updated",
        }
      }
      return {
        status: 404,
        message: "Channel not found! try again later",
      }
    }
  } catch (error) {
    console.log(error)
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onDeleteChannel = async (channelId: string) => {
  try {
    const channel = await client.channel.delete({
      where: {
        id: channelId,
      },
    })

    if (channel) {
      return { status: 200, message: "Channel deleted successfully" }
    }

    return { status: 404, message: "Channel not found!" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}
export const onCreateChannelPost = async (
  channelid: string,
  title: string,
  content: string,
  htmlContent: string,
  jsonContent: string,
  postid: string,
) => {
  try {
    const user = await onAuthenticatedUser()
    const post = await client.post.create({
      data: {
        id: postid,
        authorId: user.id!,
        channelId: channelid,
        title,
        content,
        htmlContent,
        jsonContent,
      },
    })

    if (post) {
      return { status: 200, message: "Post successfully created" }
    }

    return { status: 404, message: "Channel not found" }
  } catch (error) {
    return { status: 400, message: "Oops! something went wrong" }
  }
}

export const onLikeChannelPost = async (postid: string, likeid: string) => {
  try {
    const user = await onAuthenticatedUser()

    const liked = await client.like.findFirst({
      where: {
        id: likeid,
        userId: user.id!,
      },
    })

    if (liked) {
      await client.like.delete({
        where: {
          id: likeid,
          userId: user.id,
        },
      })

      return { status: 200, message: "You unliked this post" }
    }

    const like = await client.like.create({
      data: {
        id: likeid,
        postId: postid,
        userId: user.id!,
      },
    })

    if (like) return { status: 200, message: "You liked this post" }

    return { status: 404, message: "Post not found!" }
  } catch (error) {
    console.log(error)
    return { status: 400, message: "Something went wrong" }
  }
}

export const onCreateNewComment = async (
  postid: string,
  content: string,
  commentid: string,
) => {
  try {
    const user = await onAuthenticatedUser()
    const comment = await client.post.update({
      where: {
        id: postid,
      },
      data: {
        comments: {
          create: {
            id: commentid,
            content,
            userId: user.id!,
          },
        },
      },
    })
    if (comment) {
      return { status: 200, message: "Comment successfull" }
    }
  } catch (error) {
    return { status: 400, message: "Something went wrong" }
  }
}

export const onCreateCommentReply = async (
  postid: string,
  commentid: string,
  comment: string,
  replyid: string,
) => {
  try {
    const user = await onAuthenticatedUser()
    const reply = await client.comment.update({
      where: {
        id: commentid,
      },
      data: {
        reply: {
          create: {
            content: comment,
            id: replyid,
            postId: postid,
            userId: user.id!,
            replied: true,
          },
        },
      },
    })

    if (reply) {
      return { status: 200, message: "Reply posted" }
    }
  } catch (error) {
    return { status: 400, message: "Oops something went wrong" }
  }
}
