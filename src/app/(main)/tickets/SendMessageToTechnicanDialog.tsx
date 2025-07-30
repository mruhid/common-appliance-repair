"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { findEmployeeByName } from "@/lib/fetchCollection";
import { useQuery } from "@tanstack/react-query";
import { TicketProps } from "../create-ticket/createTicket";

export default function SendMessageToTechnicianDialog({
  ticket,
  open,
  onOpenChange,
}: {
  ticket: TicketProps | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const technicianName = ticket?.Technician || "";

  const {
    data: employee,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["employee", technicianName],
    queryFn: () => findEmployeeByName(technicianName),
    enabled: !!technicianName && open,
    retry: false,
    staleTime: Infinity,
  });
  if (!ticket || !open) return null;

  const message = `Ticket #${ticket.TicketNumber} is recalled. Please check it.`;

  const telHref = employee?.PhoneNumber ? `tel:${employee.PhoneNumber}` : "#";
  const smsHref = employee?.PhoneNumber
    ? `sms:${employee.PhoneNumber}?body=${encodeURIComponent(message)}`
    : "#";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Please contact a technician</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You can send an SMS or call the assigned technician for this ticket.
          Use the buttons below to quickly reach out and inform them.
        </DialogDescription>

        {isError && !isPending && (
          <div className="text-destructive text-center font-semibold text-md">
            Technician not found
          </div>
        )}

        <DialogFooter>
          <div className="space-y-4 w-full">
            {isPending && (
              <div className="flex flex-col gap-2 mt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {employee && !isPending && !isError && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <a
                  href={smsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="companyBtn" className="w-full">
                    Send SMS
                  </Button>
                </a>
                <a href={telHref} className="w-full">
                  <Button variant="outline" className="w-full">
                    Call Technician
                  </Button>
                </a>
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
