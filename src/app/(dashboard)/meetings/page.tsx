import { auth } from "@/lib/auth";
import MeetingListHeader from "@/modules/meetings/ui/components/meetings-list-headers";
import {
  MeetingView,
  MeetingsViewError,
  MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meeting-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadSearchParams } from "@/modules/meetings/params";
import type { SearchParams } from "nuqs/server";

interface Props{
  searchParams:Promise<SearchParams>
}

const page = async({searchParams}:Props) => {
  const filters = await loadSearchParams(searchParams)
  const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      redirect("/sign-in");
    }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({
    ...filters
  }));
  return (
    <>
    <MeetingListHeader/>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading />}>
          <ErrorBoundary fallback={<MeetingsViewError />}>
            <MeetingView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default page;
