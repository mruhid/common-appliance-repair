import HomePageElements from "@/components/home/HomePageElements";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Welcome to Call Center",
};
export default function Home() {
  return <HomePageElements />;
}
