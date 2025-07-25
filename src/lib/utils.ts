import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeLeftFromTimestamp(timestamp: Timestamp): string {
  const actionTime = timestamp.toDate();
  const now = new Date();

  if (actionTime < now) return "Expired";

  return `in ${formatDistanceToNow(actionTime, { addSuffix: false })}`;
}
export function formattedDate(timestamp: Timestamp): string {
  if (!timestamp || !(timestamp instanceof Timestamp)) return "Invalid date";
  const date = timestamp.toDate();
  return format(date, "dd MMM yyyy, HH:mm");
}
