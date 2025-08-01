import { Metadata } from "next";
import Image from "next/image";
import Logo from "@/assets/colored-logo.png";
import CreateTicketForm from "./CreateTicketForm";
import ServiceCallPolicyDialog from "@/components/ServiceCallPolicyDialog";

export const metadata: Metadata = {
  title: "New Service Ticket",
};
export default function Page() {
  return (
    <main className="w-full px-2 bg-white h-screen flex flex-col">
      <div className="grid px-6 grid-cols-3 gap-4">
        <div className="flex items-center space-x-1">
          <Image src={Logo} alt="Company logo" width={300} />
          <ServiceCallPolicyDialog />
        </div>
        <div className=" flex justify-center items-center text-center text-primary">
          <h1 className="md:text-5xl text-4xl font-semibold text-[#0d2841]">
            Create Ticket
          </h1>
        </div>
      </div>
      <CreateTicketForm />
    </main>
  );
}
