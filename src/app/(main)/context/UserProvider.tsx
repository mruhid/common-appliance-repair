"use client";

import React, { createContext, useContext } from "react";
import { CCSTaffProps } from "@/lib/types";

interface SessionContext {
  user: CCSTaffProps | null;
}

const SessionContext = createContext<SessionContext | undefined>(undefined);

export default function UserProvider({
  value,
  children,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within UserProvider");
  return context;
}
