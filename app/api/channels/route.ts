import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";

export async function POST(req:Request) {
    try {
        const {name , type} = await req.json()
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        if (!serverId) {
            return new NextResponse("Server Id Missing", {status:400})
        }
        if (name === "general") {
            return new NextResponse("Name cannot be general", {status:400})
        }
        const server = await db.server.update({
            where: {
                id: serverId as string,
                members: {
                    some:{
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels:{
                    create: {name: name, type: type, profileId: profile.id}
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVERS_POST] ", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}
