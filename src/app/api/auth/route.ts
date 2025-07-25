// app/api/auth/set-user/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const encodedUser = Buffer.from(JSON.stringify(body)).toString("base64");
  const cookieStore = await cookies();
  cookieStore.set("auth_user", encodedUser, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ message: "User cookie set" });
}
