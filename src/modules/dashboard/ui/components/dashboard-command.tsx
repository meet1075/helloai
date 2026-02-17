import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem,CommandResponsiveDialog } from '@/components/ui/command'
import { CommandList } from 'cmdk'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { GeneratedAvatar } from '@/components/generated-avatar'
interface DashboardCommandProps {
    open: boolean
    setOpen:Dispatch<SetStateAction<boolean>>
}

const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
    const router = useRouter();
    const trpc = useTRPC();
    const [search,setSearch] = useState("");
    const meetings = useQuery(trpc.meetings.getMany.queryOptions({
        search,
        pageSize:100
    }));
    const agents = useQuery(trpc.agents.getMany.queryOptions({
        search,
        pageSize:100
    }))
  return (
    <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Find a meeting or agent...' value={search} onValueChange={setSearch}/>
        <CommandList>
            <CommandGroup heading='Meetings'>
                <CommandEmpty>
                    <span className='text-sm text-muted-foreground'>
                        No meetings found.
                    </span>
                </CommandEmpty>
                {meetings?.data?.items.map((meeting)=>(
                    <CommandItem key={meeting.id} onSelect={()=>{router.push(`/meetings/${meeting.id}`); setOpen(false)}}>
                        {meeting.name}
                    </CommandItem>
                ))}
            </CommandGroup>
            <CommandGroup heading='Agents'>
                <CommandEmpty>
                    <span className='text-sm text-muted-foreground'>
                        No agents found.
                    </span>
                </CommandEmpty>
                {agents?.data?.items.map((agent)=>(
                    <CommandItem key={agent.id} onSelect={()=>{router.push(`/agents/${agent.id}`); setOpen(false)}}>
                        <GeneratedAvatar seed={agent.name} varient='botttsNeutral' className='size-5'/>
                        {agent.name}
                    </CommandItem>
                ))}
            </CommandGroup>
        </CommandList>
    </CommandResponsiveDialog>
  )
}

export default DashboardCommand
