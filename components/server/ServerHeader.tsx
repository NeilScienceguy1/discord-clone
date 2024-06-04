"use client"

import { ServerWithMembersWithProfiles } from '@/types'
import { MemberRole } from '@prisma/client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from '../ui/dropdown-menu'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'
import { useModal } from '@/hooks/useModalStore'

interface Props {
    server: ServerWithMembersWithProfiles,
    role?: MemberRole
}

const ServerHeader = (props: Props) => {
    const {onOpen} = useModal()
    const isAdmin = props.role === MemberRole.ADMIN
    const isModerator = isAdmin || props.role === MemberRole.MODERATOR
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none' asChild>
            <button className="w-full text-lg font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                {props.server.name}
                <ChevronDown className='h-5 w-5 ml-auto mr-5 md:mr-0' id='chevronDownIcon'></ChevronDown>
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
            <DropdownMenuItem className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer hover:outline-none' onClick={() => onOpen("invite", {server: props.server})}>
                Invite People
                <UserPlus className='h-4 w-4 ml-auto'/>
            </DropdownMenuItem>
            {isAdmin && <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer hover:outline-none' onClick={ () => onOpen("editServer", {server: props.server})}>
                Server Settings
                <Settings className='h-4 w-4 ml-auto'/>
            </DropdownMenuItem>}
            {isAdmin && <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer hover:outline-none' onClick={ () => onOpen("members", {server: props.server})}>
                Manage Members
                <Users className='h-4 w-4 ml-auto'/>
            </DropdownMenuItem>}
            {isModerator && <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer hover:outline-none' onClick={ () => onOpen("createChannel", {server: props.server})}>
                Create Channel
                <PlusCircle className='h-4 w-4 ml-auto'/>
            </DropdownMenuItem>}
            {isModerator && <DropdownMenuSeparator/>}
            {isAdmin && <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer hover:outline-none text-rose-500' onClick={ () => onOpen("deleteServer", {server: props.server})}>
                Delete Server
                <Trash className='h-4 w-4 ml-auto'/>
            </DropdownMenuItem>}
            {!isAdmin && <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer hover:outline-none text-rose-500' onClick={ () => onOpen("leaveServer", {server: props.server})}>
                Leave Server
                <LogOut className='h-4 w-4 ml-auto'/>
            </DropdownMenuItem>}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader