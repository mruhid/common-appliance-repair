import LogoWithWords from "@/assets/logo-with-name.webp";
import { slideIn, staggerContainer, textVariant } from "@/lib/motion";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function HomeHeroSection() {
  return (
    <motion.main
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="flex min-h-screen flex-col-reverse items-center justify-center gap-6 px-5 py-12 text-center text-foreground md:flex-row md:text-start lg:gap-12"
    >
      <div className="relative z-10 max-w-prose space-y-3">
        <motion.h1
          variants={textVariant(1.1)}
          className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
        >
          Fast & Reliable{" "}
          <span className="inline-block bg-gradient-to-r from-primary/50 to-primary bg-clip-text text-transparent">
            Appliance Repair
          </span>{" "}
          Services
        </motion.h1>
        <p className="text-lg text-muted-foreground">
          This internal tool helps call center agents quickly register appliance
          issues and assign service engineers for fast resolution.
        </p>
        <Button className="h-14 w-full text-xl" variant={"companyBtn"} asChild>
          <Link href={"/create-ticket"}>New Service Ticket</Link>
        </Button>
      </div>

      <div>
        <motion.div
          variants={slideIn("right", "tween", 0.3, 1)}
          className="relative mt-4"
        >
          <div className="absolute -top-[30px] h-full w-full rounded-tr-[140px] bg-gradient-to-r from-primary to-indigo-900 " />

          <Image
            src={LogoWithWords}
            alt="Common Appliance Repair Banner"
            width={500}
            className=" relative z-10 rounded-tr-[140px] "
          />
        </motion.div>
      </div>
    </motion.main>
  );
}
