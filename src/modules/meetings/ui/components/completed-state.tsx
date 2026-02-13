import { MeetingGetOne } from "../../type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarkDown from "react-markdown";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  BookOpenTextIcon,
  SparklesIcon,
  FileTextIcon,
  FileVideoIcon,
  ClockFadingIcon,
} from "lucide-react";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-2 flex-1 min-h-0">
      <Tabs defaultValue="summary" className="flex flex-col flex-1 min-h-0">
        <div className="bg-white dark:bg-black rounded-lg border px-3 shrink-0">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-10">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground text-sm rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <BookOpenTextIcon className="size-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground text-sm rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileTextIcon className="size-4" />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground text-sm rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileVideoIcon className="size-4" />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground text-sm rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <SparklesIcon className="size-4" />
                Ask Ai
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="recording" className="flex-1 min-h-0 mt-2">
          <div className="bg-white dark:bg-black rounded-lg border px-4 py-3 h-full flex items-center justify-center">
            <video
              src={data.recordingUrl!}
              controls
              className="w-full max-h-full rounded-md"
            />
          </div>
        </TabsContent>
        <TabsContent value="summary" className="flex-1 min-h-0 mt-2">
          <div className="bg-white dark:bg-black rounded-lg border ">
            <div className="px-4 py-3 gap-y-2 flex flex-col col-span-5">
              <h2 className="text-xl font-medium capitalize">{data.name}</h2>
              <div className="flex items-center gap-x-2 text-sm">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar
                    seed={data.agent.name}
                    className="size-4"
                    varient="botttsNeutral"
                  />
                  {data.agent.name}
                </Link>{" "}
                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
              </div>
              <div className="flex gap-x-2 items-center text-sm">
                <SparklesIcon className="size-3" />
                <p>General Summary</p>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-x-1 text-xs [&>svg]:size-3"
              >
                <ClockFadingIcon className="text-blue-700" />
                {data.duration ? formatDuration(data.duration) : "No duration"}
              </Badge>
              <div className="text-sm">
                <MarkDown 
                components={{
                  h1:(props)=>(
                    <h1 className="text-xl font-medium mb-2" {...props}/>
                  ),
                   h2:(props)=>(
                    <h2 className="text-lg font-medium mb-2" {...props}/>
                  ),
                   h3:(props)=>(
                    <h3 className="text-base font-medium mb-2" {...props}/>
                  ),
                   h4:(props)=>(
                    <h4 className="text-sm font-medium mb-2" {...props}/>
                  ),
                  p:(props)=>(
                    <p className="mb-2 leading-relaxed" {...props}/>
                  ),
                  ul:(props)=>(
                    <ul className="list-disc list-inside mb-2" {...props}/>
                  ),
                    ol:(props)=>( 
                    <ol className="list-decimal list-inside mb-2" {...props}/>
                  ),
                  li:(props)=>(
                    <li className="mb-0.5" {...props}/>
                  ),
                  strong:(props)=>(
                    <strong className="font-semibold" {...props}/>
                  ),
                  code:(props)=>(
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props}/>
                  ),
                  blockquote:(props)=>(
                    <blockquote className="border-l-4 pl-4 italic my-2" {...props}/>
                  ),
                }}
                >{data.summary}</MarkDown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
