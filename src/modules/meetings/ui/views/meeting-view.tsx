"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/column";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export const MeetingView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filter, setFilter] = useMeetingsFilters();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filter,
    }),
  );
  return (
    <div className="flex flex-col gap-y-4 flex-1 pb-4 px-4 md:px-8">
      <DataTable data={data.items} columns={columns} onRowClick={(row)=>router.push(`/meetings/${row.id}`)}/>
			<DataPagination page={filter.page} totalPages={data.totalPages} onPageChange={(page)=>setFilter({page})}/>
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first Meeting"
          description="Create a meeting to get started. Each meeting will follow your instructions and can interact with participants during the session."
        />
      )}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="Please wait while we load the meetings."
    />
  );
};
export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Failed to load Meetings"
      description="An error occurred while loading meetings. Please try again later."
    />
  );
};
