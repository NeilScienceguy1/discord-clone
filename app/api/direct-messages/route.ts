import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { DirectMessage, Message } from "@prisma/client"
import { NextResponse } from "next/server"

const MESSAGE_BATCH = 10

export async function GET(req:Request) {
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const cursor = searchParams.get("cursor")
        const conversationId = searchParams.get("conversationId")

        if (!profile) {
            return new NextResponse("Unauthorized", {status:401})
        }

        if (!conversationId) {
            return new NextResponse("Channel ID Missing", {status:400})
        }

        let messages: DirectMessage[] = []

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                skip:1,
                cursor:{
                    id: cursor
                },
                where:{
                    conversationId

                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                where:{
                    conversationId,

                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }

        let nextCursor = null

        if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH-1].id
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })

    } catch (e) {
        console.log("[MESSAGES_GET] ", e)
        return new NextResponse("Internal Server Error", {status:500})
    }
}