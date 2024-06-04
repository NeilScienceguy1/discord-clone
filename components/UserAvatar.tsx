import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'

interface Props {
    src?: string,
    className?: string
}

const UserAvatar = (props: Props) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", props.className)}>
        <AvatarImage src={props.src} />
    </Avatar>
  )
}

export default UserAvatar