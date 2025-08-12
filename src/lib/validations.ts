import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");
const phoneRegex = /^\+?\d{10,15}$/;

export const createTicketSchema = z.object({
  Day: requiredString.refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1 && num <= 31;
    },
    { message: "Day must be between 1 and 31" }
  ),

  Month: requiredString.refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1 && num <= 12;
    },
    { message: "Month must be between 1 and 12" }
  ),

  Year: requiredString,
  ActionTime: requiredString,
  Address: requiredString,
  Apartment: requiredString,
  CustomerName: requiredString,
  Phone: requiredString
    .regex(/^\d+$/, { message: "Only numbers are allowed" })
    .regex(phoneRegex, "Invalid phone number"),
  Description: requiredString
    .min(20, "At least be 20 characters of description")
    .max(200, "Description limit reached"),
  SC: requiredString.regex(/^\d+$/, "Only numbers are allowed"),
  Technician: requiredString,
  ActionDate: requiredString.optional(),
  Done: z.boolean().default(false),
  TicketNumber: requiredString,
});

export type CreateTicketFormValue = z.infer<typeof createTicketSchema>;
