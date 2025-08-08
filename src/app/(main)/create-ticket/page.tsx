import Logo from "@/assets/colored-logo.png";
import { Metadata } from "next";
import Image from "next/image";
import CreateTicketForm from "./CreateTicketForm";

export const metadata: Metadata = {
  title: "New Service Ticket",
};
export default function Page() {
  return (
    <main className="w-full px-2 bg-background h-screen flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center gap-2 md:space-x-2">
          <Image
            src={Logo}
            alt="Company logo"
            className="w-48 md:w-60 h-auto  bg-white  rounded-xl object-contain"
            priority
          />
        </div>

        <div className="flex justify-center items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-form-color">
            Create Ticket
          </h1>
        </div>

        <div className="hidden md:block" />
      </div>

      <CreateTicketForm />
    </main>
  );
}
