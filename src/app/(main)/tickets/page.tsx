import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, FilePlus, RotateCcw } from "lucide-react";
import { Metadata } from "next";
import TicketFeed from "./TicketFeed";
import LoginModal from "../LoginModal";

export const metadata: Metadata = {
  title: "Tickets",
};

export default function Page() {
  return (
    <LoginModal>
      <div className="flex pt-2 mx-auto w-full px-4 max-w-[1800px] flex-col">
        <Tabs defaultValue="Open" className="w-full">
          <TabsList className="flex w-full h-16 border border-muted-foreground/30 bg-card overflow-x-auto">
            <TabsTrigger
              value="Open"
              className="flex flex-row items-center justify-center gap-1 px-4 text-xs sm:text-sm rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <FilePlus className="size-4 sm:size-5 hidden sm:inline-block" />
              <span>Opened Tickets</span>
            </TabsTrigger>

            <TabsTrigger
              value="Closed"
              className="flex flex-row items-center justify-center gap-1 px-4 text-xs sm:text-sm rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <Archive className="size-4 sm:size-5 hidden sm:inline-block" />
              <span>Closed Tickets</span>
            </TabsTrigger>

            <TabsTrigger
              value="Recalled"
              className="flex flex-row items-center justify-center gap-1 px-4 text-xs sm:text-sm rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <RotateCcw className="size-4 sm:size-5 hidden sm:inline-block" />
              <span>Recalled Tickets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Open">
            <TicketFeed ticketStatus="Open" />
          </TabsContent>
          <TabsContent value="Closed">
            <TicketFeed ticketStatus="Closed" />
          </TabsContent>
          <TabsContent value="Recalled">
            <TicketFeed ticketStatus="Recalled" />
          </TabsContent>
        </Tabs>
      </div>
    </LoginModal>
  );
}
