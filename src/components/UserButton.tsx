"use client";

import { logout } from "@/app/(main)/action";
import { useSession } from "@/app/(main)/context/UserProvider";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check, LogOutIcon, Monitor, Moon, Sun, Tickets } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useSession();
  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full border-[3px] focus:outline-none border-primary/60 bg-card p-1 shadow-sm transition-all hover:brightness-105",
            className
          )}
        >
          <UserAvatar avatarUrl={"company"} size={50} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 p-2 rounded-xl border border-muted-foreground/20 shadow-xl"
      >
        <div className="mb-2 flex items-center gap-3 border-b border-muted pb-2">
          <UserAvatar avatarUrl={""} size={35} />
          <div>
            <p className="text-sm capitalize font-medium">
              @{user ? user.username.split(" ")[0] : ""}
            </p>
            <p className="text-xs text-muted-foreground">Logged in</p>
          </div>
        </div>

        <Link href={`/create-tiket`}>
          <DropdownMenuItem className="rounded-lg py-2 transition-all hover:bg-primary/10">
            <Tickets className="mr-2 size-4" />
            New Ticket
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg py-2">
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="rounded-lg py-2">
              <DropdownMenuItem
                className="rounded-lg py-2"
                onClick={() => setTheme("system")}
              >
                <Monitor className="mr-2 size-4" />
                System default
                {theme === "system" && <Check className="size- ms-2" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg py-2"
                onClick={() => setTheme("light")}
              >
                <Sun className="mr-2 size-4" />
                Light
                {theme === "light" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg py-2"
                onClick={() => setTheme("dark")}
              >
                <Moon className="mr-2 size-4" />
                Dark
                {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logout();
          }}
          className="rounded-lg py-2 transition-all hover:bg-destructive/10"
        >
          <LogOutIcon className="mr-2 size-4 text-destructive" />
          <span className="text-destructive">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
