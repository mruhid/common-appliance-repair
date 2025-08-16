import { Metadata } from "next";
import LoginModal from "../LoginModal";
import TicketStatusTab from "./TicketStatusTab";

export const metadata: Metadata = {
  title: "Tickets",
};

export default function Page() {
  return (
    <LoginModal>
      <div className="flex pt-2 mx-auto w-full px-4 max-w-[1800px] flex-col">
        <TicketStatusTab />
      </div>
    </LoginModal>
  );
}
