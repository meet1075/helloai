"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { title } from "process";
import { DataTable } from "../components/data-table";
import { columns } from "../components/column";
import { EmptyState } from "@/components/empty-state";

export const AgentView = () => {
    const trpc = useTRPC();
    const {data}=useSuspenseQuery(trpc.agents.getMany.queryOptions());
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns}/>
            {
                data.length===0 && (
                    <EmptyState 
                    title="Create your first Agents"
                    description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the meeting."

                    />
                )
            }
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