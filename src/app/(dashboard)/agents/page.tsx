import { LoadingState } from '@/components/loading-state';
import { AgentView, AgentViewError, AgentViewLoading } from '@/modules/agents/ui/view/agent-view'
import { getQueryClient, trpc, } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

const page = async() => {
    const queryClient= getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
     <Suspense fallback={<AgentViewLoading />}>
     <ErrorBoundary FallbackComponent={AgentViewError}>
      <AgentView/>
        </ErrorBoundary>
        </Suspense>
        
    </HydrationBoundary>
  )
}

export default page
