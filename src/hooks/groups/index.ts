"use client"
import {
  onAddCustomDomain,
  onGetAllGroupMembers,
  onGetAllUserMessages,
  onGetDomainConfig,
  onGetExploreGroup,
  onGetGroupInfo,
  onSearchGroups,
  onSendMessage,
  onUpDateGroupSettings,
  onUpdateGroupGallery,
} from "@/actions/groups"
import { AddCustomDomainSchema } from "@/components/forms/domain/schema"
import { GroupSettingsSchema } from "@/components/forms/group-settings/schema"
import { SendNewMessageSchema } from "@/components/forms/huddles/schema"
import { UpdateGallerySchema } from "@/components/forms/media-gallery/schema"
import { upload } from "@/lib/uploadcare"
import { supabaseClient, validateURLString } from "@/lib/utils"
import { onChat } from "@/redux/slices/chats-slices"
import {
  onClearList,
  onInfiniteScroll,
} from "@/redux/slices/infinite-scroll-slice"
import { onOnline } from "@/redux/slices/online-member-slice"
import {
  GroupStateProps,
  onClearSearch,
  onSearch,
} from "@/redux/slices/search-slice"
import { AppDispatch } from "@/redux/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import { JSONContent } from "novel"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { v4 } from "uuid"
import { z } from "zod"

export const useGroupChatOnline = (userid: string) => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const channel = supabaseClient.channel("tracking")

    channel
      .on("presence", { event: "sync" }, () => {
        const state: any = channel.presenceState()
        console.log(state)
        for (const user in state) {
          dispatch(
            onOnline({
              members: [{ id: state[user][0].member.userid }],
            }),
          )
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            member: {
              userid,
            },
          })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [])
}

export const useSearch = (search: "GROUPS" | "POSTS") => {
  const [query, setQuery] = useState<string>("")
  const [debounce, setDebounce] = useState<string>("")

  const dispatch: AppDispatch = useDispatch()

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value)

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(query)
    }, 1000)
    return () => clearTimeout(delayInputTimeoutId)
  }, [query, 1000])

  const { refetch, data, isFetched, isFetching } = useQuery({
    queryKey: ["search-data", debounce],
    queryFn: async ({ queryKey }) => {
      if (search === "GROUPS") {
        const groups = await onSearchGroups(search, queryKey[1])
        return groups
      }
    },
    enabled: false,
  })

  if (isFetching)
    dispatch(
      onSearch({
        isSearching: true,
        data: [],
      }),
    )

  if (isFetched)
    dispatch(
      onSearch({
        isSearching: false,
        status: data?.status as number,
        data: data?.groups || [],
        debounce,
      }),
    )

  useEffect(() => {
    if (debounce) refetch()
    if (!debounce) dispatch(onClearSearch())
    return () => {
      debounce
    }
  }, [debounce])

  return { query, onSearchQuery }
}

