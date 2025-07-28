import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "./ui/button";

export default function ServiceCallPolicyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer" title="Click and see company policy">
          <Info className="size-7 text-primary focus:outline-none" />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Service Call Policy Description</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-2 text-sm leading-relaxed">
          <p>
            A service call fee will be charged under the following
            circumstances:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              If the appliance is not repairable due to extensive damage or
              obsolete model.
            </li>
            <li>
              If parts are no longer available from the manufacturer or
              suppliers.
            </li>
            <li>
              If you choose not to proceed with the repair after diagnosis.
            </li>
            <li>
              If the appliance is found to be operating normally or the issue is
              user-related (e.g., settings, installation, power supply).
            </li>
          </ul>
          <p>
            The service call fee covers the technician’s time, travel, and
            professional diagnosis, regardless of whether the repair is
            completed.
          </p>
        </div>
        <div className="pt-4 flex w-full justify-end">
          <DialogClose asChild>
            <Button className="w-full" variant="destructive">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
