"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TotalPagesCountProps } from "@/lib/types";
import { Archive, FilePlus, RotateCcw } from "lucide-react";
import { useState } from "react";
import InvoicesFeed from "./InvoicesFeed";

export default function InvoiceStatusTab() {
  const [totalPages, setTotalPages] = useState<TotalPagesCountProps>({
    Open: 1,
    Closed: 1,
    Recalled: 1,
  });

  return (
    <Tabs defaultValue="Open" className="w-full">
      <TabsList className="flex w-full h-16 border border-muted-foreground/30 bg-card overflow-x-auto">
        <TabsTrigger
          value="Open"
          className="flex flex-row items-center justify-center gap-1 px-4 text-xs sm:text-sm rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
        >
          <FilePlus className="size-4 sm:size-5 hidden sm:inline-block" />
          <span>Opened Invoices</span>
        </TabsTrigger>

        <TabsTrigger
          value="Closed"
          className="flex flex-row items-center justify-center gap-1 px-4 text-xs sm:text-sm rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
        >
          <Archive className="size-4 sm:size-5 hidden sm:inline-block" />
          <span>Closed Invoices</span>
        </TabsTrigger>

        <TabsTrigger
          value="Recalled"
          className="flex flex-row items-center justify-center gap-1 px-4 text-xs sm:text-sm rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
        >
          <RotateCcw className="size-4 sm:size-5 hidden sm:inline-block" />
          <span>Recalled Invoices</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="Open">
        <InvoicesFeed
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          ticketStatus="Open"
        />
      </TabsContent>
      <TabsContent value="Closed">
        <InvoicesFeed
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          ticketStatus="Closed"
        />
      </TabsContent>
      <TabsContent value="Recalled">
        <InvoicesFeed
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          ticketStatus="Recalled"
        />
      </TabsContent>
    </Tabs>
  );
}
