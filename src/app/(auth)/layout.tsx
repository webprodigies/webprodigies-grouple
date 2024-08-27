import { onAuthenticatedUser } from "@/actions/auth"
import BackdropGradient from "@/components/global/backdrop-gradient"
import GlassCard from "@/components/global/glass-card"
import { redirect } from "next/navigation"

type Props = {
  children: React.ReactNode
}

const AuthLayout = async ({ children }: Props) => {
  const user = await onAuthenticatedUser()

  if (user.status === 200) redirect("/callback/sign-in")

  return (
    <div className="container h-screen flex justify-center items-center">
      <div className="flex flex-col w-full items-center py-24">
        <h2 className="text-4xl font-bold text-themeTextWhite">Grouple.</h2>
        <BackdropGradient
          className="w-4/12 h-2/6 opacity-40"
          container="flex flex-col items-center"
        >
          <GlassCard className="xs:w-full md:w-7/12 lg:w-5/12 xl:w-4/12 p-7 mt-16">
            {children}
          </GlassCard>
        </BackdropGradient>
      </div>
    </div>
  )
}

export default AuthLayout
