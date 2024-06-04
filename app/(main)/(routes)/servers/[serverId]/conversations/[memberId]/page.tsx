import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { MediaRoom } from "@/components/MediaRoom";
import { findOrCreateConvo } from "@/lib/conversation";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async (props: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currMem = await db.member.findFirst({
    where: {
      serverId: props.params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currMem) {
    return redirect(`/`);
  }

  if (currMem.id == props.params.memberId) {
    return redirect(`/servers/${props.params.serverId}`);
  }

  const conversation = await findOrCreateConvo(
    currMem.id,
    props.params.memberId
  );
  if (!conversation) {
    return redirect(`/servers/${props.params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        type="conversation"
        serverId={props.params.serverId}
        name={otherMember.profile.name}
      />
      {props.searchParams.video && (
        <MediaRoom chatId={conversation.id} audio={true} video={true}/>
      )}
      {!props.searchParams.video && (
        <>
          <ChatMessages
            member={currMem}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
