import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "@/modules/agents/ui/components/agent-form";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewMeetingDialogProps) => {
    const router = useRouter();
  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new Meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
        <MeetingForm onSuccess={(id)=>{
            onOpenChange(false)
            router.push(`/meetings/${id}`)
        }}
        onCancel={()=>onOpenChange(false)}/>
    </ResponsiveDialog>
  );
};
