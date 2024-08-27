import { RefreshCcw } from "lucide-react"
import {
  Buisness,
  Fitness,
  LifeStyle,
  Music,
  PersonalDevelopment,
  SocialMedia,
  Tech,
} from "../icons"

export type GroupListProps = {
  id: string
  label: string
  icon: JSX.Element
  path: string
}

export const GROUP_LIST: GroupListProps[] = [
  {
    id: "0",
    label: "All",
    icon: <RefreshCcw />,
    path: "",
  },
  {
    id: "1",
    label: "Fitness",
    icon: <Fitness />,
    path: "fitness",
  },
  {
    id: "2",
    label: "Music",
    icon: <Music />,
    path: "music",
  },
  {
    id: "3",
    label: "Buisness",
    icon: <Buisness />,
    path: "buisness",
  },
  {
    id: "4",
    label: "Lifestyle",
    icon: <LifeStyle />,
    path: "lifestyle",
  },
  {
    id: "5",
    label: "Personal Development",
    icon: <PersonalDevelopment />,
    path: "personal-development",
  },
  {
    id: "6",
    label: "Social Media",
    icon: <SocialMedia />,
    path: "social-media",
  },
  {
    id: "7",
    label: "Tech",
    icon: <Tech />,
    path: "tech",
  },
]
