"use client";

import React, { useState } from "react";
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
import { Button } from "../ui/button";
import { useModal } from "@/hooks/useModalStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import { currentProfile } from "@/lib/currentProfile";
import { useRouter } from "next/navigation";


export const DeleteServer = () => {
  const {isOpen, onClose, type, data} = useModal()

  const isModalOpen = isOpen && type == "deleteServer"

  const {server} = data

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  


  const onClick = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/servers/${server?.id}/delete`)
      onClose()
      router.refresh()
      router.push("/")
    } catch(error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? Server <span className="font-semibold text-indigo-500">&apos;{server?.name}&apos;</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant={"secondary"} className="focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 ">Cancel</Button>
            <Button disabled={isLoading} onClick={() => onClick()} variant={"primary"}>Confirm</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

