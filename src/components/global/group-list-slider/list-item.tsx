"use client"

import { cn } from "@/lib/utils"

type GroupListItemProps = {
  icon: JSX.Element
  label: string
  selected?: string
}

export const GroupListItem = ({
  icon,
  label,
  selected,
}: GroupListItemProps) => {
  return (
    <div
      className={cn(
        "flex  gap-3 items-center py-2 px-4 rounded-2xl bg-themeGray border-2 cursor-pointer",
        selected === label ? "border-themeTextGray" : "border-themeGray",
      )}
    >
      {icon}
      {label}
    </div>
  )
}
