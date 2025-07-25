import { cookies } from "next/headers";
import { CCSTaffProps } from "./types";

export async function getUser(): Promise<CCSTaffProps | null> {
  const cookieStore = await cookies();

  const encoded = cookieStore.get("auth_user")?.value;
  if (!encoded) return null;

  try {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}
