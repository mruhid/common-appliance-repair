"use client";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { Input } from "@/components/ui/input";
import { findUserByCredentials } from "@/lib/fetchCollection";
import { CCSTaffProps } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "./context/UserProvider";

export default function LoginModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [modalInputs, setModalInputs] = useState<CCSTaffProps>({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModalInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const foundUser = await findUserByCredentials(
        modalInputs.username.trim(),
        modalInputs.password.trim()
      );
      if (!foundUser) {
        toast.error("Username or password not correct", {
          description: "Make sure you typed correct username and password",
        });
        setError("Invalid credentials");
        setIsLoading(false);
        return;
      }
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(foundUser),
      });

      if (!res.ok) {
        const { message } = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(message || "Failed to set user cookie.");
      }

      await new Promise((r) => setTimeout(r, 100));

      setIsLoading(false);

      toast.success("Welcome back", {
        description: `Good to see you again here, ${
          foundUser.Name
            ? foundUser.Name.split(" ")[0].charAt(0).toUpperCase() +
              foundUser.Name.split(" ")[0].slice(1).toLowerCase()
            : ""
        }`,
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
      setError("Server error or no response. Please try again later.");
      toast.error("Error", {
        description: error as string,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user && user !== undefined) return children;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex bg-secondary rounded-lg shadow-sm border w-full max-w-lg p-4 justify-center  items-center">
        <div className="w-full flex flex-col justify-center items-center gap-2 space-y-2">
          <h1 className="text-2xl font-semibold">Enter Access Code</h1>

          <p
            className={`text-sm font-semibold text-destructive ${error ? "opacity-100" : "opacity-0"}`}
          >
            {error}
          </p>

          <div className="flex flex-col w-full gap-1">
            <p className="text-muted-foreground text-sm">Username</p>
            <Input
              className="h-12 bg-background rounded-lg"
              autoFocus
              placeholder="Username"
              autoComplete="off"
              name="username"
              value={modalInputs.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <p className="text-muted-foreground text-sm">Password</p>
            <PasswordInput
              className="h-12 bg-background rounded-lg"
              placeholder="Password"
              name="password"
              value={modalInputs.password}
              onChange={handleInputChange}
            />
          </div>

          <LoadingButton
            onClick={handleLogin}
            className="h-12 w-full rounded-lg"
            loading={isLoading}
            disabled={
              isLoading ||
              !modalInputs.username.trim() ||
              !modalInputs.password.trim()
            }
            variant="companyBtn"
          >
            Continue
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
