"use client";
import UserButton from "@/components/UserButton";
import { navVariants, textVariant } from "@/lib/motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "./context/UserProvider";
import ServiceCallPolicyDialog from "@/components/ServiceCallPolicyDialog";
import { toUpperCase } from "zod";

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
        <motion.div
          className="flex  justify-center items-center gap-2 bg-background border px-2 py-3 rounded-lg text-center"
          variants={textVariant(1.1)}
        >
          <Link href="/" className="text-xl font-bold text-primary">
            {user
              ? "Welcome back " + user.username.split(" ")[0].toUpperCase()
              : "Common Appliance Repair"}
          </Link>

          <div>
            <ServiceCallPolicyDialog />
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </motion.header>
  );
}
