import { Channel, ChannelType, Server } from "@prisma/client";
import {create} from "zustand"

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | "delMsg"

interface ModalData {
    server?: Server,
    channelType?: ChannelType,
    channel?: Channel,
    apiUrl?:string,
    query?: Record<string, any>
}

interface ModalStore {
    type: ModalType | null,
    isOpen: boolean,
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
    data: ModalData
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen:(type, data={}) => set({isOpen: true, type, data}),
    onClose: () => set({type: null, isOpen: false}),
    data: {}
}))