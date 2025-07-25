"use client";
import LoadingButton from "@/components/LoadingButton";
import Pagination, { PaginationSkeleton } from "@/components/Pagination";
import FirebaseDocumentSearchBar from "@/components/searchBar/FirebaseDocumentSearchBar";
import { TicketItemSkeleton } from "@/components/TicketItemSkeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { findDocumentsByFieldValuePaginated } from "@/lib/fetchCollection";
import { TicketStatusTypes } from "@/lib/types";
import { formattedDate, getTimeLeftFromTimestamp } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { useState } from "react";
import { TicketProps } from "../create-ticket/createTicket";
import { useUpdateTicketStatus } from "./mutation";

export default function TicketFeed({
  ticketStatus,
}: {
  ticketStatus: TicketStatusTypes;
}) {
  const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    data: tickets,
    isPending,
    isError,
  } = useQuery<TicketProps[]>({
    queryKey: ["tickets", ticketStatus, page],
    queryFn: async () =>
      await findDocumentsByFieldValuePaginated<TicketProps>(
        "Tickets",
        "TicketStatus",
        ticketStatus,
        10, //Page size
        page,
        setTotalPages,
        "ActionDate"
      ),
    retry: 1,
    staleTime: Infinity,
  });

  return (
    <div className="flex  w-full flex-col items-start">
      <FirebaseDocumentSearchBar<TicketProps>
        searchBarPlaceholder="Seacrh tickets"
        documentName="Tickets"
        fieldsNameArray={["TicketNumber", "Address"]}
      />
      <div className="grid w-full   grid-cols-1  lg:grid-cols-2">
        {/* LEFT: Ticket List */}
        <div className="space-y-4  border-r  border-muted-foreground/50 px-2">
          <h2 className="text-2xl text-primary text-center font-semibold">
            Tickets
          </h2>
          {!isPending ? (
            totalPages > 1 && (
              <Pagination
                pageNumber={page}
                totalPages={totalPages}
                setPageNumber={setPage}
              />
            )
          ) : (
            <PaginationSkeleton />
          )}
          <ScrollArea className="w-full bg-card border  p-2 h-76 lg:h-82 xl:h-[350px]  rounded-md ">
            <div className="flex flex-col w-full gap-y-2">
              {isPending ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TicketItemSkeleton key={i} />
                ))
              ) : isError ? (
                <div className="text-destructive w-full text-center text-sm font-medium border border-destructive rounded-md p-4 bg-destructive/10">
                  Cannot connect to server. Please try again later.
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-muted-foreground text-center w-full text-sm font-medium border border-border rounded-md p-4 bg-muted">
                  No tickets found.
                </div>
              ) : (
                tickets.map((ticket, index) => (
                  <TicketItem
                    key={index}
                    ticket={ticket}
                    onShowTickedValue={setSelectedTicket}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: Ticket Detail Viewer */}
        <div className="p-4 hidden lg:flex items-center justify-center">
          <div className="w-md aspect-[1/1]">
            <TicketDetailsCard ticket={selectedTicket} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface TicketItemProps {
  ticket: TicketProps;
  onShowTickedValue: (ticket: TicketProps) => void;
}
function TicketItem({ ticket, onShowTickedValue }: TicketItemProps) {
  const { Description, ActionDate, TicketNumber } = ticket;
  const timeLeft = getTimeLeftFromTimestamp(ActionDate);

  return (
    <>
      <div
        onClick={() => onShowTickedValue(ticket)}
        title={Description}
        className="hidden lg:flex justify-center items-center cursor-pointer rounded-lg border bg-card p-4 shadow hover:bg-accent hover:text-accent-foreground transition"
      >
        <div className="flex w-full justify-between items-start">
          <div className="flex flex-col max-w-[85%]">
            <h3 className="text-base capitalize font-medium truncate">
              {Description.slice(0, 35)}
              {Description.length > 25 ? "..." : ""}
            </h3>
            <p className="text-sm text-muted-foreground">Deadline {timeLeft}</p>
          </div>
          <span className="text-sm font-semibold whitespace-nowrap">
            TNº {TicketNumber}
          </span>
        </div>
      </div>
      <TicketDetailsDialog ticket={ticket} timeLeft={timeLeft} />
    </>
  );
}

function TicketDetailsCard({ ticket }: { ticket: TicketProps | null }) {
  const [isOpen, setIsOpen] = useState<boolean>(!!ticket);
  const mutation = useUpdateTicketStatus();

  if (!ticket || isOpen) {
    return (
      <div className="flex h-full w-full shadow flex-col items-center justify-center rounded-xl border border-muted-foreground bg-muted p-6 text-muted-foreground space-y-4">
        <Info className="h-10 w-10 text-muted-foreground" />
        <p className="text-center text-base font-medium">
          Click a ticket on the left to view its details
        </p>
      </div>
    );
  }

  const updateStatusFromClosedToRecalled = () => {
    mutation.mutate(
      { ticketNumber: ticket.TicketNumber },
      {
        onSuccess: () => {
          setIsOpen(true);
        },
      }
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Ticket Nº {ticket.TicketNumber}
        </h2>
        {ticket.TicketStatus === "Closed" && (
          <LoadingButton
            loading={mutation.isPending}
            onClick={updateStatusFromClosedToRecalled}
            variant={"companyBtn"}
            className="rounded-md"
          >
            Recalled
          </LoadingButton>
        )}
      </div>

      <div className="text-muted-foreground space-y-1">
        <p>
          <span className="font-medium">Customer:</span> {ticket.CustomerName}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {ticket.Phone}
        </p>
        <p>
          <span className="font-medium">Address:</span> {ticket.Address} — Apt{" "}
          {ticket.Apartment}
        </p>
        <p>
          <span className="font-medium">SC:</span> {ticket.SC}
        </p>
        <p>
          <span className="font-medium">Technician:</span> {ticket.Technician}
        </p>
        <p>
          <span className="font-medium">Status:</span> {ticket.TicketStatus}
        </p>
        <p>
          <span className="font-medium">Action Time:</span> {ticket.ActionTime}
        </p>
        <p>
          <span className="font-medium">Action Date:</span>{" "}
          {formattedDate(ticket.ActionDate)}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium">Description</h3>
        <p className="text-sm text-muted-foreground">{ticket.Description}</p>
      </div>
    </div>
  );
}

function TicketDetailsDialog({
  ticket,
  timeLeft,
}: {
  ticket: TicketProps | null;
  timeLeft: string;
}) {
  if (!ticket) return null;

  const formattedDate = format(
    ticket.ActionDate.toDate(),
    "dd MMM yyyy, HH:mm"
  );

  return (
    <Dialog>
      <DialogTrigger>
        <div className="cursor-pointer flex lg:hidden justify-center items-center rounded-lg border bg-card p-4 shadow hover:bg-accent hover:text-accent-foreground transition">
          <div className="flex w-full justify-between items-start">
            <div className="flex flex-col justify-start items-start max-w-[85%]">
              <h3 className="text-base capitalize font-medium truncate">
                {ticket.Description}
              </h3>
              <p className="text-sm text-muted-foreground">
                Deadline {timeLeft}
              </p>
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">
              TNº {ticket.TicketNumber}
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Ticket Nº {ticket.TicketNumber}</DialogTitle>
        </DialogHeader>

        <div className="text-muted-foreground space-y-1 text-sm">
          <p>
            <span className="font-medium">Customer:</span> {ticket.CustomerName}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {ticket.Phone}
          </p>
          <p>
            <span className="font-medium">Address:</span> {ticket.Address} — Apt{" "}
            {ticket.Apartment}
          </p>
          <p>
            <span className="font-medium">SC:</span> {ticket.SC}
          </p>
          <p>
            <span className="font-medium">Technician:</span> {ticket.Technician}
          </p>
          <p>
            <span className="font-medium">Status:</span> {ticket.TicketStatus}
          </p>
          <p>
            <span className="font-medium">Action Time:</span>{" "}
            {ticket.ActionTime}
          </p>
          <p>
            <span className="font-medium">Action Date:</span> {formattedDate}
          </p>
        </div>

        <div className="pt-4">
          <h3 className="text-sm font-medium mb-1">Description</h3>
          <p className="text-sm text-muted-foreground">{ticket.Description}</p>
        </div>

        {ticket.TicketStatus === "Closed" && (
          <Button variant="companyBtn" className="mt-4 w-full rounded-md">
            Recalled
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
