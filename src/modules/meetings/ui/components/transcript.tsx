import { useState } from "react";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
  meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ id: meetingId }),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = (data ?? []).filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div className="bg-white dark:bg-black rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
      <p className="text-sm font-medium">Transcript</p>
      <div className="relative">
        <Input
          placeholder="Search Transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-7 h-9 w-[240px]"
        />
        <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-y-4 ">
          {filteredData.map((item) => {
            return(
              <div key={item.start_ts} className="flex flex-col rounded-md border p-4 hover:bg-muted gap-y-2">
                <div className="flex gap-x-2 items-center">
                  <Avatar className="size-6">
                    <AvatarImage src={item.user.image ?? generateAvatarUri({seed:item.user.name, variant:"initials"})} alt="avatar" />
                  </Avatar>
                  <p className="text-sm font-medium">{item.user.name}</p>
                  <p className="text-sm text-blue-500 font-medium">
                    {format(
                      new Date(0,0,0,0,0,0,item.start_ts),
                      "mm:ss",
                    )}
                  </p>
                </div>
                <Highlighter
                className="text-sm dark:text-neutral-300 text-neutral-700"
                highlightClassName="bg-yellow-200"
                searchWords={[searchQuery]}
                autoEscape={true}
                textToHighlight={item.text}
                />
              </div>
            )
          })
        }
        </div>
      </ScrollArea>
    </div>
  );
};
