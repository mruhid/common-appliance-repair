"use client";

import Logo from "@/assets/logo-with-name.webp";
import Image from "next/image";
import { forwardRef } from "react";

const A4Invoice = forwardRef<HTMLDivElement>(() => {
  return (
    <div
      className="a4 relative shadow-md text-black bg-white"
      style={{ width: "210mm", minHeight: "297mm" }}
    >
      {/* Print styles */}
      <style jsx>{`
        @page {
          size: A4;
          margin: 12mm;
        }
        .a4 {
          box-shadow: none;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>

      <div className="p-6 text-sm">
        {/* Header */}
        <div className="flex gap-2 flex-col items-start">
          <div className="w-full bg-gray-300 text-black flex justify-between items-center px-3 py-1">
            <div className="text-2xl font-extrabold">
              COMMON{" "}
              <span className="font-medium text-sm">Appliance repair</span>
            </div>
            <div className="text-2xl font-bold">INVOICE</div>
          </div>
          <div className="w-full flex justify-between ">
            <div className="text-xl mt-3 font-bold">
              Phone: <span>+1 (774) 414-4038</span>
            </div>
            <div className="relative w-[170px] h-[110px] flex items-center justify-center">
              <Image
                src={Logo}
                alt="Logo"
                fill
                className="object-cover invert brightness-90"
                priority
              />
            </div>
          </div>

          <div className="text-right  flex justify-between w-full">
            {/* small drill icon area simulated by text */}
            <div className="select-none text-sm font-bold">
              Invoice Date:
              <span className="font-medium text-white border-b-1 px-0.5 border-black">
                Blank area
              </span>
            </div>
            <div className="select-none text-sm font-bold">
              Ticket number:
              <span className="font-medium text-white border-b-1 px-0.5 border-black">
                Blank area
              </span>
            </div>
            <div className="select-none text-sm font-bold">
              Technician:
              <span className="font-medium text-white border-b-1 px-0.5 border-black">
                Blank area
              </span>
            </div>
          </div>
        </div>

        {/* Customer / Device Info box */}
        <div className="mt-2 grid grid-cols-3">
          <div className="col-span-2 border border-black">
            <div className="w-full p-1 items-center gap-1 flex justify-start border-b border-black">
              <div className="text-sm font-bold">Name:</div>
            </div>
            <div className="w-full p-1 flex justify-start gap-1">
              <div className="text-sm font-bold ">Address:</div>
            </div>
          </div>

          <div className="border-y border-r border-black">
            <div className="w-full p-1 items-center gap-1 flex justify-start border-b border-black">
              <div className="text-sm font-bold">Phone:</div>
            </div>
            <div className="w-full p-1 items-center gap-1 flex justify-start border-b border-black">
              <div className="text-sm font-bold">Make:</div>
            </div>
            <div className="w-full p-1 items-center gap-1 flex justify-start border-b border-black">
              <div className="text-sm font-bold">Model:</div>
            </div>
            <div className="w-full p-1 items-center gap-1 flex justify-start ">
              <div className="text-sm font-bold">Serial:</div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div>
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr>
                <th className="w-14 border-x border-b border-black p-1 text-left">
                  QTY
                </th>
                <th className="border-x border-b border-black p-1 text-center">
                  Work Description
                </th>
                <th className="w-24 border-x border-b border-black p-1 text-center">
                  Price
                </th>
                <th className="w-24 border-x border-b border-black p-1 text-center">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="h-8">
                  <td className="border-b border-x border-black p-1 align-top opacity-0">
                    {"Qty"}
                  </td>
                  <td className="border-b border-x border-black p-1 align-top opacity-0">
                    {"Description"}
                  </td>
                  <td className="border-b border-x border-black p-1 align-top text-right opacity-0">
                    {"Price"}
                  </td>
                  <td className="border-b border-x border-black p-1 align-top text-right opacity-0">
                    {"Amount"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className=" flex w-full justify-between">
          {/* Warranty / Terms */}
          <div className="w-2/3 text-xs" style={{ minHeight: 180 }}>
            <div className="font-medium mb-1">Limited warranty:</div>
            <div className="whitespace-pre-line">
              All materials and parts are warranted for 90 days. All labor
              performed is warranted for 30 days. Warranty does not extend to
              fuses, freon, filters, access valves and moving parts. Warranty
              will not apply if customer fails to contact Common Appliance
              Repair LLC within 24 hours from the time when the warranty claim
              arose and/or fails to permit to perform warranty service. Warranty
              is limited solely to the acts, promises, representations or
              omissions of Common Appliance Repair LLC and not any other person,
              whether or not the service provided herein is based on the
              referral by such person.
            </div>
          </div>

          {/* Totals box */}
          <div className="flex flex-col">
            <div className="flex ">
              <div className="w-48 border-x border-black  text-sm">
                <div className="flex text-sm font-bold justify-start border-b border-black p-1">
                  <span>Total Material:</span>
                  <span className="ml-1 font-normal opacity-0">Blank</span>
                </div>
                <div className="flex text-sm font-bold justify-start border-b border-black p-1">
                  <span>Total Labor:</span>
                  <span className="ml-1 font-normal opacity-0">Blank</span>
                </div>
                <div className="flex text-sm font-bold justify-start border-b border-black p-1">
                  <span>Coupon:</span>
                  <span className="ml-1 font-normal opacity-0">Blank</span>
                </div>
                <div className="flex text-sm font-bold justify-start border-b border-black p-1">
                  <span>Deposite $:</span>
                  <span className="ml-1 font-normal opacity-0">Blank</span>
                </div>
                <div className="flex text-sm font-bold justify-start border-b border-black p-1">
                  <span>Total Amount:</span>
                </div>
              </div>
              <div className="w-48 h-full border-r border-black flex flex-col items-start">
                <div className="flex w-full text-sm font-normal justify-center border-b border-black p-1">
                  <span className="opacity-0">{"s "}</span>
                </div>
                <div className="flex w-full text-sm font-normal justify-center border-b border-black p-1">
                  <span className="opacity-0">{"s "}</span>
                </div>
                <div className="flex w-full text-sm font-normal justify-center border-b border-black p-1">
                  <span className="opacity-0">{"s "}</span>
                </div>
                <div className="flex w-full text-sm font-bold justify-start border-b border-black p-1">
                  <span>Balance $:</span>
                  <span className="ml-1 font-normal opacity-0">blank</span>
                </div>
                <div className="flex w-full text-sm font-normal justify-center border-b border-black p-1">
                  <span className="opacity-0">{"s "}</span>
                </div>
              </div>
            </div>
            <div className="border-x border-b text-sm font-bold border-black flex justify-between p-1">
              <label>Check</label>
              <label>Card</label>
              <label>Cash</label>
            </div>
          </div>
        </div>
        <div className="w-full text-xs">
          <div className="font-medium mb-1">Disclaimer or Liability:</div>
          <div className="whitespace-pre-line">
            Customer agrees that Common Appliance Repair LLC will not be
            responsible for leaks and scratching or other occurrences causing
            spoilage or damage to food, floors, cabinets, counters arising by
            reason of service provided hereunder as well as the removal of
            appliances or fixtures. Customer understands that Common Appliance
            Repair LLC is a subcontractor, which is not responsible for
            warranties or representations by contractors or referral.
          </div>
        </div>
        <div className="w-full text-xs">
          <div className="font-medium mb-1">Estimate Acknowledgement:</div>
          <div className="whitespace-pre-line">
            As estimated for repairs shall be given to the customer by the
            service dealer in writing, and the service dealer may not charge for
            the work done or nee performed in excess of the estimate without
            prior consent of the customer. Where provide In writing, the service
            dealer may charge a reasonable fee for service, provided in
            determining the nature of malfunction in preparation of a written
            estimate of repair. For more information, please contact Bureau of
            Electronics Repair and Appliances Repair. I acknowledge that I have
            authority to order and do hereby order the work outlined herein. I
            agree that Common Appliance Repair LLC Retains title In all
            equipment and materials until full payment is rendered.
          </div>
        </div>

        {/* Footer signatures */}
        <div className="w-full flex bg-white z-10 justify-center absolute p-4 bottom-0 right-0 left-0">
          <div className="w-full    border text-lg border-black flex-col">
            <div className="w-full h-12 border-b border-black" />
            <div className="grid grid-cols-2">
              <div className="border-r border-black font-bold p-3 h-20 flex items-center">
                Technician:{" "}
              </div>
              <div className=" p-3 h-20 flex font-bold items-center">
                Customer:{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

A4Invoice.displayName = "A4Invoice";
export default A4Invoice;
