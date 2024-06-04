import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import NavAction from "./NavAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavItem from "./NavItem";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

const Sidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
        <NavAction/>
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
        <ScrollArea className="flex-1 w-full">
            {servers.map(server => (
                <div key={server.id} className="mb-4">
                    <NavItem id={server.id} imageUrl={server.imageUrl} name={server.name}/>
                </div>
            ))}
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
            <ModeToggle/>
            <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                    avatarBox: "h-[42px] w-[42px]"
                }
            }}/>
        </div>
    </div>
  );
};

export default Sidebar;
