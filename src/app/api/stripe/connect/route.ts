import { onAuthenticatedUser } from "@/actions/auth"
import { client } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-06-20",
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const groupid = searchParams.get("groupid")

    const account = await stripe.accounts.create({
      type: "standard",
      country: "US",
      business_type: "individual",
    })

    if (account) {
      console.log(account)
      const user = await onAuthenticatedUser()
      const integrateStripeAccount = await client.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeId: account.id,
        },
      })

      if (integrateStripeAccount) {
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `http://localhost:3000/callback/stripe/refresh`,
          return_url: `http://localhost:3000/group/${groupid}/settings/integrations`,
          type: "account_onboarding",
        })
        console.log(accountLink)
        return NextResponse.json({
          url: accountLink.url,
        })
      }
    }
  } catch (error) {
    return new NextResponse(
      "An error occurred when calling the Stripe API to create an account:",
    )
  }
}
