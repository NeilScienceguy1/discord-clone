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
import qs from "query-string"

export const DeleteMessage = () => {
  const {isOpen, onClose, type, data} = useModal()

  const isModalOpen = isOpen && type == "delMsg"

  const {apiUrl, query} = data

  const [isLoading, setIsLoading] = useState(false)
  


  const onClick = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query
      })
      await axios.delete(url)
      onClose()
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? This message will be permanently deleted.
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

