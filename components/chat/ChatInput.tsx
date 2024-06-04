"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
  } from "@/components/ui/form"
import * as z from "zod"
import { Input } from '../ui/input'
import { Plus, Smile } from 'lucide-react'
import qs from 'query-string'
import axios from "axios"
import { useModal } from '@/hooks/useModalStore'
import EmojiPicker from '../EmojiPicker'
import { useRouter } from 'next/navigation'


interface Props {
    apiUrl: string,
    query: Record<string, any>,
    name: string,
    type: "conversation" | "channel"
}

const formSchema = z.object({
    content: z.string().min(1)
})


const ChatInput = (props: Props) => {
    const {onOpen} = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues:{
            content:"",
        },
        resolver: zodResolver(formSchema)
    })
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: props.apiUrl,
                query:props.query
            })

            await axios.post(url, values)
            form.reset()
            router.refresh()
        } catch (e) {
            console.log(e)
        }
    }
  return (
    <Form {...form}>
        <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="content" render={({field}) => (
                <FormItem>
                    <FormControl>
                        <div className="relative p-4 pb-6">
                            <button type="button" onClick={() => onOpen("messageFile", {apiUrl:props.apiUrl, query:props.query})} className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'>
                                <Plus className='text-white dark:text-[#313338]' />
                            </button>
                            <Input disabled={isLoading} className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                            placeholder={`Message ${props.type==="conversation" ? props.name : "#"+props.name}`}
                            {...field}
                            />
                            <div className="absolute top-7 right-8">
                                <EmojiPicker onChange={(emoji) => field.onChange(`${field.value}${emoji}`)}/>
                            </div>
                        </div>
                    </FormControl>
                </FormItem>
            )} />
        </form>
    </Form>
  )
}

export default ChatInput