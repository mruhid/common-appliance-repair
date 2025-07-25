"use client";

import { useEffect } from "react";
import { useUserStore } from "./context/useUserStore";
import { CCSTaffProps } from "@/lib/types";

export default function UserHydration({ user }: { user: CCSTaffProps | null }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null; 
}
