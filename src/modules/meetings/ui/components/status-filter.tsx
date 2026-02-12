import {
  CircleXIcon,
  CircleCheckIcon,
  ClockArrowUpIcon,
  VideoIcon,
  LoaderIcon,
} from "lucide-react";
import { MeetingStatus } from "../../type";
import { CommandSelect } from "@/components/command-select";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

const options = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className="flex items-center capitalize gap-x-2">
        <ClockArrowUpIcon />
        {MeetingStatus.Upcoming}
      </div>
    ),
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className="flex items-center capitalize gap-x-2">
        <VideoIcon />
        {MeetingStatus.Active}
      </div>
    ),
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className="flex items-center capitalize gap-x-2">
        <CircleCheckIcon />
        {MeetingStatus.Completed}
      </div>
    ),
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className="flex items-center capitalize gap-x-2">
        <LoaderIcon />
        {MeetingStatus.Processing}
      </div>
    ),
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className="flex items-center capitalize gap-x-2">
        <CircleXIcon />
        {MeetingStatus.Cancelled}
      </div>
    ),
  },
];

export const StatusFilter = () => {
  const [filter, setFilter] = useMeetingsFilters();
  return (
    <CommandSelect
      placeholder="Status"
      className="h-9"
      onSelect={(value) => setFilter({ status: value as MeetingStatus })}
			value={filter.status??""}
      options={options}
    />
  );
};
