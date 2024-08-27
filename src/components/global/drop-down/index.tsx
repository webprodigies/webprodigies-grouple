"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

type DropDownProps = {
  title: string
  trigger: JSX.Element
  children: React.ReactNode
  ref?: React.RefObject<HTMLButtonElement>
}

export const DropDown = ({ trigger, title, children, ref }: DropDownProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild ref={ref}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="rounded-2xl w-56 items-start bg-themeBlack border-themeGray bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-4xl p-4">
        <h4 className="text-sm pl-3">{title}</h4>
        <Separator className="bg-themeGray my-3" />
        {children}
      </PopoverContent>
    </Popover>
  )
}
