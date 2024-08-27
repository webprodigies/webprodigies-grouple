"use client"
import {
  onCreateNewGroup,
  onGetGroupChannels,
  onGetGroupSubscriptions,
  onJoinGroup,
} from "@/actions/groups"
import {
  onActivateSubscription,
  onCreateNewGroupSubscription,
  onGetActiveSubscription,
  onGetGroupSubscriptionPaymentIntent,
  onGetStripeClientSecret,
  onTransferCommission,
} from "@/actions/payments"
import { CreateGroupSchema } from "@/components/forms/create-group/schema"
import { CreateGroupSubscriptionSchema } from "@/components/forms/subscription/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { StripeCardElement, loadStripe } from "@stripe/stripe-js"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export const useStripeElements = () => {
  const StripePromise = async () =>
    await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as string)

  return { StripePromise }
}

export const usePayments = (
  userId: string,
  affiliate: boolean,
  stripeId?: string,
) => {
  const [isCategory, setIsCategory] = useState<string | undefined>(undefined)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const {
    reset,
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm<z.infer<typeof CreateGroupSchema>>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      category: "",
    },
  })

  useEffect(() => {
    const category = watch(({ category }) => {
      if (category) {
        setIsCategory(category)
      }
    })
    return () => category.unsubscribe()
  }, [watch])

  const { data: Intent, isPending: creatingIntent } = useQuery({
    queryKey: ["payment-intent"],
    queryFn: () => onGetStripeClientSecret(),
  })

  const { mutateAsync: createGroup, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof CreateGroupSchema>) => {
      if (!stripe || !elements || !Intent) {
        return null
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        Intent.secret!,
        {
          payment_method: {
            card: elements.getElement(CardElement) as StripeCardElement,
          },
        },
      )

      if (error) {
        return toast("Error", {
          description: "Oops! something went wrong, try again later",
        })
      }

      if (paymentIntent?.status === "succeeded") {
        if (affiliate) {
          await onTransferCommission(stripeId!)
        }
        const created = await onCreateNewGroup(userId, data)
        if (created && created.status === 200) {
          toast("Success", {
            description: created.message,
          })
          router.push(
            `/group/${created.data?.group[0].id}/channel/${created.data?.group[0].channel[0].id}`,
          )
        }
        if (created && created.status !== 200) {
          reset()
          return toast("Error", {
            description: created.message,
          })
        }
      }
    },
  })

  const onCreateGroup = handleSubmit(async (values) => createGroup(values))

  return {
    onCreateGroup,
    isPending,
    register,
    errors,
    isCategory,
    creatingIntent,
  }
}

export const useActiveGroupSubscription = (groupId: string) => {
  const { data } = useQuery({
    queryKey: ["active-subscription"],
    queryFn: () => onGetActiveSubscription(groupId),
  })

  return { data }
}

export const useJoinFree = (groupid: string) => {
  const router = useRouter()
  const onJoinFreeGroup = async () => {
    const member = await onJoinGroup(groupid)
    if (member?.status === 200) {
      const channels = await onGetGroupChannels(groupid)
      router.push(`/group/${groupid}/channel/${channels?.channels?.[0].id}`)
    }
  }

  return { onJoinFreeGroup }
}

export const useJoinGroup = (groupid: string) => {
  const stripe = useStripe()
  const elements = useElements()

  const router = useRouter()

  const { data: Intent } = useQuery({
    queryKey: ["group-payment-intent"],
    queryFn: () => onGetGroupSubscriptionPaymentIntent(groupid),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!stripe || !elements || !Intent) {
        return null
      }
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        Intent.secret!,
        {
          payment_method: {
            card: elements.getElement(CardElement) as StripeCardElement,
          },
        },
      )

      if (error) {
        console.log(error)
        return toast("Error", {
          description: "Oops! something went wrong, try again later",
        })
      }

      if (paymentIntent?.status === "succeeded") {
        const member = await onJoinGroup(groupid)
        if (member?.status === 200) {
          const channels = await onGetGroupChannels(groupid)
          router.push(`/group/${groupid}/channel/${channels?.channels?.[0].id}`)
        }
      }
    },
  })

  const onPayToJoin = () => mutate()

  return { onPayToJoin, isPending }
}

export const useGroupSubscription = (groupid: string) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof CreateGroupSubscriptionSchema>>({
    resolver: zodResolver(CreateGroupSubscriptionSchema),
  })

  const client = useQueryClient()

  const { mutate, isPending, variables } = useMutation({
    mutationFn: (data: { price: string }) =>
      onCreateNewGroupSubscription(groupid, data.price),
    onMutate: () => reset(),
    onSuccess: (data) =>
      toast(data?.status === 200 ? "Success" : "Error", {
        description: data?.message,
      }),
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["group-subscriptions"],
      })
    },
  })

  const onCreateNewSubscription = handleSubmit(async (values) =>
    mutate({ ...values }),
  )
  return { register, errors, onCreateNewSubscription, isPending, variables }
}

export const useAllSubscriptions = (groupid: string) => {
  const { data } = useQuery({
    queryKey: ["group-subscriptions"],
    queryFn: () => onGetGroupSubscriptions(groupid),
  })

  const client = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (data: { id: string }) => onActivateSubscription(data.id),
    onSuccess: (data) =>
      toast(data?.status === 200 ? "Success" : "Error", {
        description: data?.message,
      }),
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["group-subscriptions"],
      })
    },
  })

  return { data, mutate }
}

export const useStripeConnect = (groupid: string) => {
  const [onStripeAccountPending, setOnStripeAccountPending] =
    useState<boolean>(false)

  const onStripeConnect = async () => {
    try {
      setOnStripeAccountPending(true)
      const account = await axios.get(`/api/stripe/connect?groupid=${groupid}`)
      if (account) {
        setOnStripeAccountPending(false)
        if (account) {
          window.location.href = account.data.url
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return { onStripeConnect, onStripeAccountPending }
}
