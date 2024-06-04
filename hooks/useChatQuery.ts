import { useSocket } from "@/components/providers/SocketProvider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import queryString from "query-string";

interface Props {
    queryKey: string,
    apiUrl: string,
    paramKey: "channelId" | "conversationId";
    paramValue: string
}


export const useChatQuery = (props: Props) => {
    const {isConnected} = useSocket()

    const fetchMessages = async ({pageParam=undefined}) => {
        const url = queryString.stringifyUrl({
            url: props.apiUrl,
            query:{
                cursor: pageParam,
                [props.paramKey]: props.paramValue
            }
        }, {skipNull:true})

        const res = await fetch(url)
        return res.json()
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey:[props.queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: 1000
    })

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }
}