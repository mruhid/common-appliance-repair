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
        <Tabs defaultValue="Open" className="flex  flex-col">
          <TabsList className="grid  h-20 w-full grid-cols-3 border border-muted-foreground/30 bg-card">
            <TabsTrigger
              value="Open"
              className="h-16 rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <FilePlus className="mr-4" /> <p>Open Ticket</p>
            </TabsTrigger>
            <TabsTrigger
              value="Closed"
              className="h-16 rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <Archive className="mr-4" /> Closed Ticket
            </TabsTrigger>
            <TabsTrigger
              value="Recalled"
              className="h-16 rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <RotateCcw className="mr-4" /> Recalled Ticket
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
