import { currentProfile } from '@/lib/currentProfile'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
  params:{serverId: string}
}

const ServerIdPage = async (props:Props) => {
  const profile = await currentProfile()

  if (!profile) {
    return auth().redirectToSignIn()
  }
  const server = await db.server.findUnique({
    where:{
      id: props.params.serverId,
      members:{
        some:{
          profileId:profile.id
        }
      }
    },
    include:{
      channels:{
        where:{
          name:"general"
        },
        orderBy:{
          createdAt:"asc"
        }
      }
    }
  })
  const initialChannel = server?.channels[0]
  if (initialChannel?.name !== "general") {
    return null
  }

  return redirect(`/servers/${props.params.serverId}/channels/${initialChannel.id}`)
}

export default ServerIdPage