"use client"

import { cn } from '@/lib/utils'
import { Member, MemberRole, Profile, Server } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { memo } from 'react'
import UserAvatar from '../UserAvatar'
import ActionTooltip from '../ActionTooltip'

interface Props {
    member: Member & {profile: Profile},
    server: Server
}

const roleIconMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
    ),
    [MemberRole.GUEST]: null,
  };

const ServerMember = (props: Props) => {
    const router = useRouter()
    const params = useParams()

    const onClick = () => {
      router.push(`/servers/${props.server.id}/conversations/${props.member.id}`)
    }

    const icon = roleIconMap[props.member.role]
  return (
    <button className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.memberId === props.member.id && "bg-zinc-700/20 dark:bg-zinc-700")} onClick={onClick}>
        <UserAvatar src={props.member.profile.imageUrl} className='h-8 w-8 md:h-8 md:w-8'/>
        <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.memberId === props.member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
            {props.member.profile.name}
        </p>
        <ActionTooltip label={props.member.role.toLowerCase()}>
            {icon}
        </ActionTooltip>
    </button>
  )
}

export default ServerMember