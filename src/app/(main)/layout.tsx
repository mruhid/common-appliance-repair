import { getUser } from "@/lib/storage";
import UserProvider from "./context/UserProvider";
import Navbar from "./Navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <UserProvider value={{ user }}>
      <main className="min-h-screen bg-background w-full flex flex-col">
        <Navbar />
        {children}
      </main>
    </UserProvider>
  );
}
