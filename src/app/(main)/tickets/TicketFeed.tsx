"use client";
import LoadingButton from "@/components/LoadingButton";
import Pagination, { PaginationSkeleton } from "@/components/Pagination";
import FirebaseDocumentSearchBar from "@/components/searchBar/FirebaseDocumentSearchBar";
import ShowExpiredToggle, {
  ShowExpiredToggleSkeleton,
} from "@/components/ShowExpiredToggle";
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
import { TicketStatusTypes, TotalPagesCountProps } from "@/lib/types";
import {
  capitalizeSentences,
  formattedDate,
  getTimeLeftFromTimestamp,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { TicketProps } from "../create-ticket/createTicket";
import { useUpdateTicketStatus } from "./mutation";
import SendMessageToTechnicianDialog from "./SendMessageToTechnicanDialog";

export default function TicketFeed({
  ticketStatus,
  totalPages,
  setTotalPages,
}: {
  ticketStatus: TicketStatusTypes;
  totalPages: TotalPagesCountProps;
  setTotalPages: React.Dispatch<React.SetStateAction<TotalPagesCountProps>>;
}) {
  const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(
    null
  );
  const [sendMessageDialog, setSendMessageDialog] = useState<boolean>(false);

  const [page, setPage] = useState(1);

  const [showExpiredTicket, setShowExpiredTicket] = useState(false);

  const {
    data: tickets,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useQuery<TicketProps[]>({
    queryKey: ["tickets", ticketStatus, page, showExpiredTicket],
    queryFn: async () =>
      await findDocumentsByFieldValuePaginated<TicketProps>(
        "Tickets",
        "TicketStatus",
        ticketStatus,
        10, //Page size
        page,
        setTotalPages,
        showExpiredTicket,
        "ActionDate"
      ),
    retry: 1,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!isPending && !isFetching) {
      refetch();
    }
  }, [showExpiredTicket, refetch]);

  return (
    <>
      <SendMessageToTechnicianDialog
        ticket={selectedTicket}
        open={sendMessageDialog}
        onOpenChange={setSendMessageDialog}
      />
      <div className="flex w-full flex-col items-start">
        <FirebaseDocumentSearchBar<TicketProps>
          searchBarPlaceholder="Search tickets"
          documentName="Tickets"
          fieldsNameArray={["TicketNumber", "Address"]}
        />
        <div className="grid w-full h-[58vh] grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col gap-y-2 border-r border-muted-foreground/50 px-2 h-full">
            <div className="grid items-center grid-cols-2 md:grid-cols-3  gap-2 space-x-2 w-full ">
              <div className="hidden md:flex"></div>
              <div className="text-start md:text-center">
                <h2 className="text-2xl text-primary font-semibold">Tickets</h2>
              </div>
              {!isPending && !isFetching ? (
                <ShowExpiredToggle
                  showExpired={showExpiredTicket}
                  onShowExpired={setShowExpiredTicket}
                  title="Show expired tickets"
                />
              ) : (
                <ShowExpiredToggleSkeleton />
              )}
            </div>

            {!isPending && !isFetching ? (
              totalPages[ticketStatus] > 1 && (
                <Pagination
                  pageNumber={page}
                  totalPages={totalPages}
                  setPageNumber={setPage}
                  ticketStatus={ticketStatus}
                />
              )
            ) : (
              <PaginationSkeleton />
            )}

            <div className="flex-1 h-full min-h-0">
              <ScrollArea className="h-[42vh] space-y-1 py-1  w-full pr-1">
                <div className="flex py-3 mb-2 flex-col gap-y-2">
                  {isPending || isFetching ? (
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
  const [sliceLimit, setSliceLimit] = useState(40);

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      if (width >= 1280)
        setSliceLimit(60); // XL screens
      else if (width >= 1024)
        setSliceLimit(40); // LG screens
      else if (width >= 768)
        setSliceLimit(80); // MD screens
      else setSliceLimit(50); // Small screens
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

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
            <h3 className="text-base font-medium truncate">
              {capitalizeSentences(Description.slice(0, sliceLimit))}
              {Description.length > sliceLimit ? "..." : ""}
            </h3>
            <p className="text-sm text-muted-foreground">{timeLeft}</p>
          </div>
          <span className="text-sm font-semibold whitespace-nowrap">
            #{TicketNumber}
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
          Ticket #{ticket.TicketNumber}
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
  const [sliceLimit, setSliceLimit] = useState(20);

  const mutation = useUpdateTicketStatus();

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      if (width >= 1280)
        setSliceLimit(60); // XL screens
      else if (width >= 1024)
        setSliceLimit(40); // LG screens
      else if (width >= 768)
        setSliceLimit(70); // MD screens
      else if (width >= 600) setSliceLimit(60);
      else if (width >= 500) setSliceLimit(45);
      else if (width >= 300) setSliceLimit(20);
      else setSliceLimit(15); // Small screens
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  if (!ticket) return null;

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
              <h3 className="text-base font-medium truncate">
                {capitalizeSentences(ticket.Description.slice(0, sliceLimit))}
                {ticket.Description.length > sliceLimit ? "..." : ""}
              </h3>
              <p className="text-sm text-muted-foreground">{timeLeft}</p>
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">
              #{ticket.TicketNumber}
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Ticket #{ticket.TicketNumber}
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
            <span className="font-medium">Action Date:</span>{" "}
            {formattedDate(ticket.ActionDate)}
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
