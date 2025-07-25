"use client";

import { create } from "zustand";
import { CCSTaffProps } from "@/lib/types";

interface UserState {
  user: CCSTaffProps | null;
  setUser: (user: CCSTaffProps) => void;
  logoutUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logoutUser: () => set({ user: null }),
}));
