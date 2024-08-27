import { onGetStripeIntegration } from "@/actions/payments"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { INTEGRATION_LIST_ITEMS } from "@/constants/menus"

import Image from "next/image"
import IntegrationTrigger from "./_components/integration-trigger"

const IntegrationsPage = async ({
  params,
}: {
  params: { groupid: string }
}) => {
  const payment = await onGetStripeIntegration()
  const connections = {
    stripe: payment ? true : false,
  }
  return (
    <div className="flex-1 h-0 grid grid-cols-1 p-5 content-start lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {INTEGRATION_LIST_ITEMS.map((item) => (
        <Card key={item.id} className="bg-themeBlack border-themeDarkGray">
          <CardContent className="flex flex-col p-5 gap-2">
            <div className="flex w-full justify-between items-start gap-x-20">
              <div className="">
                <div className="w-10 h-10 relative">
                  <Image
                    src={`/stripe.png`}
                    alt="Logo"
                    width={60}
                    height={60}
                  />
                </div>
                <h2 className="font-bold capitalize">{item.name}</h2>
              </div>
              <IntegrationTrigger
                connections={connections}
                title={item.title}
                descrioption={item.modalDescription}
                logo={item.logo}
                name={item.name}
                groupid={params.groupid}
              />
            </div>
            <CardDescription>{item.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default IntegrationsPage
