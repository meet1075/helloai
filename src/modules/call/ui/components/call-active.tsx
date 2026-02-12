import Link from "next/link";
import Image from "next/image";
import {
  CallControls,
  SpeakerLayout
} from "@stream-io/video-react-sdk";
interface Props{
  meetingName:string
  onLeave:()=>void;
}

export const CallActive = ({meetingName,onLeave}:Props) => {
  return(
    <div className="flex flex-col justify-between h-full p-4 text-white">
      <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
        <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
          <Image src="/logoo.svg" alt="Logo" width={22} height={22} />
        </Link>
        <h4 className="text-base">{meetingName}</h4>
      </div>
      <SpeakerLayout />
      <div className="rounded-full px-4 bg-[#101213]">
        <CallControls onLeave={onLeave}/>
      </div>
    </div>
  )
}