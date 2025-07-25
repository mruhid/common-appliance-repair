import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, FilePlus, RotateCcw } from "lucide-react";
import { Metadata } from "next";
import TicketFeed from "./TicketFeed";

export const metadata: Metadata = {
  title: "Tickets",
};
export default function Page() {
  return (
    <div className="w-full top-0 relative   p-4">
      <main className="mx-auto  w-full  space-y-5 ">
        <Tabs defaultValue="Open" className="flex  flex-col">
          <div className="sticky top-26 z-30 bg-background">
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
          </div>

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
      </main>
    </div>
  );
}
