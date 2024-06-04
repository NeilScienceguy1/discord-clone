"use client"
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import ActionTooltip from '../ActionTooltip'

interface Props {
    id: string,
    imageUrl: string,
    name: string
}

const NavItem = (props: Props) => {
    const params = useParams()
    const router = useRouter()
    const onClick = () => {
        router.push(`/servers/${props.id}`)
    }
  return (
    <ActionTooltip side='right' align='center' label={props.name}>
        <button className='group relative flex items-center' onClick={onClick}>
            <div className={cn("absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== props.id && "group-hover:h-[20px]",
            params?.serverId === props.id ? "h-[36px]" : "h-[8px]"
            )}/>
            <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden", params?.serverId == props.id && "bg-primary/10 text-primary rounded-[16px]")}>
                <Image fill src={props.imageUrl} alt='server'/>
            </div>
        </button>
    </ActionTooltip>
  )
}

export default NavItem