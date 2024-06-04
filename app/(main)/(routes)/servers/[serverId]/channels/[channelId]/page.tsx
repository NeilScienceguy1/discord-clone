import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { MediaRoom } from "@/components/MediaRoom";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async (props: Props) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: props.params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: props.params.serverId,
    },
  });

  if (!channel || !member) {
    return redirect(`/`);
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            type={"channel"}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
            chatId={channel.id}
          />
          <ChatInput
            name={channel.name}
            type={"channel"}
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} audio={true} video={false}/>
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} audio={true} video={true}/>
      )}
    </div>
  );
};

export default ChannelIdPage;
