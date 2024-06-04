"use client"

import { useSocket } from "./providers/SocketProvider"

import { Badge } from "./ui/badge"

import React from 'react'

const SocketIndicator = () => {
    const {isConnected} = useSocket()

    if (!isConnected) {
        return (
            <Badge variant={"outline"} className="bg-yellow-600 text-white border-none">
                Connecting...
            </Badge>
        )
    }

    return (
        <Badge variant={"outline"} className="bg-emerald-600 text-white border-none">
            Connected
        </Badge>
    )
}

export default SocketIndicator