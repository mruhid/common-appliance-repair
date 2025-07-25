"use client";

import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateClosedTicketStatus } from "./action";
import { TicketProps } from "../create-ticket/createTicket";
import { toast } from "sonner";

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ ticketNumber }: { ticketNumber: string }) =>
      updateClosedTicketStatus(ticketNumber),
    onSuccess: async ({ ticketNumber }: { ticketNumber: string }) => {
      const closedQueryFilter: QueryFilters = {
        queryKey: ["tickets", "Closed"],
      };
      const closedTickets = queryClient.getQueryData<TicketProps[] | null>([
        "tickets",
        "Closed",
      ]);

      const recalledTicket = closedTickets?.find(
        (t) => t.TicketNumber === ticketNumber
      );

      queryClient.setQueriesData<TicketProps[] | null>(
        closedQueryFilter,

        (oldData) => {
          if (!oldData) return oldData;

          return oldData.filter(
            (ticket) => ticket.TicketNumber !== ticketNumber
          );
        }
      );
      // 3. Add to "Recalled"
      if (recalledTicket) {
        queryClient.setQueryData<TicketProps[] | null>(
          ["tickets", "Recalled"],
          (oldData) =>
            oldData
              ? [...oldData, { ...recalledTicket, TicketStatus: "Recalled" }]
              : [{ ...recalledTicket, TicketStatus: "Recalled" }]
        );
      }

      toast.success(`TN-${ticketNumber} ticket is recalled`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-feedback"] });
    },
    onError(error) {
      console.error(error);
      toast.error("Failed to change ticket status. Please try again.", {
        description: (error as Error).message,
      });
    },
  });
  return mutation;
}
