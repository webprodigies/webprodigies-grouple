import { cn } from "@/lib/utils"

type Props = {
  element?: "H1" | "H2"
  children: React.ReactNode
  className?: string
}

const GradientText = ({ children, className, element }: Props) => {
  switch (element) {
    case "H1":
      return <h1 className={cn(className, "text-gradient")}>{children}</h1>
    case "H2":
      return <h2 className={cn(className, "text-gradient")}>{children}</h2>
    default:
      return <p className={cn(className, "text-gradient")}>{children}</p>
  }
}

export default GradientText
