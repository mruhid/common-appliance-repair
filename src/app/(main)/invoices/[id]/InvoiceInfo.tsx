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
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function InvoiceInfo({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery<InvoiceProps>({
    queryKey: ["invoice", id],
    queryFn: () => fetchDocument<InvoiceProps>("Jobs", id),
    retry: false,
    staleTime: Infinity,
  });

  if (isLoading) {
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
    <div className="p-8 max-w-2xl mx-auto border shadow-md bg-background text-foreground space-y-3">
      <h1 className="text-2xl font-bold text-center mb-6">Invoice</h1>
      <div>
        <strong>Customer Name:</strong> {data.CustomerName}
      </div>
      <div>
        <strong>Phone:</strong> {data.Phone}
      </div>
      <div>
        <strong>Address:</strong> {capitalizeSentences(data.Address)}
      </div>
      <div>
        <strong>Unit:</strong> {data.Apartment}
      </div>
      <div>
        <strong>Technician:</strong> {data.Technician}
      </div>
      <div>
        <strong>Payment Type:</strong> {data.PaymentType}
      </div>
      <div>
        <strong>Total Price:</strong> {data.TotalPrice}
      </div>
      <strong>Action Date:</strong> {formattedDate(data.ActionDate)}
      <div>
        <strong>Action Time:</strong> {data.ActionTime}
      </div>
      <div>
        <strong>Description:</strong> {capitalizeSentences(data.Description)}
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
