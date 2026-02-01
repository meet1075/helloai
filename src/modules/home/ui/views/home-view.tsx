"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { tr } from "zod/v4/locales";

export const HomeView = () => {
 const trpc = useTRPC();
 const {data}=useQuery(trpc.hello.queryOptions({text:"Meet"}));
  return (
    <div className="flex flex-col p-4 gap-4">
      {data?.greeting}
    </div>
  );
};
