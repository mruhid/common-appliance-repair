import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata: Metadata = {
  title: {
    template: "%s | Common Appliance Repair",
    default: "Common Appliance Repair",
  },
  description:
    "Internal call center tool for logging and assigning appliance repair tickets to field engineers.",
  keywords: [
    "Appliance Repair",
    "Customer Service",
    "Ticket Management",
    "Repair Dashboard",
    "Field Engineers",
    "Internal Tools",
  ],
  authors: [{ name: "Common Appliance Repair Team" }],
  creator: "Common Appliance Repair",
  publisher: "Common Appliance Repair",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="#1e3a8a" height={4} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
