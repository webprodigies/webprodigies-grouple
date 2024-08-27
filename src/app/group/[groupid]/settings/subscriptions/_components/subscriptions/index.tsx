"use client"

import { useAllSubscriptions } from "@/hooks/payment"
import { SubscriptionCard } from "../card"

type SubscriptionsProps = {
  groupid: string
}

export const Subscriptions = ({ groupid }: SubscriptionsProps) => {
  const { data, mutate } = useAllSubscriptions(groupid)

  return data?.status === 200 && data.subscriptions ? (
    data.subscriptions.map((subscription) => (
      <SubscriptionCard
        active={subscription.active}
        onClick={() => mutate({ id: subscription.id })}
        key={subscription.id}
        price={`${subscription.price}`}
        members={`${data.count}`}
      />
    ))
  ) : (
    <></>
  )
}
