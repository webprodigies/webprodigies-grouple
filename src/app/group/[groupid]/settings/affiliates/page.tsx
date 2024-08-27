import { onGetAffiliateLink } from "@/actions/groups"
import { CopyButton } from "@/components/global/copy-button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

type Props = {
  params: { groupid: string }
}

const Affiliate = async ({ params }: Props) => {
  const affiliate = await onGetAffiliateLink(params.groupid)
  return (
    <div className="flex flex-col items-start p-5">
      <Card className="border-themeGray bg-[#1A1A1D] p-5">
        <CardTitle className="text-3xl">Affiliate Link</CardTitle>
        <CardDescription className="text-themeTextGray">
          Create and share an invitations link
        </CardDescription>
        <div className="mt-8 flex flex-col gap-y-2">
          <div className="bg-black border-themeGray p-3 rounded-lg flex gap-x-5 items-center">
            http://localhost:3000/affiliates/
            {affiliate.affiliate?.id}
            <CopyButton
              content={`http://localhost:3000/affiliates/${affiliate.affiliate?.id}`}
            />
          </div>
          <CardDescription className="text-themeTextGray">
            This link will redirect users to the main page where <br />
            they can purchase or request memberships
          </CardDescription>
        </div>
      </Card>
    </div>
  )
}

export default Affiliate
