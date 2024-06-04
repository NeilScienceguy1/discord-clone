"use client"

import { ServerWithMembersWithProfiles } from '@/types'
import { ChannelType, MemberRole } from '@prisma/client'
import React from 'react'
import ActionTooltip from '../ActionTooltip'
import { Plus, Settings } from 'lucide-react'
import { useModal } from '@/hooks/useModalStore'

interface Props {
    label: string,
    role?: MemberRole,
    sectionType: "channels" | "members",
    channelType?: ChannelType,
    server?: ServerWithMembersWithProfiles
}

const ServerSection = (props: Props) => {
    const {onOpen} = useModal()

  return (
    <div className='flex items-center justify-between py-2'>
        <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
            {props.label}
        </p>
        {props.role !== MemberRole.GUEST && props.sectionType == "channels" && (
            <ActionTooltip label='Create Channel' side='top'>
                <button className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition' onClick={() => onOpen("createChannel", {channelType:props.channelType})}>
                    <Plus className='h-4 w-4' />
                </button>
            </ActionTooltip>
        )}
        {props.role !== MemberRole.GUEST && props.sectionType == "members" && (
            <ActionTooltip label='Manage Members' side='top'>
                <button className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'>
                    <Settings className='h-4 w-4' />
                </button>
            </ActionTooltip>
        )}
    </div>
  )
}

export default ServerSection