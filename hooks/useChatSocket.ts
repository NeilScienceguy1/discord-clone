import { useSocket } from "@/components/providers/SocketProvider"
import { Member, Message, Profile } from "@prisma/client"
import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

type Props = {
    addKey: string,
    queryKey: string,
    updateKey: string
}

type MessageWithMemberWithProfile = Message & {member:Member & {
    profile: Profile
}}

export const useChatSocket = (props:Props) => {
    const {socket} = useSocket()
    const qc = useQueryClient()

    useEffect(() => {
        if (!socket) {
            return
        }

        socket.on(props.updateKey, (message:MessageWithMemberWithProfile) => {
            qc.setQueryData([props.queryKey], (oldData:any) => {
                if (!oldData || !oldData.pages || oldData.pages.length == 0) {
                    return
                }

                const newData = oldData.pages.map((page:any) => {
                    return {
                        ...page,
                        items: page.items.map((msg:MessageWithMemberWithProfile) => {
                            if (msg.id === message.id) {
                                return message
                            }

                            return msg
                        })
                    }
                })

                return {...oldData, pages:newData}
            })
        })

        socket.on(props.addKey, (message:MessageWithMemberWithProfile) => {
            qc.setQueryData([props.queryKey], (oldData:any) => {
                if (!oldData || !oldData.pages || oldData.pages.length == 0) {
                    return {
                        pages : [{
                            items: [message]
                        }]
                    }
                }

                const newData = [...oldData.pages]

                newData[0] = {
                    ...newData[0],
                    items:[
                        message,
                        ...newData[0].items
                    ]
                }

                return {
                    ...oldData,
                    pages: newData
                }
            })
        })

        return () => {
            socket.off(props.addKey)
            socket.off(props.updateKey)
        }
    }, [qc, props.addKey, socket, props.queryKey, props.updateKey])
}