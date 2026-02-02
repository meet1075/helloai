"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { title } from "process";

export const AgentView = () => {
    const trpc = useTRPC();
    const {data}=useSuspenseQuery(trpc.agents.getMany.queryOptions());
    return (
        <div>
            {JSON.stringify(data,null,2)}
        </div>
    )
}
export const AgentViewLoading = () => {
    return( 
        <LoadingState title="Loading Agents" description="Please wait while we load the agents."/>
    )
}
export const AgentViewError = () => {
    
    return(
        <ErrorState title="Failed to load Agents" description="An error occurred while loading agents. Please try again later."/>
    )
}