import { Member, Profile, Server } from "@prisma/client"
import { NextApiResponse } from "next"
import {Server as NetServer, Socket} from "net"
import {Server as ServerIO} from "socket.io"

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {profile: Profile})[]
}


export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: ServerIO
        }
    }

}