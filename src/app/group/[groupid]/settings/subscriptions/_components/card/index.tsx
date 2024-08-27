import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

type SubscriptionCardProps = {
  optimisitc?: boolean
  price: string
  members: string
  onClick?(): void
  active?: boolean
}

export const SubscriptionCard = ({
  optimisitc,
  price,
  members,
  onClick,
  active,
}: SubscriptionCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "bg-themeBlack cursor-pointer text-themeTextGray flex flex-col gap-y-3 justify-center aspect-video items-center",
        optimisitc ? "opacity-60" : "",
        active ? "border-purple-800 border-2" : "border-none",
      )}
    >
      <h3 className="text-2xl">${price}/month</h3>
      <div className="flex items-center gap-x-2 text-sm">
        <User size={20} />
        <p>{members} Members</p>
      </div>
    </Card>
  )
}
