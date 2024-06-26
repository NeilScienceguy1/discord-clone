"use client";

import React, { useEffect } from "react";
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  //   DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUpload from "../FileUpload";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChannelType } from "@prisma/client";
import qs from "query-string"
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required!",
  }).refine(name => name !== "general", {
    message: "Channel 'general' exists already and cannot be deleted!"
  }),
  type: z.nativeEnum(ChannelType)
});

const EditChannelModal = () => {
  const {isOpen, onClose, type, data} = useModal()
  const router = useRouter()
  const params = useParams()

  const {channel, server} = data

  const isModalOpen = isOpen && type == "editChannel"

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT 
    },
  });
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name)
      form.setValue("type", channel.type)
    } else {
      form.setValue("type", ChannelType.TEXT)
    }
  }, [form, channel])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url:`/api/channels/${channel?.id}`,
        query:{
          serverId: server?.id
        }
      })
      await axios.patch(url, values);
      form.reset();
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  };

  const handleClose = () => {
    form.reset();
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Edit channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Edit channel <span className="text-indigo-500 font-semibold">#{channel?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs fond-bold text-zinc-500 dark: text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter Channel Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="type" render={({field}) => (
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                        <SelectValue placeholder="Channel Type..."/>
                      </SelectTrigger>

                    </FormControl>
                    <SelectContent>
                        {Object.values(ChannelType).map(type => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                </FormItem>
              )} />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}>
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
