"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { AgentSearchFilter } from "./agent-search-filter";
import { DEFAULT_PAGE } from "@/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { is } from "drizzle-orm";

const AgentListHeader = () => {
    const [filters, setFilters] = useAgentsFilters();
    const [isDialogOpen,setIsDialogOpen]=useState(false);
    const isAnyFilterModified=!!filters.search
    const onClearFilters=()=>{
      setFilters({
        search:"",
        page:DEFAULT_PAGE
      })
    }
  return (
    <>
    <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
    <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-xl">My Agents</h5>
        <Button onClick={() => setIsDialogOpen(true)} >
          <PlusIcon/>
          New Agent
        </Button>
      </div>
        <ScrollArea>
      <div className="flex items-center gap-x-2 p-1">
      <AgentSearchFilter/>
      {
        isAnyFilterModified && (
          <Button variant={"outline"} size={"sm"} onClick={onClearFilters}>
            <XCircleIcon/>
            Clear
          </Button>
        )
      }
      </div>
      <ScrollBar orientation="horizontal"/>
      </ScrollArea>
    </div>
    </>
  );
};

export default AgentListHeader;
