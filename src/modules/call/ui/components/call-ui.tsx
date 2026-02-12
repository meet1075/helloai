import { StreamCall, StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";
interface Props {
  meetingName: string;
}

export const CallUI = ({ meetingName }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const handleJoin = async () => {
    if (!call) {
      return;
    }
    await call.join();
    setShow("call");
  };
  const handleLeave = async () => {
    if (!call) {
      return;
    }
    try {
      await call.leave();
    } catch (error) {
      console.log("Call already left or ended");
    }
    setShow("ended");
  };
  return(
    <StreamTheme className="h-full">
      {show==="lobby" && <CallLobby onJoin={handleJoin}/>}
      {show==="call" && <CallActive meetingName={meetingName} onLeave={handleLeave}/>}
      {show==="ended" && <CallEnded/>}
    </StreamTheme>
  )
};
