"use client";
import UserButton from "@/components/UserButton";
import { navVariants, textVariant } from "@/lib/motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "./context/UserProvider";

export default function Navbar() {
  const { user } = useSession();

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-secondary/70 "
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <motion.div variants={textVariant(1.1)}>
          <Link
            href="/"
            className="text-2xl capitalize font-bold text-foreground"
          >
            {user
              ? "Welcome back" + " " + user.username.split(" ")[0]
              : "Common Appliance Repair"}
          </Link>
        </motion.div>

        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </motion.header>
  );
}
