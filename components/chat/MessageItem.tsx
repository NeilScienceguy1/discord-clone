"use client";
import { Member, MemberRole, Profile } from "@prisma/client";
import React, { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../ActionTooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
  } from "@/components/ui/form"
import * as z from "zod"
import qs from "query-string"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/useModalStore";
import { useRouter, useParams } from "next/navigation";

const formSchema = z.object({
    content: z.string().min(1)
})

interface Props {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-5 w-5 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-5 w-5 ml-2 text-rose-500" />,
};

const MessageItem = (props: Props) => {
  const [deleted, setDeleted] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAdmin = props.currentMember.role === MemberRole.ADMIN;
  const isModerator = props.currentMember.role === MemberRole.MODERATOR;
  const isOwner = props.currentMember.id === props.member.id;
  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && (isOwner && !props.fileUrl);
  const fileType = props.fileUrl?.split(".").pop();
  const isPdf = fileType === "pdf" && props.fileUrl;
  const isImage = !isPdf && props.fileUrl;
  const {onOpen} = useModal()
  const router = useRouter()
  const params = useParams()


  useEffect(() => {
    if (props.content === "This message has been deleted") {
      setDeleted(true)
    }
  }, [props.content])

  const onUserClick = () => {
    if (props.member.id == props.currentMember.id) {
      return
    }

    return router.push(`/servers/${params?.serverId}/conversations/${props.member.id}`)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
        content: props.content
    }
  })

  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    form.reset({
        content: props.content
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.content])

  useEffect(() => {
    const handleKeyDown = (event:any) => {
        if (event.key == "Escape" || event.keyCode == 27) {
            setIsEditing(false)
        }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (isImage) {
    console.log(props.fileUrl)
  }
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const url = qs.stringifyUrl({
            url:`${props.socketUrl}/${props.id}`,
            query:props.socketQuery
        })

        await axios.patch(url, values)
        form.reset()
        setIsEditing(false)
    } catch(e) {
        console.log(e)
    }
  }

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onUserClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={props.member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center" >
              <p className="font-semibold text-sm hover:underline cursor-pointer" onClick={onUserClick}>
                {props.member.profile.name}
              </p>
              <ActionTooltip label={props.member.role}>
                {roleIconMap[props.member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {props.timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={props.fileUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={props.fileUrl as string}
                alt={props.content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400 " />
              <a
                href={props.fileUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!props.fileUrl && !isEditing && (
            <p className={cn("text-sm text-zinc-600 dark:text-zinc-300", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
              {props.content}{" "}
              {props.isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!props.fileUrl && isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center !w-full gap-x-2 pt-2">
                    <FormField control={form.control} name="content" render={({field}) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <div className="relative !w-full">
                                    <Input className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200" placeholder="Edited Message..." {...field} disabled={isLoading}/>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <Button size="sm" variant="primary" disabled={isLoading}>
                        Save
                    </Button>
                </form>
                <span className="text-[11px] m-1 text-zinc-400">
                    Press esc to cancel, enter to save
                </span>
            </Form>
          )}
        </div>
      </div>
      {canDelete && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
            {canEdit && (
                <ActionTooltip label="edit">
                    <Edit onClick={() => setIsEditing(true)} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
                </ActionTooltip>
            )}
            <ActionTooltip label="delete">
                    <Trash onClick={() => onOpen("delMsg", {apiUrl:`${props.socketUrl}/${props.id}`, query: props.socketQuery})} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
                </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
