"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { useCustomDomain } from "@/hooks/groups"

import { cn } from "@/lib/utils"
import { CircleAlert, CircleCheck } from "lucide-react"

type CustomDomainFormProps = {
  groupid: string
}

export const CustomDomainForm = ({ groupid }: CustomDomainFormProps) => {
  const { register, errors, onAddDomain, isPending, data } =
    useCustomDomain(groupid)


  return (
    <div className="flex flex-col gap-y-5">
      <form className="mt-10 flex gap-x-5 items-end" onSubmit={onAddDomain}>
        <FormGenerator
          register={register}
          errors={errors}
          name="domain"
          label="Domain"
          inputType="input"
          type="text"
          placeholder={data?.domain ? data.domain : "e.g example.com"}
        />
        <Button className="bg-themeBlack border-themeGray" variant="outline">
          <Loader loading={isPending}>Add Domain</Loader>
        </Button>
      </form>
      <div
        className={cn(
          "flex gap-x-5 bg-themeBlack p-4 rounded-xl text-sm items-center",
          data?.status.misconfigured ? "text-red-500" : "text-white",
        )}
      >
        {data?.status.misconfigured ? (
          <CircleAlert size={20} />
        ) : (
          <CircleCheck size={20} />
        )}
        <p>
          {data?.status.misconfigured
            ? "DNS not configured correctly"
            : "DNS configured correctly"}
        </p>
      </div>
    </div>
  )
}
