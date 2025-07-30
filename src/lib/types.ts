import { Timestamp } from "firebase/firestore";

export interface EmployeesProps {
  id?: string;
  name: string;
  password: string;
  username: string;
  WorkShare: string;
}
export interface CCSTaffProps {
  Name?: string;
  password: string;
  username: string;
}

export type TicketStatusTypes = "Open" | "Recalled" | "Closed";

export interface InvoiceProps {
  id?: string;
  ActionDate: Timestamp;
  ActionTime: string;
  Address: string;
  Apartment: string;
  CustomerName: string;
  Description: string;
  NumberOfParts: number;
  PartsCost: number;
  PaymentType: string;
  Phone: string;
  Status: string;
  Technician: string;
  TicketNumber: string;
  TicketStatus: TicketStatusTypes;
  TotalPrice: number;
}

export interface EmployeeProps {
  PhoneNumber: string;
  name: string;
}
