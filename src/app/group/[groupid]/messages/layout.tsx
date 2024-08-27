import GlassSheet from "@/components/global/glass-sheet"
import { Menu } from "lucide-react"
import { GroupChatMenu } from "./_components/chat-menu"

type HuddlesLayoutProps = {
  children: React.ReactNode
  params: { groupid: string }
}

const HuddlesLayout = async ({ children, params }: HuddlesLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 flex-1 h-0">
      <div className="lg:col-span-4 flex flex-col">
        <div className="flex justify-between items-center p-5 lg:hidden">
          <p className="font-medium text-themeTextWhite">No chat selected</p>
          <GlassSheet trigger={<Menu />}>
            <GroupChatMenu groupid={params.groupid} />
          </GlassSheet>
        </div>
        {children}
      </div>
      <div className="hidden lg:inline lg:col-span-2 bg-themeBlack rounded-tl-3xl overflow-auto">
        <GroupChatMenu groupid={params.groupid} />
      </div>
    </div>
  )
}

export default HuddlesLayout
