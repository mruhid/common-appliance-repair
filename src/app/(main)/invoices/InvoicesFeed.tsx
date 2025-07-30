"use client";
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
import { InvoiceProps, TicketStatusTypes } from "@/lib/types";
import {
  capitalizeSentences,
  formattedDate,
  getTimeLeftFromTimestamp,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function InvoicesFeed({
  ticketStatus,
}: {
  ticketStatus: TicketStatusTypes;
}) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceProps | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    data: invoices,
    isPending,
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
        "ActionDate"
      ),
    retry: 1,
    staleTime: Infinity,
  });

  return (
    <div className="flex w-full flex-col items-start">
      <FirebaseDocumentSearchBar<InvoiceProps>
        searchBarPlaceholder="Seacrh invoices"
        documentName="Jobs"
        fieldsNameArray={["TicketNumber", "Address"]}
      />
      <div className="grid w-full h-[58vh] grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col gap-y-2 border-r border-muted-foreground/50 px-2 h-full">
          <h2 className="text-2xl text-primary text-center font-semibold py-2">
            Invoices
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
  const { Description, ActionDate, TicketNumber } = invoice;
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
          Ticket Nº {invoice.TicketNumber}
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

  if (!invoice) return null;

  const formattedDate = format(
    invoice.ActionDate.toDate(),
    "dd MMM yyyy, HH:mm"
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="cursor-pointer flex lg:hidden justify-center items-center rounded-lg border bg-card p-4 shadow hover:bg-accent hover:text-accent-foreground transition">
          <div className="flex w-full justify-between items-start">
            <div className="flex flex-col justify-start items-start max-w-[85%]">
              <h3 className="text-base capitalize font-medium truncate">
                {invoice.Description}
              </h3>
              <p className="text-sm text-muted-foreground">
                Deadline {timeLeft}
              </p>
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">
              TNº {invoice.TicketNumber}
            </span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="p-6 max-h-[90vh]  overflow-y-auto">
        <DialogHeader>
          <div className="w-full flex mt-4 text-primary justify-between items-center">
            <DialogTitle>Ticket Nº {invoice.TicketNumber}</DialogTitle>
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
            <span className="font-medium">Action Date:</span> {timeLeft} |{" "}
            {formattedDate}
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
