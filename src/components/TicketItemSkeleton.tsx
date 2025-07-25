import { Skeleton } from "./ui/skeleton";

export function TicketItemSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex flex-col max-w-[85%] space-y-2">
          <Skeleton className="h-5 w-38 rounded-md bg-muted-foreground" />
          <Skeleton className="h-4 w-20 rounded-md  bg-muted-foreground" />
        </div>
        <Skeleton className="h-5 w-16 rounded-md bg-muted-foreground" />
      </div>
    </div>
  );
}
