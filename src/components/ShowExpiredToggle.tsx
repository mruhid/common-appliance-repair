import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

interface ShowExpiredToogleProps {
  title: string;
  showExpired: boolean;
  onShowExpired: (show: boolean) => void;
}
export default function ShowExpiredToggle({
  onShowExpired,
  showExpired,
  title,
}: ShowExpiredToogleProps) {
  return (
    <div className="flex cursor-pointer border border-muted-foreground/40 rounded-lg bg-card p-2 items-center space-x-2">
      <Switch
        id="show-expired"
        checked={showExpired}
        onCheckedChange={onShowExpired}
      />
      <Label htmlFor="expired" className="capitalize text-primary">
        {title}
      </Label>
    </div>
  );
}

export function ShowExpiredToggleSkeleton() {
  return (
    <div
      className={`flex border border-muted-foreground/40 rounded-lg bg-card p-2 items-center space-x-2 `}
    >
      <Skeleton className="h-5 bg-muted-foreground/50 w-12 rounded-full" />

      <Skeleton className="h-5 bg-muted-foreground/50  w-32 rounded-md" />
    </div>
  );
}
