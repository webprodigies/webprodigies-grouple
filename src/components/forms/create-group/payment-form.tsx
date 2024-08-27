"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { usePayments } from "@/hooks/payment"
import { ErrorMessage } from "@hookform/error-message"
import { CardElement } from "@stripe/react-stripe-js"
import dynamic from "next/dynamic"
import Link from "next/link"

type Props = {
  userId: string
  affiliate: boolean
  stripeId?: string
}

const GroupList = dynamic(
  () =>
    import("@/components/global/group-list-slider").then(
      (component) => component.GroupListSlider,
    ),
  {
    ssr: false,
  },
)

const PaymentForm = ({ affiliate, userId, stripeId }: Props) => {
  const {
    onCreateGroup,
    isPending,
    register,
    errors,
    isCategory,
    creatingIntent,
  } = usePayments(userId, affiliate)

  return (
    <Loader loading={creatingIntent}>
      <form className="pt-5" onSubmit={onCreateGroup}>
        <GroupList
          selected={isCategory}
          register={register}
          label="Select Category"
          slidesOffsetBefore={28}
        />
        <div className="px-7 mb-2">
          <ErrorMessage
            errors={errors}
            name={"category"}
            render={({ message }) => (
              <p className="text-red-400">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </div>
        <div className="px-7">
          <FormGenerator
            register={register}
            name="name"
            errors={errors}
            inputType="input"
            type="text"
            placeholder="Group Name"
          />
        </div>
        <div className="px-7 my-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#B4B0AE",
                  "::placeholder": {
                    color: "#B4B0AE",
                  },
                },
              },
            }}
            className="bg-themeBlack border-[1px] border-themeGray outline-none rounded-lg p-3"
          />
        </div>
        <div className="px-7 flex flex-col gap-5">
          <p className="text-sm text-themeTextGray">
            Cancel anytime with 1-click. By clicking below, you accept
            our terms.
          </p>
          <Link className="text-sm text-themeTextGray" href={"/explore"}>
            Skip for now
          </Link>
          <Button
            variant="outline"
            type="submit"
            className="bg-themeBlack border-themeGray rounded-xl"
          >
            <Loader loading={isPending}>Get Started</Loader>
          </Button>
        </div>
      </form>
    </Loader>
  )
}

export default PaymentForm
