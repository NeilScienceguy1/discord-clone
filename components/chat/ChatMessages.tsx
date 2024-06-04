"use client";

import { Member, Message, Profile } from "@prisma/client";
import React, { Fragment, useRef, ElementRef } from "react";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Group, Loader, Loader2, ServerCrash } from "lucide-react";
import MessageItem from "./MessageItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatScroll } from "@/hooks/useChatScroll";

type MessageMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

interface Props {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const DATE_FORMAT = "d MMM yyyy, HH:mm"

const ChatMessages = (props: Props) => {
  const queryKey = `chat:${props.chatId}`;
  const addKey = `chat:${props.chatId}:messages`
  const updateKey = `chat:${props.chatId}:messages:update`
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey: queryKey,
      apiUrl: props.apiUrl,
      paramKey: props.paramKey,
      paramValue: props.paramValue,
    });
  console.log(data?.pages)

  useChatSocket({queryKey, addKey, updateKey})
  const chatRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  useChatScroll({chatRef, bottomRef, loadMore: fetchNextPage, shouldLoadMore: !isFetchingNextPage && !!hasNextPage, count:data?.pages?.[0]?.items?.length ?? 0})

  if (status == "loading") {
    return (
      <div className="flex flex-col items-center flex-1 justify-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col items-center flex-1 justify-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something Went Wrong
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && (<ChatWelcome name={props.name} type={props.type} />)}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (<Loader className="h-6 w-6 text-zinc-500 animate-spin my-4"/>) : (
            <button onClick={() => fetchNextPage()} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition text-xs my-4">
              Load Messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((msg: MessageMemberWithProfile) => (
              <MessageItem
                currentMember={props.member}
                content={msg.content}
                id={msg.id}
                key={msg.id}
                fileUrl={msg.fileUrl}
                timestamp={format(new Date(msg.createdAt), DATE_FORMAT)}
                isUpdated={msg.updatedAt !== msg.createdAt}
                socketUrl={props.socketUrl}
                socketQuery={props.socketQuery}
                member={msg.member}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef}/>
    </div>
  );
};

export default ChatMessages;
