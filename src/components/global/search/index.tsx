"use client"

import { Input } from "@/components/ui/input"
import { useSearch } from "@/hooks/groups"
import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"

type Props = {
  className?: string
  inputStyle?: string
  placeholder?: string
  searchType: "GROUPS" | "POSTS"
  iconStyle?: string
  glass?: boolean
}

const Search = ({
  searchType,
  className,
  glass,
  iconStyle,
  inputStyle,
  placeholder,
}: Props) => {
  const { query, onSearchQuery } = useSearch(searchType)

  return (
    <div
      className={cn(
        "border-2 flex gap-2 items-center",
        className,
        glass &&
          "bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-20",
      )}
    >
      <SearchIcon className={cn(iconStyle || "text-themeTextGray")} />
      <Input
        onChange={onSearchQuery}
        value={query}
        className={cn("bg-transparent border-0", inputStyle)}
        placeholder={placeholder}
        type="text"
      />
    </div>
  )
}

export default Search
