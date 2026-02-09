"use client"

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/column";
import { EmptyState } from "@/components/empty-state";

export const MeetingView = () => {
    const trpc = useTRPC();
    const {data}=useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))
  return (
    <div className="flex flex-col gap-y-4 flex-1 pb-4 px-4 md:px-8">
      <DataTable data={data.items} columns={columns}/>
      {
                      data.items.length===0 && (
                          <EmptyState 
                          title="Create your first Meeting"
                          description="Create a meeting to get started. Each meeting will follow your instructions and can interact with participants during the session."
      
                          />
                      )
                  }
    </div>
  )
}

export const MeetingsViewLoading = () => {
    return( 
        <LoadingState title="Loading Meetings" description="Please wait while we load the meetings."/>
    )
}
export const MeetingsViewError = () => {
    
    return(
        <ErrorState title="Failed to load Meetings" description="An error occurred while loading meetings. Please try again later."/>
    )
}

