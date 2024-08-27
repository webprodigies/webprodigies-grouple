"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSendMessage } from "@/hooks/groups"

import { Mic, Send } from "lucide-react"

type HuddlesFormProps = {
  recieverid: string
}

export const HuddlesForm = ({ recieverid }: HuddlesFormProps) => {
  const { register, onSendNewMessage } = useSendMessage(recieverid)
  return (
    <div>
      <form
        onSubmit={onSendNewMessage}
        className="bg-themeBlack flex p-3 rounded-2xl mb-16 md:mb-0"
      >
        <div className="flex gap-x-2 flex-1 items-center">
          <Mic />
          <Input
            className="bg-transparent outline-none border-none"
            {...register("message")}
            placeholder="Type your message here..."
          />
        </div>
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          type="submit"
        >
          <Send className="text-themeGray hover:text-themeTextGray" />
        </Button>
      </form>
    </div>
  )
}
