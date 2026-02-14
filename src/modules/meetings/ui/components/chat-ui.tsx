import { useState,useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type {Channel as StreamChannel} from "stream-chat";
import {Chat,Channel,Window,Thread,useCreateChatClient,MessageInput,MessageList} from "stream-chat-react";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { useTheme } from "next-themes";
import "stream-chat-react/dist/css/v2/index.css";

interface Props {
  meetingId: string;
  meetingName: string;
  userId:string;
  userName:string;
  userImage:string|undefined;
}

export const ChatUI = ({ meetingId, meetingName, userId, userName, userImage }: Props) => {
  const trpc = useTRPC();
  const { resolvedTheme } = useTheme();
  const {mutateAsync:generateChatToken} = useMutation(trpc.meetings.generateChatToken.mutationOptions())
  const [channel, setChannel] = useState<StreamChannel>();
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider:generateChatToken,
    userData:{
      id:userId,
      name:userName,
      image:userImage,
    }
  })
  useEffect(() => {
    if (!client) return;
    const channel = client.channel("messaging", meetingId, {
      members: [userId],
    })
    setChannel(channel);
  } , [client, meetingId, meetingName, userId])
  if(!client){
    return(
      <LoadingState
      title="Loading Chat..."
      description="Please wait while we load the chat for you."
      />
    )
  }
  return(
    <div className="bg-white dark:bg-black rounded-lg border overflow-hidden">
      <Chat client={client} theme={resolvedTheme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light"}>
      <Channel channel={channel}>
        <Window>
          <div className="flex-1 overflow-y-auto border-b max-h-[calc(100vh-23rem)]">
            <MessageList />
          </div>
          <MessageInput  />
        </Window>
        <Thread />
      </Channel>
      </Chat>

    </div>
  )
}