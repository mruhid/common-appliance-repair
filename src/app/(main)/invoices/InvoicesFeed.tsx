"use client";
import Pagination, { PaginationSkeleton } from "@/components/Pagination";
import FirebaseDocumentSearchBar from "@/components/searchBar/FirebaseDocumentSearchBar";
import ShowExpiredToggle, {
  ShowExpiredToggleSkeleton,
} from "@/components/ShowExpiredToggle";
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
import {
  InvoiceProps,
  TicketStatusTypes,
  TotalPagesCountProps,
} from "@/lib/types";
import {
  capitalizeSentences,
  formattedDate,
  getTimeLeftFromTimestamp,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InvoicesFeed({
  ticketStatus,
  totalPages,
  setTotalPages,
}: {
  ticketStatus: TicketStatusTypes;
  totalPages: TotalPagesCountProps;
  setTotalPages: React.Dispatch<React.SetStateAction<TotalPagesCountProps>>;
}) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceProps | null>(
    null
  );
  const [page, setPage] = useState(1);

  const [showExpiredTicket, setShowExpiredTicket] = useState(false);

  const {
    data: invoices,
    isPending,
    refetch,
    isFetching,
    isError,
  } = useQuery<InvoiceProps[]>({
    queryKey: ["invoices", ticketStatus, page],
    queryFn: async () =>
      await findDocumentsByFieldValuePaginated<InvoiceProps>(
        "Jobs",
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
    <div className="flex w-full flex-col items-start">
      <FirebaseDocumentSearchBar<InvoiceProps>
        searchBarPlaceholder="Search invoices"
        documentName="Jobs"
        fieldsNameArray={["TicketNumber", "Address"]}
      />
      <div className="grid w-full h-[58vh] grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col gap-y-2 border-r border-muted-foreground/50 px-2 h-full">
          <div className="grid items-center grid-cols-2 md:grid-cols-3  gap-2 space-x-2 w-full ">
            <div className="hidden md:flex"></div>
            <div className="text-start md:text-center">
              <h2 className="text-2xl text-primary font-semibold">Invoices</h2>
            </div>
            {!isPending && !isFetching ? (
              <ShowExpiredToggle
                showExpired={showExpiredTicket}
                onShowExpired={setShowExpiredTicket}
                title="Show expired invoices"
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
            <ScrollArea className="h-[42vh] space-y-1 py-1 w-full pr-1">
              <div className="flex flex-col py-3 mb-2 gap-y-2">
                {isPending || isFetching ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TicketItemSkeleton key={i} />
                  ))
                ) : isError ? (
                  <div className="text-destructive w-full text-center text-sm font-medium border border-destructive rounded-md p-4 bg-destructive/10">
                    Cannot connect to server. Please try again later.
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-muted-foreground text-center w-full text-sm font-medium border border-border rounded-md p-4 bg-muted">
                    No invoice found.
                  </div>
                ) : (
                  invoices.map((invoice, index) => (
                    <InvoiceItem
                      key={index}
                      invoice={invoice}
                      onShowInvoiceValue={setSelectedInvoice}
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
            <InvoiceDetailsCard invoice={selectedInvoice} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface InvoiceItemProps {
  invoice: InvoiceProps;
  onShowInvoiceValue: (invoice: InvoiceProps) => void;
}
function InvoiceItem({ invoice, onShowInvoiceValue }: InvoiceItemProps) {
  const [sliceLimit, setSliceLimit] = useState(40);

  const { Description, ActionDate, TicketNumber } = invoice;

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
  const timeLeft = getTimeLeftFromTimestamp(ActionDate);

  return (
    <>
      <div
        onClick={() => onShowInvoiceValue(invoice)}
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
      <InvoiceDetailsDialog invoice={invoice} timeLeft={timeLeft} />
    </>
  );
}

function InvoiceDetailsCard({ invoice }: { invoice: InvoiceProps | null }) {
  if (!invoice) {
    return (
      <div className="flex mx-auto w-[300px] aspect-square shadow flex-col items-center justify-center rounded-xl border border-muted-foreground bg-muted p-6 text-muted-foreground space-y-4">
        <Info className="h-10 w-10 text-muted-foreground" />
        <p className="text-center text-base font-medium">
          Click a invoice on the left to view its details
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-center rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl text-primary font-semibold">
          Ticket #{invoice.TicketNumber}
        </h2>
        <Button className="text-primary" variant={"outline"} asChild>
          <Link href={`/invoices/${invoice.id}`}>See invoice</Link>
        </Button>
      </div>

      {/* Equal-width compact two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-medium">Customer:</span> {invoice.CustomerName}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {invoice.Phone}
        </p>
        <p>
          <span className="font-medium">Address:</span>{" "}
          {capitalizeSentences(invoice.Address)} — Unit{":"}
          {invoice.Apartment}
        </p>
        <p>
          <span className="font-medium">Technician:</span> {invoice.Technician}
        </p>
        <p>
          <span className="font-medium">Status:</span> {invoice.TicketStatus}
        </p>
        <p>
          <span className="font-medium">Action Time:</span> {invoice.ActionTime}
        </p>
        <p>
          <span className="font-medium">Action Date:</span>{" "}
          {formattedDate(invoice.ActionDate)}
        </p>
        <p>
          <span className="font-medium">Number of Parts:</span>{" "}
          {invoice.NumberOfParts}
        </p>
        <p>
          <span className="font-medium">Parts Cost:</span> $
          {invoice.PartsCost.toFixed(2)}
        </p>
        <p>
          <span className="font-medium">Payment Type:</span>{" "}
          {invoice.PaymentType}
        </p>
        <p>
          <span className="font-medium">Total Price:</span> $
          {invoice.TotalPrice.toFixed(2)}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium">Description</h3>
        <p className="text-sm text-muted-foreground">
          {capitalizeSentences(invoice.Description)}
        </p>
      </div>
    </div>
  );
}

function InvoiceDetailsDialog({
  invoice,
  timeLeft,
}: {
  invoice: InvoiceProps | null;
  timeLeft: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sliceLimit, setSliceLimit] = useState(20);

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

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="cursor-pointer flex lg:hidden justify-center items-center rounded-lg border bg-card p-4 shadow hover:bg-accent hover:text-accent-foreground transition">
          <div className="flex w-full justify-between items-start">
            <div className="flex flex-col justify-start items-start max-w-[85%]">
              <h3 className="text-base font-medium truncate">
                {capitalizeSentences(invoice.Description.slice(0, sliceLimit))}
                {invoice.Description.length > sliceLimit ? "..." : ""}
              </h3>
              <p className="text-sm text-muted-foreground">{timeLeft}</p>
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">
              #{invoice.TicketNumber}
            </span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="p-6 max-h-[90vh]  overflow-y-auto">
        <DialogHeader>
          <div className="w-full flex mt-4 text-primary justify-between items-center">
            <DialogTitle>Ticket #{invoice.TicketNumber}</DialogTitle>
            <Button variant={"outline"} asChild>
              <Link href={`/invoices/${invoice.id}`}>See invoice</Link>
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground pt-4">
          <p>
            <span className="font-medium">Customer:</span>{" "}
            {invoice.CustomerName}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {invoice.Phone}
          </p>
          <p>
            <span className="font-medium">Address:</span>{" "}
            {capitalizeSentences(invoice.Address)} — Unit {invoice.Apartment}
          </p>
          <p>
            <span className="font-medium">Technician:</span>{" "}
            {invoice.Technician}
          </p>
          <p>
            <span className="font-medium">Ticket Status:</span>{" "}
            {invoice.TicketStatus}
          </p>
          <p>
            <span className="font-medium">General Status:</span>{" "}
            {invoice.Status}
          </p>
          <p>
            <span className="font-medium">Action Time:</span>{" "}
            {invoice.ActionTime}
          </p>
          <p>
            <span className="font-medium">Action Date:</span>{" "}
            {formattedDate(invoice.ActionDate)}
          </p>
          <p>
            <span className="font-medium">Number of Parts:</span>{" "}
            {invoice.NumberOfParts}
          </p>
          <p>
            <span className="font-medium">Parts Cost:</span> $
            {invoice.PartsCost.toFixed(2)}
          </p>
          <p>
            <span className="font-medium">Payment Type:</span>{" "}
            {invoice.PaymentType}
          </p>
          <p>
            <span className="font-medium">Total Price:</span> $
            {invoice.TotalPrice.toFixed(2)}
          </p>
        </div>

        <div className="pt-4">
          <h3 className="text-sm font-medium mb-1">Description</h3>
          <p className="text-sm text-muted-foreground">
            {capitalizeSentences(invoice.Description)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
