import { Hash, Menu } from 'lucide-react';
import React from 'react'
import MobileToggle from '../MobileToggle';
import UserAvatar from '../UserAvatar';
import SocketIndicator from '../SocketIndicator';
import ChatVideoButton from './ChatVideoButton';

interface Props {
    serverId: string,
    name: string,
    type: "channel" | "conversation";
    imageUrl?: string
}

const ChatHeader = (props: Props) => {
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
        <MobileToggle serverId={props.serverId}/>
        {props.type == "channel" && (
            <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2' />
        )}
        {props.type == "conversation" && (
          <UserAvatar src={props.imageUrl} className='h-8 w-8 md:h-8 md:w-8 mr-2'/>
        )}
        <p className="font-semibold text-lg text-black dark:text-white">
            {props.name}
        </p>
        <div className="ml-auto flex items-center">
          {props.type == "conversation" && (
            <ChatVideoButton/>
          )}
          <SocketIndicator/>
        </div>
    </div>
  )
}

export default ChatHeader