"use client"

import { useEffect, useState } from "react"
import ServerModal from "../modals/ServerModal"
import {InviteModal} from "../modals/InviteModal"
import EditServerModal from "../modals/EditServerModal"
import MembersModal from "../modals/Members"
import ChannelModal from "../modals/ChannelModal"
import { LeaveServer } from "../modals/LeaveServer"
import { DeleteServer } from "../modals/DeleteServer"
import { DeleteChannel } from "../modals/DeleteChannel"
import EditChannelModal from "../modals/EditChannel"
import MessageFile from "../modals/MessageFile"
import { DeleteMessage } from "../modals/DeleteMessage"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])
    return (
        <>
            <ServerModal/>
            <InviteModal/>
            <EditServerModal/>
            <MembersModal/>
            <ChannelModal/>
            <LeaveServer/>
            <DeleteServer/>
            <DeleteChannel/>
            <EditChannelModal/>
            <MessageFile/>
            <DeleteMessage/>
        </>
    )
}