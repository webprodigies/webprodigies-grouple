import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type LeaderBoardCardProps = {
  light?: boolean
}

export const LeaderBoardCard = ({ light }: LeaderBoardCardProps) => {
  return (
    <Card
      className={cn(
        "border-themeGray lg:sticky lg:top-0 mt-10 lg:mt-0 rounded-xl p-5 overflow-hidden",
        light ? "border-themeGray bg-[#1A1A1D]" : "bg-themeBlack",
      )}
    >
      <h2 className="text-themeTextWhite text-xl font-bold">
        leaderboard (30-days)
      </h2>
      <p className="text-themeTextGray text-sm">
        See who performed the best this month.
      </p>
    </Card>
  )
}
