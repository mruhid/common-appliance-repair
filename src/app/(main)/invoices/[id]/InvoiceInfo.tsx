"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDocument } from "@/lib/fetchCollection";
import { InvoiceProps } from "@/lib/types";
import { capitalizeSentences, formattedDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Download } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function InvoiceInfo({ id }: { id: string }) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { data, isPending, error } = useQuery<InvoiceProps>({
    queryKey: ["invoice", id],
    queryFn: () => fetchDocument<InvoiceProps>("Jobs", id),
    retry: false,
    staleTime: Infinity,
  });

  const reactToPrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: capitalizeSentences(
      `${data?.CustomerName}-Invoice` || "Invoice-PDF"
    ),
  });

  if (isPending) {
    return (
      <div className="p-6 flex flex-col justify-center items-center">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <InvoiceNotFound
        message={
          error?.message ? capitalizeSentences(error.message) : undefined
        }
      />
    );
  }

  return (
    <div className="relative z-0 bg-background print:z-auto max-w-md   mx-auto   text-foreground space-y-4">
      <Button
        onClick={reactToPrint}
        title="Download invoice"
        className="absolute top-2  right-2 print:hidden"
        variant="outline"
        size="icon"
      >
        <Download />
      </Button>
      <div
        ref={invoiceRef}
        className="w-full mx-auto p-6 border border-muted-foreground/60  print:shadow-none print:border-none rounded-lg "
      >
        <h1 className="text-3xl font-bold text-center mb-8  pb-3">Invoice</h1>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between  pb-1">
            <strong>Customer Name:</strong>
            <span>{data.CustomerName}</span>
          </div>
          <div className="flex justify-between  pb-1">
            <strong>Phone:</strong>
            <span>{data.Phone}</span>
          </div>
          <div className="flex justify-between  pb-1">
            <strong>Address:</strong>
            <span>{capitalizeSentences(data.Address)}</span>
          </div>
          <div className="flex justify-between  pb-1">
            <strong>Unit:</strong>
            <span>{data.Apartment}</span>
          </div>
          <div className="flex justify-between  pb-1">
            <strong>Technician:</strong>
            <span>{data.Technician}</span>
          </div>
          <div className="flex justify-between  pb-1">
            <strong>Payment Type:</strong>
            <span>{data.PaymentType}</span>
          </div>
          <div className="flex justify-between  pb-1">
            <strong>Total Price:</strong>
            <span className="font-semibold">${data.TotalPrice}</span>
          </div>
          <div className="flex justify-between  pb-1">
            <strong>Action Date:</strong>
            <span>{formattedDate(data.ActionDate)}</span>
          </div>
          <div className="flex justify-between  pb-1">
            <strong>Action Time:</strong>
            <span>{data.ActionTime}</span>
          </div>
          <div className="flex flex-col pt-2">
            <strong>Description:</strong>
            <p className="mt-1">{capitalizeSentences(data.Description)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceNotFound({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-destructive p-8 space-y-3">
      <AlertTriangle className="w-12 h-12 text-destructive" />
      <h2 className="text-2xl font-semibold">Invoice Not Found</h2>
      <p className="text-center text-sm max-w-sm">
        {message ??
          "The invoice you’re looking for doesn’t exist or an unexpected error occurred."}
      </p>
    </div>
  );
}

export function RateBeforeInvoiceDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Ignore outside clicks so dialog stays open
        // Only close via setIsOpen(false) in your button
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-md h-[380px] flex flex-col justify-between"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Please rate our service before reviewing your invoice
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex justify-center w-full">
          <a
            onClick={() => setIsOpen(false)}
            href="https://maps.app.goo.gl/xuSaz5JdBbG6qcpY7?g_st=iw"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full" variant={"companyBtn"}>
              Rate Now
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
