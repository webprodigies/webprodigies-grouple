import { onVerifyAffilateLink } from "@/actions/groups"
import { redirect } from "next/navigation"

const AffiliatesPage = async ({ params }: { params: { id: string } }) => {
  const status = await onVerifyAffilateLink(params.id)

  if (status.status === 200) {
    return redirect(`/group/create?affiliate=${params.id}`)
  }

  if (status.status !== 200) {
    return redirect("/")
  }
}

export default AffiliatesPage
