"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGroupChat } from "@/hooks/groups"

import { useAppSelector } from "@/redux/store"
import { User } from "lucide-react"
import Link from "next/link"

type GroupChatMenuProps = {
  groupid: string
}

export const GroupChatMenu = ({ groupid }: GroupChatMenuProps) => {
  const { members } = useAppSelector((state) => state.onlineTrackingReducer)

  const { data, pathname } = useGroupChat(groupid)

  return (
    <div className="flex flex-col">
      {data?.status === 200 &&
        data.members?.map((member) => (
          <Link
            href={`${pathname}/${member.id}`}
            key={member.id}
            className="flex gap-x-2 items-center p-5 hover:bg-themeGray"
          >
            <div className="relative">
              {members.map(
                (m) =>
                  m.id == member.userId && (
                    <span
                      key={m.id}
                      className="absolute bottom-0 right-0 z-50 w-2 h-2 rounded-full bg-green-600"
                    ></span>
                  ),
              )}
              <Avatar>
                <AvatarImage src={member.User?.image!} alt="user" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <h3>{`${member.User?.firstname} ${member.User?.lastname}`}</h3>
              <p className="text-sm text-themeTextGray">
                No active chat found...
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
