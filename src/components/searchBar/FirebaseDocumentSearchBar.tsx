"use client";
import { formattedDate, getTimeLeftFromTimestamp } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { AlertCircle, Loader2, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import useFirebaseDocumentSearch from "./useFirebaseDocumentSearch";
import { motion, AnimatePresence } from "framer-motion";

interface FirebaseDocumentSearchBarProps {
  documentName: string;
  fieldsNameArray: string[];
  searchBarPlaceholder: string;
}

export default function FirebaseDocumentSearchBar<T>({
  documentName,
  fieldsNameArray,
  searchBarPlaceholder,
}: FirebaseDocumentSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SearchSection<T>
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        documentName={documentName}
        fieldsNameArray={fieldsNameArray}
      />
      <div
        onClick={() => setIsOpen(true)}
        className="relative my-2 cursor-pointer w-full z-0 h-14 border rounded-md bg-background border-muted-foreground flex items-center gap-3 px-4 shadow-sm hover:shadow-md transition"
      >
        <SearchIcon className="size-5 text-muted-foreground" />
        <p className="text-muted-foreground text-base truncate">
          {searchBarPlaceholder}
        </p>
      </div>
    </>
  );
}

interface SearchSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  fieldsNameArray: string[];
}

function SearchSection<T>({
  isOpen,
  onOpenChange,
  documentName,
  fieldsNameArray,
}: SearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { documents, isPending, notFound, error } =
    useFirebaseDocumentSearch<T>(documentName, fieldsNameArray, searchTerm);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 z-50 w-full h-screen bg-background/95 backdrop-blur-sm flex flex-col p-4"
      >
        <div className="fixed top-0 left-0 z-50 w-full h-screen bg-background/95 backdrop-blur-sm flex flex-col p-4">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => onOpenChange(false)}
              size="icon"
              variant="outline"
              className="rounded-full"
            >
              <XIcon className="size-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-3 w-full max-w-5xl mx-auto bg-muted border border-muted-foreground rounded-xl px-4 py-3 shadow-md">
            <SearchIcon className="size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Write on here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-base placeholder:text-muted-foreground"
            />
          </div>

          <div className="mt-4 w-full h-full max-w-5xl mx-auto overflow-y-auto border border-muted-foreground rounded-md bg-muted p-4 shadow space-y-4">
            {isPending && (
              <div className="flex justify-center items-center w-full h-full">
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="size-7 animate-spin mb-2" />
                  <span className="text-md">Searching...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center w-full h-full">
                <div className="flex flex-col items-center justify-center py-10 text-destructive text-center space-y-2">
                  <AlertCircle className="size-7" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Not Found State */}
            {notFound && (
              <div className="flex justify-center items-center w-full h-full">
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm py-10">
                  <AlertCircle className="size-7 text-destructive" />
                  <span className="text-lg">No results found.</span>
                </div>
              </div>
            )}

            {!isPending && !error && !notFound ? (
              searchTerm.trim() ? (
                documents.map((item, i) => (
                  <div
                    key={i}
                    className="border rounded-xl bg-background p-4 shadow hover:shadow-md transition"
                  >
                    {/* Title: TicketNumber */}
                    {item &&
                      typeof item === "object" &&
                      "TicketNumber" in item &&
                      typeof item["TicketNumber"] === "string" && (
                        <h3 className="text-lg font-semibold mb-2 text-primary">
                          Ticket Nº {item["TicketNumber"]}
                        </h3>
                      )}

                    {/* Key-Value Fields */}
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {Object.entries(item as Record<string, unknown>)
                        .filter(
                          ([key]) =>
                            !["id", "Done", "TicketNumber"].includes(key)
                        )
                        .map(([key, value]) => (
                          <p key={key}>
                            <span className="font-semibold">{key}:</span>{" "}
                            <span>
                              {key === "ActionDate" &&
                              value instanceof Timestamp
                                ? `${getTimeLeftFromTimestamp(value)} | ${formattedDate(value)}`
                                : String(value)}
                            </span>
                          </p>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  <h2 className="text-center text-lg text-muted-foreground my-10">
                    Please enter a value to start searching.
                  </h2>
                </div>
              )
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
