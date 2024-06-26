"use client"

import { cn } from '@/lib/utils'
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import ActionTooltip from '../ActionTooltip'
import { ModalType, useModal } from '@/hooks/useModalStore'

interface Props {
    channel: Channel,
    server: Server,
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: Hash ,
    [ChannelType.AUDIO]: Mic ,
    [ChannelType.VIDEO]: Video 
  }
  
const ServerChannel = (props: Props) => {
    const params = useParams()
    const router = useRouter()
    const {onOpen} = useModal()

    const Icon = iconMap[props.channel.type]
    const onClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${props.channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation()
        onOpen(action, {channel: props.channel, server: props.server})
    }
  return (
    <button className={cn("group py-2 px-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-3", params?.channelId == props.channel.id && "bg-zinc-700/20 dark:bg-zinc-700")} onClick={onClick}>
        <Icon className="!flex-shrink-0 !w-5 !h-5 !text-zinc-500 dark:!text-zinc-400" />
        <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition", params?.channelId == props.channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>{props.channel.name}</p>
        {props.channel.name != "general" && props.role != MemberRole.GUEST && (
            <div className="ml-auto flex items-center gap-x-2">
                <ActionTooltip label='Edit'>
                    <Edit className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition' onClick={(e) => onAction(e, "editChannel")}/>
                </ActionTooltip>
                <ActionTooltip label='Delete'>
                    <Trash className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition' onClick={(e) => onAction(e, "deleteChannel")}/>
                </ActionTooltip>
            </div>
        )}
        {props.channel.name == "general" && (
            <ActionTooltip label='Locked'>
                <Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400' />
            </ActionTooltip>
        )}
    </button>
  )
}

export default ServerChannel