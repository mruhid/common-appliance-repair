"use client";

import Logo from "@/assets/logo-with-name.webp";
import Image from "next/image";
import {forwardRef, ReactNode} from "react";

type A4InvoiceProps = {
    children?: ReactNode;
};

const A4Invoice = forwardRef<HTMLDivElement, A4InvoiceProps>(({children}: { children?: ReactNode }) => {
    return (
        <div
            className="a4 relative shadow-md text-black bg-white"
            style={{width: "210mm", minHeight: "297mm"}}
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
                    <div className="w-full flex justify-between items-center">
                        <div className="relative w-[170px] h-[110px] flex items-center justify-center">
                            <Image
                                src={Logo}
                                alt="Logo"
                                fill
                                className="object-cover invert brightness-90"
                                priority
                            />
                        </div>
                        <div className="text-xl mt-3 font-bold">
                            Phone: <span>+1 (774) 414-4038</span>
                        </div>
                    </div>

                </div>

                {children}

                <div className=" flex w-full justify-between">
                    {/* Warranty / Terms */}
                    <div className="mt-4 text-sm">
                        <div className="font-medium mb-1">Limited warranty & Policy:</div>
                        <div className="whitespace-pre-line">
                            All materials and parts are warranted for 60 days. Labor is warranted for 30 days. Warranty
                            does not cover fuses, filters, belts, access valves, or moving parts.
                            A deposit is required upon repair approval and is non-refundable once approved. If the
                            customer cancels or declines after approval, the deposit will not be refunded, as parts may
                            have been ordered or purchased.
                            Service call fee is non-refundable.
                            Common Appliance Repair LLC is not responsible for issues unrelated to the repair performed.
                        </div>
                    </div>

                </div>
                <div className="w-full mt-4 text-sm">
                    <div className="font-medium mb-1">Disclaimer or Liability:</div>
                    <div className="whitespace-pre-line">
                        Customer agrees that Common Appliance Repair LLC will not be responsible for leaks and
                        scratching or other occurrences causing spoilage or damage to food, floors, cabinets, counters
                        arising by reason of service provided hereunder as well as the removal of appliances or
                        fixtures. Customer understand that Common Appliance Repair LLC is a subcontractor, which is not
                        responsible for warranties or representations by contractors or referral.
                    </div>
                </div>
            </div>
        </div>
    );
});

A4Invoice.displayName = "A4Invoice";
export default A4Invoice;
