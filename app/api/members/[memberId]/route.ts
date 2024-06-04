import { currentProfile } from "@/lib/currentProfile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import {v4 as uuidv4} from "uuid"

export async function PATCH(req: Request, {params}: {params: {memberId: string}}) {
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const {role} = await req.json()
        const serverId = searchParams.get("serverId")
        console.log(serverId)

        if (!profile) {
            return new NextResponse("Unauthorized", {status:401})
        }
        if (!params.memberId) {
            return new NextResponse("Member Id Missing", {status:400})
        }
        if (!serverId) {
            return new NextResponse("Server Id Missing", {status:400})
        }

        const server = await db.server.update({
            where: {
                id: serverId as string
            },
            data: {
                members:{
                    update:{
                        where:{
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile: true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVER_ID] ", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}
export async function DELETE(req: Request, {params}: {params: {memberId: string}}) {
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")
        console.log(serverId)

        if (!profile) {
            return new NextResponse("Unauthorized", {status:401})
        }
        if (!params.memberId) {
            return new NextResponse("Member Id Missing", {status:400})
        }
        if (!serverId) {
            return new NextResponse("Server Id Missing", {status:400})
        }

        const server = await db.server.update({
            where: {
                id: serverId as string
            },
            data: {
                members:{
                    deleteMany:{
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile: true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVER_ID] ", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}