"use client";
import LoadingButton from "@/components/LoadingButton";
import Pagination, { PaginationSkeleton } from "@/components/Pagination";
import FirebaseDocumentSearchBar from "@/components/searchBar/FirebaseDocumentSearchBar";
import { TicketItemSkeleton } from "@/components/TicketItemSkeleton";
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
import {
  capitalizeSentences,
  formattedDate,
  getTimeLeftFromTimestamp,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { useState } from "react";
import { TicketProps } from "../create-ticket/createTicket";
import { useUpdateTicketStatus } from "./mutation";
import SendMessageToTechnicianDialog from "./SendMessageToTechnicanDialog";

export default function TicketFeed({
  ticketStatus,
}: {
  ticketStatus: TicketStatusTypes;
}) {
  const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(
    null
  );
  const [sendMessageDialog, setSendMessageDialog] = useState<boolean>(false);

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
    <>
      <SendMessageToTechnicianDialog
        ticket={selectedTicket}
        open={sendMessageDialog}
        onOpenChange={setSendMessageDialog}
      />
      <div className="flex w-full flex-col items-start">
        <FirebaseDocumentSearchBar<TicketProps>
          searchBarPlaceholder="Seacrh tickets"
          documentName="Tickets"
          fieldsNameArray={["TicketNumber", "Address"]}
        />
        <div className="grid w-full h-[58vh] grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col gap-y-2 border-r border-muted-foreground/50 px-2 h-full">
            <h2 className="text-2xl text-primary text-center font-semibold py-2">
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

            <div className="flex-1 h-full min-h-0">
              <ScrollArea className="h-[42vh]  w-full pr-1">
                <div className="flex flex-col gap-y-2">
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
                      No ticket found.
                    </div>
                  ) : (
                    tickets.map((ticket, index) => (
                      <TicketItem
                        openShowSendMessageDialog={setSendMessageDialog}
                        key={index}
                        ticket={ticket}
                        onShowTickedValue={setSelectedTicket}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* RIGHT: Ticket Detail Viewer */}
          <div className="p-4 hidden overflow-y-auto h-full lg:flex items-center justify-center">
            <div className="w-full">
              <TicketDetailsCard
                openShowSendMessageDialog={setSendMessageDialog}
                ticket={selectedTicket}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface TicketItemProps {
  ticket: TicketProps;
  onShowTickedValue: (ticket: TicketProps) => void;
  openShowSendMessageDialog: (open: boolean) => void;
}
function TicketItem({
  ticket,
  onShowTickedValue,
  openShowSendMessageDialog,
}: TicketItemProps) {
  const { Description, ActionDate, TicketNumber } = ticket;
  const timeLeft = getTimeLeftFromTimestamp(ActionDate);

  return (
    <>
      <TicketDetailsDialog
        openShowSendMessageDialog={openShowSendMessageDialog}
        ticket={ticket}
        timeLeft={timeLeft}
      />
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
    </>
  );
}

interface TicketDetailsCardProps {
  ticket: TicketProps | null;
  openShowSendMessageDialog: (open: boolean) => void;
}

function TicketDetailsCard({
  ticket,
  openShowSendMessageDialog,
}: TicketDetailsCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(!!ticket);
  const mutation = useUpdateTicketStatus();

  if (!ticket || isOpen) {
    return (
      <div className="flex mx-auto w-[300px] aspect-square shadow flex-col items-center justify-center rounded-xl border border-muted-foreground bg-muted p-6 text-muted-foreground space-y-4">
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
          openShowSendMessageDialog(true);
        },
      }
    );
  };

  return (
    <div className="flex  w-full flex-col justify-center rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl text-primary font-semibold">
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
          <span className="font-medium">Address:</span>{" "}
          {capitalizeSentences(ticket.Address)} — Unit{":"}
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
        <p className="text-sm text-muted-foreground">
          {capitalizeSentences(ticket.Description)}
        </p>
      </div>
    </div>
  );
}

function TicketDetailsDialog({
  ticket,
  timeLeft,
  openShowSendMessageDialog,
}: {
  ticket: TicketProps | null;
  timeLeft: string;
  openShowSendMessageDialog: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const mutation = useUpdateTicketStatus();

  if (!ticket) return null;

  const formattedDate = format(
    ticket.ActionDate.toDate(),
    "dd MMM yyyy, HH:mm"
  );

  const updateStatusFromClosedToRecalled = () => {
    mutation.mutate(
      { ticketNumber: ticket.TicketNumber },
      {
        onSuccess: () => {
          setIsOpen(false);
          openShowSendMessageDialog(true);
        },
      }
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <DialogTitle className="text-primary">
            Ticket Nº {ticket.TicketNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="text-muted-foreground space-y-1 text-sm">
          <p>
            <span className="font-medium">Customer:</span> {ticket.CustomerName}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {ticket.Phone}
          </p>
          <p>
            <span className="font-medium">Address:</span>{" "}
            {capitalizeSentences(ticket.Address)} — Unit{":"}
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
          <p className="text-sm text-muted-foreground">
            {capitalizeSentences(ticket.Description)}
          </p>
        </div>

        {ticket.TicketStatus === "Closed" && (
          <LoadingButton
            loading={mutation.isPending}
            onClick={updateStatusFromClosedToRecalled}
            variant="companyBtn"
            className="mt-4 w-full rounded-md"
          >
            Recalled
          </LoadingButton>
        )}
      </DialogContent>
    </Dialog>
  );
}
