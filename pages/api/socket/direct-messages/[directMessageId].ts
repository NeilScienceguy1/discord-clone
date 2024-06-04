import { currentProfile } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req:NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json("METHOD NOT ALLOWED")
    }

    try {
        const profile = await currentProfile(req)
        const {directMessageId, conversationId} = req.query
        const {content} = req.body

        if (!profile) {
            return res.status(401).json({error:"Unauthorized"})
        }
        if (!conversationId) {
            return res.status(400).json({error:"Conversation Id missing"})
        }

        const convo = await db.conversation.findFirst({
            where:{
                id: conversationId  as string,
                OR:[
                    {
                        memberOne:{
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo:{
                            profileId: profile.id
                        }
                    },
                ]
            },
            include:{
                memberOne:{
                    include:{
                        profile: true
                    }
                },
                memberTwo:{
                    include:{
                        profile: true
                    }
                }
            }
        })

        if (!conversationId) {
            return res.status(404).json({error:"Conversation not found"})
        }

        const member = convo?.memberOne.profileId === profile.id ? convo.memberOne : convo?.memberTwo

        if (!member) {
            return res.status(404).json({error:"Member not found"})
        }

        let directMessage = await db.directMessage.findFirst({
            where:{
                id: directMessageId as string,
                conversationId: conversationId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })

        if (!directMessage) {
            return res.status(404).json({error:"Message not found"})
        }

        const isMessageOwner = directMessage.memberId == member.id
        const isAdmin = member.role == MemberRole.ADMIN
        const isMod = member.role == MemberRole.MODERATOR
        const canModify = isMessageOwner || isAdmin || isMod

        if (!canModify) {
            return res.status(401).json({error:"Unauthorized"})
        }

        if (req.method == "DELETE") {
            directMessage = await db.directMessage.update({
                where:{
                    id: directMessageId as string,
                },
                data:{
                    content: "This message has been deleted",
                    fileUrl: null
                },
                include:{
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        if (req.method == "PATCH") {
            if (!isMessageOwner) {
                return res.status(401).json({error:'Unauthorized'})
            }
            directMessage = await db.directMessage.update({
                where:{
                    id: directMessageId as string,
                },
                data:{
                    content: content
                },
                include:{
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${convo?.id}:messages:update`

        res?.socket?.server?.io.emit(updateKey, directMessage)

        return res.status(200).json(directMessage)
    } catch (e) {
        console.log(e)
    }
}