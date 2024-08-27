import { GlassModal } from "@/components/global/glass-modal"
import { JoinGroupPaymentForm } from "@/components/global/join-group"
import { StripeElements } from "@/components/global/stripe/elements"
import { Button } from "@/components/ui/button"
import { useActiveGroupSubscription, useJoinFree } from "@/hooks/payment"

type JoinButtonProps = {
  owner: boolean
  groupid: string
}

export const JoinButton = ({ owner, groupid }: JoinButtonProps) => {
  const { data } = useActiveGroupSubscription(groupid)
  const { onJoinFreeGroup } = useJoinFree(groupid)

  if (!owner) {
    if (data?.status === 200) {
      return (
        <GlassModal
          trigger={
            <Button className="w-full p-10" variant="ghost">
              <p>Join ${data.subscription?.price}/Month</p>
            </Button>
          }
          title="Join this group"
          description="Pay now to join this community"
        >
          <StripeElements>
            <JoinGroupPaymentForm groupid={groupid} />
          </StripeElements>
        </GlassModal>
      )
    }
    return (
      <Button onClick={onJoinFreeGroup} className="w-full p-10" variant="ghost">
        Join now
      </Button>
    )
  }

  return (
    <Button disabled={owner} className="w-full p-10" variant="ghost">
      Owner
    </Button>
  )
}
