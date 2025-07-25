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