export const useGroupSettings = (groupid: string) => {
  const { data } = useQuery({
    queryKey: ["group-info"],
    queryFn: () => onGetGroupInfo(groupid),
  })

  const jsonContent = data?.group?.jsonDescription
    ? JSON.parse(data?.group?.jsonDescription as string)
    : undefined

  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(jsonContent)

  const [onDescription, setOnDescription] = useState<string | undefined>(
    data?.group?.description || undefined,
  )

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<z.infer<typeof GroupSettingsSchema>>({
    resolver: zodResolver(GroupSettingsSchema),
    mode: "onChange",
  })
  const [previewIcon, setPreviewIcon] = useState<string | undefined>(undefined)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const previews = watch(({ thumbnail, icon }) => {
      if (!icon) return
      if (icon[0]) {
        setPreviewIcon(URL.createObjectURL(icon[0]))
      }
      if (thumbnail[0]) {
        setPreviewThumbnail(URL.createObjectURL(thumbnail[0]))
      }
    })
    return () => previews.unsubscribe()
  }, [watch])

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription)
    setValue("jsondescription", JsonContent)
    setValue("description", onDescription)
  }

  useEffect(() => {
    onSetDescriptions()
    return () => {
      onSetDescriptions()
    }
  }, [onJsonDescription, onDescription])

  const { mutate: update, isPending } = useMutation({
    mutationKey: ["group-settings"],
    mutationFn: async (values: z.infer<typeof GroupSettingsSchema>) => {
      if (values.thumbnail && values.thumbnail.length > 0) {
        const uploaded = await upload.uploadFile(values.thumbnail[0])
        const updated = await onUpDateGroupSettings(
          groupid,
          "IMAGE",
          uploaded.uuid,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (values.icon && values.icon.length > 0) {
        console.log("icon")
        const uploaded = await upload.uploadFile(values.icon[0])
        const updated = await onUpDateGroupSettings(
          groupid,
          "ICON",
          uploaded.uuid,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (values.name) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "NAME",
          values.name,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      console.log("DESCRIPTION")

      if (values.description) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "DESCRIPTION",
          values.description,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (values.jsondescription) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "JSONDESCRIPTION",
          values.jsondescription,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (
        !values.description &&
        !values.name &&
        !values.thumbnail.length &&
        !values.icon.length &&
        !values.jsondescription
      ) {
        return toast("Error", {
          description: "Oops! looks like your form is empty",
        })
      }
      return toast("Success", {
        description: "Group data updated",
      })
    },
  })
  const router = useRouter()
  const onUpdate = handleSubmit(async (values) => update(values))
  if (data?.status !== 200) router.push(`/group/create`)

  return {
    data,
    register,
    errors,
    onUpdate,
    isPending,
    previewIcon,
    previewThumbnail,
    onJsonDescription,
    setJsonDescription,
    setOnDescription,
    onDescription,
  }
}
export const useGroupList = (query: string) => {
  const { data } = useQuery({
    queryKey: [query],
  })

  const dispatch: AppDispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(onClearList({ data: [] }))
  }, [])

  const { groups, status } = data as {
    groups: GroupStateProps[]
    status: number
  }

  return { groups, status }
}

export const useExploreSlider = (query: string, paginate: number) => {
  const [onLoadSlider, setOnLoadSlider] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()
  const { data, refetch, isFetching, isFetched } = useQuery({
    queryKey: ["fetch-group-slides"],
    queryFn: () => onGetExploreGroup(query, paginate | 0),
    enabled: false,
  })

  if (isFetched && data?.status === 200 && data.groups) {
    dispatch(onInfiniteScroll({ data: data.groups }))
  }

  useEffect(() => {
    setOnLoadSlider(true)
    return () => {
      onLoadSlider
    }
  }, [])

  return { refetch, isFetching, data, onLoadSlider }
}

export const useGroupInfo = () => {
  const { data } = useQuery({
    queryKey: ["about-group-info"],
  })

  const router = useRouter()

  if (!data) router.push("/explore")

  const { group, status } = data as { status: number; group: GroupStateProps }

  if (status !== 200) router.push("/explore")

  return {
    group,
  }
}

export const useGroupAbout = (
  description: string | null,
  jsonDescription: string | null,
  htmlDescription: string | null,
  currentMedia: string,
  groupid: string,
) => {
  const editor = useRef<HTMLFormElement | null>(null)
  const mediaType = validateURLString(currentMedia)
  const [activeMedia, setActiveMedia] = useState<
    | {
        url: string | undefined
        type: string
      }
    | undefined
  >(
    mediaType.type === "IMAGE"
      ? {
          url: currentMedia,
          type: mediaType.type,
        }
      : { ...mediaType },
  )

  const jsonContent =
    jsonDescription !== null ? JSON.parse(jsonDescription as string) : undefined

  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(jsonContent)

  const [onDescription, setOnDescription] = useState<string | undefined>(
    description || undefined,
  )

  const [onHtmlDescription, setOnHtmlDescription] = useState<
    string | undefined
  >(htmlDescription || undefined)

  const [onEditDescription, setOnEditDescription] = useState<boolean>(false)

  const {
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof GroupSettingsSchema>>({
    resolver: zodResolver(GroupSettingsSchema),
  })

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription)
    setValue("jsondescription", JsonContent)
    setValue("description", onDescription)
    setValue("htmldescription", onHtmlDescription)
  }

  useEffect(() => {
    onSetDescriptions()
    return () => {
      onSetDescriptions()
    }
  }, [onJsonDescription, onDescription])

  const onEditTextEditor = (event: Event) => {
    if (editor.current) {
      !editor.current.contains(event.target as Node | null)
        ? setOnEditDescription(false)
        : setOnEditDescription(true)
    }
  }

  useEffect(() => {
    document.addEventListener("click", onEditTextEditor, false)
    return () => {
      document.removeEventListener("click", onEditTextEditor, false)
    }
  }, [])

  const { mutate, isPending } = useMutation({
    mutationKey: ["about-description"],
    mutationFn: async (values: z.infer<typeof GroupSettingsSchema>) => {
      if (values.description) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "DESCRIPTION",
          values.description,
          `/about/${groupid}`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (values.jsondescription) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "JSONDESCRIPTION",
          values.jsondescription,
          `/about/${groupid}`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (values.htmldescription) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "HTMLDESCRIPTION",
          values.htmldescription,
          `/about/${groupid}`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (
        !values.description &&
        !values.jsondescription &&
        !values.htmldescription
      ) {
        return toast("Error", {
          description: "Oops! looks like your form is empty",
        })
      }
      return toast("Success", {
        description: "Group description updated",
      })
    },
  })
  const onSetActiveMedia = (media: { url: string | undefined; type: string }) =>
    setActiveMedia(media)

  const onUpdateDescription = handleSubmit(async (values) => {
    mutate(values)
  })

  return {
    setOnDescription,
    onDescription,
    setJsonDescription,
    onJsonDescription,
    errors,
    onEditDescription,
    editor,
    activeMedia,
    onSetActiveMedia,
    setOnHtmlDescription,
    onUpdateDescription,
    isPending,
  }
}

