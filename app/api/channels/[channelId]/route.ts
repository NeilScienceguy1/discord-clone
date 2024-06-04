import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, {params}: {params: {channelId: string}}) {
    try {
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", {status:401})
        }
        if (!params.channelId) {
            return new NextResponse("Server Id Missing", {status:400})
        }

        const server = await db.server.update({where: {
            id: serverId as string,
            members:{
                some:{
                    profileId:profile.id,
                    role:{
                        in: [MemberRole.ADMIN,MemberRole.MODERATOR]
                    }
                }
            }
        }, data:{
            channels:{
                delete: {
                    id:params.channelId,
                    name: {
                        not:"general"
                    }
                }
            }
        }})

        return NextResponse.json(server)
    } catch (error) {
        console.log("[CHANNEL_ID] ", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH(req: Request, {params}: {params: {channelId: string}}) {
    try {
        const {name, type} = await req.json()
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", {status:401})
        }
        if (!params.channelId) {
            return new NextResponse("Server Id Missing", {status:400})
        }

        if (name === "general") {
            return new NextResponse("General cannot be edited", {status:400})
        }

        const server = await db.server.update({where: {
            id: serverId as string,
            members:{
                some:{
                    profileId:profile.id,
                    role:{
                        in: [MemberRole.ADMIN,MemberRole.MODERATOR]
                    }
                }
            }
        }, data:{
            channels:{
                update: {
                    where:{
                        id: params.channelId,
                        NOT:{
                            name: "general"
                        }
                    },
                    data: {
                        name: name,
                        type: type
                    }
                }
            }
        }})

        return NextResponse.json(server)
    } catch (error) {
        console.log("[CHANNEL_ID] ", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}