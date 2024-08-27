import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
}

const GlassCard = ({ children, className }: Props) => {
  return (
    <Card
      className={cn(
        className,
        "rounded-2xl bg-themeGray border-themeGray bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-4xl bg-opacity-40",
      )}
    >
      {children}
    </Card>
  )
}

export default GlassCard
