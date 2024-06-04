"use client"
import { Video, VideoOff } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import ActionTooltip from "../ActionTooltip"


import React from 'react'

type Props = {}

const ChatVideoButton = (props: Props) => {
    const sp = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const isVideo = sp?.get("video")

    const onClick = () => {
        const url = qs.stringifyUrl({
            url:pathname || "",
            query:{
                video: isVideo ? undefined : true
            }
        }, {skipNull:true})

        router.push(url)
    }

    const Icon = isVideo ? VideoOff : Video
    const label = isVideo ? "End Video Call" : "Start Video Call"
  return (
    <ActionTooltip label={label}>
        <button onClick={onClick} className="hover:opacity-75 transition mr-4">
            <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400"/>
        </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton