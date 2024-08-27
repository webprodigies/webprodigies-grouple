"use client"

import { DropDown } from "@/components/global/drop-down"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CarotSort } from "@/icons"
import { Group } from "lucide-react"
import Link from "next/link"

type GroupDropDownProps = {
  members?: {
    Group: {
      channel: {
        id: string
      }[]
      id: string
      name: string
      icon: string | null
    } | null
  }[]
  groups:
    | {
        status: number
        groups: {
          channel: {
            id: string
          }[]
          id: string
          name: string
          icon: string | null
        }[]
      }
    | {
        status: number
        groups?: undefined
      }
}

export const GroupDropDown = ({ groups, members }: GroupDropDownProps) => {
  const { groups: userGroups } = groups

  return (
    <DropDown
      title="Owned Groups"
      trigger={
        <Button
          variant="ghost"
          className="rounded-2xl hover:bg-themeGray font-medium flex gap-2"
        >
          Grouple.
          <CarotSort />
        </Button>
      }
    >
      {userGroups &&
        userGroups.length > 0 &&
        userGroups.map((item) => (
          <Link
            key={item.id}
            href={`/group/${item.id}/channel/${item.channel[0].id}`}
          >
            <Button
              variant="ghost"
              className="flex gap-2 w-full justify-start hover:bg-themeGray items-center"
            >
              <Group />
              {item.name}
            </Button>
          </Link>
        ))}
      <Separator orientation="horizontal" />
      {members &&
        members.length > 0 &&
        members.map((member) => (
          <Link
            key={member.Group?.id}
            href={`/group/${member.Group?.id}/channel/${member.Group?.channel[0].id}`}
          >
            <Button
              variant="ghost"
              className="flex gap-2 w-full justify-start hover:bg-themeGray items-center"
            >
              <Group />
              {member.Group?.name}
            </Button>
          </Link>
        ))}
    </DropDown>
  )
}