export const useMediaGallery = (groupid: string) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof UpdateGallerySchema>>({
    resolver: zodResolver(UpdateGallerySchema),
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-gallery"],
    mutationFn: async (values: z.infer<typeof UpdateGallerySchema>) => {
      if (values.videourl) {
        const update = await onUpdateGroupGallery(groupid, values.videourl)
        if (update && update.status !== 200) {
          return toast("Error", {
            description: update?.message,
          })
        }
      }
      if (values.image && values.image.length) {
        let count = 0
        while (count < values.image.length) {
          const uploaded = await upload.uploadFile(values.image[count])
          if (uploaded) {
            const update = await onUpdateGroupGallery(groupid, uploaded.uuid)
            if (update?.status !== 200) {
              toast("Error", {
                description: update?.message,
              })
              break
            }
          } else {
            toast("Error", {
              description: "Looks like something went wrong!",
            })
            break
          }
          console.log("increment")
          count++
        }
      }

      return toast("Success", {
        description: "Group gallery updated",
      })
    },
  })

  const onUpdateGallery = handleSubmit(async (values) => mutate(values))

  return {
    register,
    errors,
    onUpdateGallery,
    isPending,
  }
}

export const useGroupChat = (groupid: string) => {
  const { data } = useQuery({
    queryKey: ["member-chats"],
    queryFn: () => onGetAllGroupMembers(groupid),
  })

  const pathname = usePathname()

  return { data, pathname }
}

export const useChatWindow = (recieverid: string) => {
  const { data, isFetched } = useQuery({
    queryKey: ["user-messages"],
    queryFn: () => onGetAllUserMessages(recieverid),
  })

  const messageWindowRef = useRef<HTMLDivElement | null>(null)

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    supabaseClient
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
        },
        async (payload) => {
          dispatch(
            onChat({
              chat: [
                ...(payload.new as {
                  id: string
                  message: string
                  createdAt: Date
                  senderid: string | null
                  recieverId: string | null
                }[]),
              ],
            }),
          )
        },
      )
      .subscribe()
  }, [])

  useEffect(() => {
    onScrollToBottom()
  }, [messageWindowRef])

  const dispatch: AppDispatch = useDispatch()

  if (isFetched && data?.messages) dispatch(onChat({ chat: data.messages }))

  return { messageWindowRef }
}

export const useSendMessage = (recieverId: string) => {
  const { register, reset, handleSubmit } = useForm<
    z.infer<typeof SendNewMessageSchema>
  >({
    resolver: zodResolver(SendNewMessageSchema),
  })

  const { mutate } = useMutation({
    mutationKey: ["send-new-message"],
    mutationFn: (data: { messageid: string; message: string }) =>
      onSendMessage(recieverId, data.messageid, data.message),
    onMutate: () => reset(),
    onSuccess: () => {
      return
    },
  })

  const onSendNewMessage = handleSubmit(async (values) =>
    mutate({ messageid: v4(), message: values.message }),
  )

  return { onSendNewMessage, register }
}

export const useCustomDomain = (groupid: string) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof AddCustomDomainSchema>>({
    resolver: zodResolver(AddCustomDomainSchema),
  })

  const client = useQueryClient()

  const { data } = useQuery({
    queryKey: ["domain-config"],
    queryFn: () => onGetDomainConfig(groupid),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { domain: string }) =>
      onAddCustomDomain(groupid, data.domain),
    onMutate: reset,
    onSuccess: (data) => {
      return toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      })
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["domain-config"],
      })
    },
  })

  const onAddDomain = handleSubmit(async (values) => mutate(values))

  return {
    onAddDomain,
    isPending,
    register,
    errors,
    data,
  }
}
