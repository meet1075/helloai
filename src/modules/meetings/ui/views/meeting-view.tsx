"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const MeetingView = () => {
    const trpc = useTRPC();
    const {data}=useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))
  return (
    <div>
      {/* {JSON.stringify(data)} */}
      meetins view
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

