import { Metadata } from "next";
import LoginModal from "../LoginModal";
import InvoiceStatusTab from "./InvoiceStatusTab";

export const metadata: Metadata = {
  title: "Invoices",
};

export default function Page() {
  return (
    <LoginModal>
      <div className="flex pt-2 mx-auto w-full px-4 max-w-[1800px] flex-col">
        <InvoiceStatusTab />
      </div>
    </LoginModal>
  );
}
