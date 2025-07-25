import { db } from "@/lib/firebase";
import { TicketStatusTypes } from "@/lib/types";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

export interface TicketProps {
  ActionDate: Timestamp;
  ActionTime: string;
  Address: string;
  Apartment: string;
  CustomerName: string;
  Phone: string;
  Description: string;
  SC: number;
  Technician: string;
  TicketNumber: string;
  Done: boolean;
  TicketStatus: TicketStatusTypes;
}

interface CreateTicketResult {
  message: string;
  success: boolean;
}

export async function createTicket(
  ticketData: TicketProps
): Promise<CreateTicketResult> {
  const q = query(
    collection(db, "Tickets"),
    where("TicketNumber", "==", String(ticketData.TicketNumber).toUpperCase())
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error(
      "Ticket number already exists. Please use a different one."
    );
  }

  await addDoc(collection(db, "Tickets"), ticketData);

  return {
    message: "Ticket successfully created!",
    success: true,
  };
}
