import { app } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const db = getFirestore(app);

export async function updateClosedTicketStatus(
  ticketNumber: string
): Promise<{ success: boolean; ticketNumber: string }> {
  try {
    // 1. Check ticket in Tickets collection
    const ticketsRef = collection(db, "Tickets");
    const ticketQuery = query(
      ticketsRef,
      where("TicketNumber", "==", ticketNumber)
    );
    const ticketSnapshot = await getDocs(ticketQuery);

    if (ticketSnapshot.empty) {
      throw new Error("Ticket does not exist.");
    }

    const ticketDoc = ticketSnapshot.docs[0];
    const ticketData = ticketDoc.data();

    if (ticketData.TicketStatus !== "Closed") {
      throw new Error("Only closed tickets can be recalled.");
    }

    const jobsRef = collection(db, "Jobs");
    const jobsQuery = query(jobsRef, where("TicketNumber", "==", ticketNumber));
    const jobsSnapshot = await getDocs(jobsQuery);

    if (jobsSnapshot.empty) {
      throw new Error("Matching job not found for the ticket.");
    }

    const jobDoc = jobsSnapshot.docs[0];

    await updateDoc(ticketDoc.ref, {
      TicketStatus: "Recalled",
    });
    await updateDoc(jobDoc.ref, {
      TicketStatus: "Recalled",
      Status: "Installing",
    });

    return { success: true, ticketNumber };
  } catch (error: any) {
    console.error(error.message);
    throw new Error(
      error.message || "Something went wrong while updating ticket status."
    );
  }
}
