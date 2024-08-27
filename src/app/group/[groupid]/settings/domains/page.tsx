import { onGetDomainConfig } from "@/actions/groups"
import { CustomDomainForm } from "@/components/forms/domain"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

type Props = { params: { groupid: string } }

const DomainConfigPage = async ({ params }: Props) => {
  const client = new QueryClient()

  await client.prefetchQuery({
    queryKey: ["domain-config"],
    queryFn: () => onGetDomainConfig(params.groupid),
  })

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="flex flex-col items-start p-5 gap-y-5">
        <Card className="border-themeGray bg-[#1A1A1D] p-5">
          <CardTitle className="text-3xl">Domain Config</CardTitle>
          <CardDescription className="text-themeTextGray">
            Create and share an invitations link for your members{" "}
          </CardDescription>
          <CustomDomainForm groupid={params.groupid} />
        </Card>
        <Card className="border-themeGray bg-[#1A1A1D] p-5">
          <CardTitle className="text-3xl">Manual Config</CardTitle>
          <CardDescription className="text-themeTextGray">
            Setup your domain manually{" "}
          </CardDescription>
          <div className="flex gap-x-5 mt-8">
            <Label className="flex flex-col gap-y-3">
              Record
              <span className="bg-themeDarkGray p-3 rounded-lg text-xs text-themeTextGray">
                A
              </span>
            </Label>
            <Label className="flex flex-col gap-y-3">
              Host
              <span className="bg-themeDarkGray p-3 rounded-lg text-xs text-themeTextGray">
                @
              </span>
            </Label>
            <Label className="flex flex-col gap-y-3">
              Required Value
              <span className="bg-themeDarkGray p-3 rounded-lg text-xs text-themeTextGray">
                76.76.21.21
              </span>
            </Label>
          </div>
        </Card>
      </div>
    </HydrationBoundary>
  )
}

export default DomainConfigPage
