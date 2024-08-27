"use server"
import { client } from "@/lib/prisma"
import Stripe from "stripe"
import { onAuthenticatedUser } from "./auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
  apiVersion: "2024-06-20",
})

export const onGetStripeClientSecret = async () => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: 9900,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    if (paymentIntent) {
      return { secret: paymentIntent.client_secret }
    }
  } catch (error) {
    return { status: 400, message: "Failed to load form" }
  }
}

export const onTransferCommission = async (destination: string) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: 3960,
      currency: "usd",
      destination: destination,
    })

    if (transfer) {
      return { status: 200 }
    }
  } catch (error) {
    return { status: 400 }
  }
}

export const onGetActiveSubscription = async (groupId: string) => {
  try {
    const subscription = await client.subscription.findFirst({
      where: {
        groupId: groupId,
        active: true,
      },
    })

    if (subscription) {
      return { status: 200, subscription }
    }
  } catch (error) {
    return { status: 404 }
  }
}

export const onGetGroupSubscriptionPaymentIntent = async (groupid: string) => {
  console.log("running")
  try {
    const price = await client.subscription.findFirst({
      where: {
        groupId: groupid,
        active: true,
      },
      select: {
        price: true,
        Group: {
          select: {
            User: {
              select: {
                stripeId: true,
              },
            },
          },
        },
      },
    })

    if (price && price.price) {
      console.log("🟣", price.Group?.User.stripeId)
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: price.price * 100,
        automatic_payment_methods: {
          enabled: true,
        },
      })

      if (paymentIntent) {
        return { secret: paymentIntent.client_secret }
      }
    }
  } catch (error) {
    return { status: 400, message: "Failed to load form" }
  }
}

export const onCreateNewGroupSubscription = async (
  groupid: string,
  price: string,
) => {
  try {
    const subscription = await client.group.update({
      where: {
        id: groupid,
      },
      data: {
        subscription: {
          create: {
            price: parseInt(price),
          },
        },
      },
    })

    if (subscription) {
      return { status: 200, message: "Subscription created" }
    }
  } catch (error) {
    return { status: 400, message: "Oops something went wrong" }
  }
}

export const onActivateSubscription = async (id: string) => {
  try {
    const status = await client.subscription.findUnique({
      where: {
        id,
      },
      select: {
        active: true,
      },
    })
    if (status) {
      if (status.active) {
        return { status: 200, message: "Plan already active" }
      }
      if (!status.active) {
        const current = await client.subscription.findFirst({
          where: {
            active: true,
          },
          select: {
            id: true,
          },
        })
        if (current && current.id) {
          const deactivate = await client.subscription.update({
            where: {
              id: current.id,
            },
            data: {
              active: false,
            },
          })

          if (deactivate) {
            const activateNew = await client.subscription.update({
              where: {
                id,
              },
              data: {
                active: true,
              },
            })

            if (activateNew) {
              return {
                status: 200,
                message: "New plan activated",
              }
            }
          }
        } else {
          const activateNew = await client.subscription.update({
            where: {
              id,
            },
            data: {
              active: true,
            },
          })

          if (activateNew) {
            return {
              status: 200,
              message: "New plan activated",
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    return { status: 400, message: "Oops something went wrong" }
  }
}

export const onGetStripeIntegration = async () => {
  try {
    const user = await onAuthenticatedUser()
    const stripeId = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        stripeId: true,
      },
    })

    if (stripeId) {
      return stripeId.stripeId
    }
  } catch (error) {
    console.log(error)
  }
}
